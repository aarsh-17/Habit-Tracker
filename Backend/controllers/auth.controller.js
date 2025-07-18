import User from "../model/User.js"
import jwt from "jsonwebtoken";
import redis from "../lib/redis.js";

const generateToken=(userId)=>{
	const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15m",
	})

	const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, {
		expiresIn: "7d",
	})


	return { accessToken, refreshToken }
}

const storeRefreshToken = async (userId, refreshToken) => {
  if (!userId || !refreshToken) {
    throw new Error("Invalid arguments: userId and refreshToken are required");
  }

  try {
    await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
  } catch (error) {
    console.error("Error storing refresh token:", error);
    throw new Error("Failed to store refresh token");
  }
}

const setCookies=(res,accessToken,refreshToken)=>{
	res.cookie("accessToken",accessToken,
		{httpOnly:true,
		secure:process.env.NODE_ENV==="production",
		sameSite:"strict",
		maxAge:15*60*1000}
	);

	res.cookie("refreshToken",refreshToken,
		{httpOnly:true,
		secure:process.env.NODE_ENV==="production",
		sameSite:"strict",
		maxAge:7*24*60*60*1000}
	);
}
export const signup= async (req,res)=>{
  try{
    console.log(req.body);
    
    const {fullname,email,password}=req.body;
    console.log(fullname,email,password);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if(email===undefined){
		return res.status(400).json({ error: "Email is required" });	
		}

		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}


		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}
		const user=new User({fullname,password,email});
		await user.save();

		const {accessToken,refreshToken}=generateToken(user._id);
		await storeRefreshToken(user._id,refreshToken);
		setCookies(res,accessToken,refreshToken);
		
		
		res.status(201).json({
			user:
			{
				_id:user._id,
				email:user.email,
				role:user.role
			},
		message:"User created successfully"});
  }
  catch(error){
		console.log("error in signup",error.message);
		res.status(500).json({ error: "Internal server error" });
  }
} 

export const login= async (req,res)=>{
  const {email,password}=req.body;
	try{
		const user=await User.findOne({email});
		if(!user){
			res.status(401).send({message:"User not found"});
		}

		const isPasswordValid=await user.comparePassword(password);
		if(!isPasswordValid){
			res.status(401).send({message:"Invalid password"});
		}


		const {accessToken,refreshToken}=generateToken(user._id)

		await storeRefreshToken(user._id,refreshToken);
		setCookies(res,accessToken,refreshToken);
		
		res.status(200).json({
			user:
			{
				_id:user._id,
				email:user.email
			},
		message:"User logged in successfully"});
	}
	catch(error){
		console.log("error in login",error.message);
		res.status(500).json({ error: "Internal server error" });
	}
} 

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const refreshToken= async (req,res)=>{
	try{
		const refreshToken=req.cookies.refreshToken;
		if(!refreshToken){
			return res.status(401).json({ error: "Refresh token not found" });
		}
		const decode=jwt.verify(refreshToken,process.env.JWT_SECRET_REFRESH);
		const storedtoken= await redis.get(`refreshToken:${decode.userId}`);
		if(storedtoken!==refreshToken){
			return res.status(401).json({ error: "Invalid refresh token" });
		}
		const accessToken=jwt.sign({userId:decode.userId},process.env.JWT_SECRET,{expiresIn:"15m"});

		res.cookie("accessToken",accessToken,{
			httpOnly:true,
			secure:process.env.NODE_ENV==="production",
			sameSite:"strict",
			maxAge:15*60*1000}
		);

		res.status(200).json({ accessToken });
	}
	catch(error){
		res.status(500).json({ error: "Internal server error" });
	}
}
		
