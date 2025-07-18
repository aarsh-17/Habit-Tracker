import jwt from "jsonwebtoken";
import User from "../model/User.js";
export const protectedRoute=async(req,res,next)=>{
  try{
    const accessToken=req.cookies.accessToken;
    
    
  if(!accessToken){
    return res.status(401).json({error:"Access token not found"});
  }
  try {
    const decoded =jwt.verify(accessToken,process.env.JWT_SECRET);
    console.log(decoded);
    
  const user=await User.findById(decoded.userId).select("-password");

  if(!user){
    return res.status(401).json({error:"User not found"});
  }
  req.user=user;
  next();
    
  } catch (error) {
    if(error.name==="TokenExpiredError"){
      return res.status(401).json({error:"Access token expired"});
    }
    throw error;
  }
}catch(error){
  console.log(error.message);
  return res.status(500).json({error:"Internal server error"});
}
  
}

export const adminRoute=(req,res,next)=>{

  
  if(req.user.role!=="admin"){
    return res.status(401).json({error:"Unauthorized"});
  }
  next();
}