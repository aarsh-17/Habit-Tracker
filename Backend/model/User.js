import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please add a name"]
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please add a password"]
  },

});

// Hash password before saving
userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    next();
  }
  try{
    const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
  }
  catch(error){
    next(error);
  }
})

userSchema.methods.comparePassword=async function(password){
  return bcrypt.compare(password,this.password);
}

const User=mongoose.model("User",userSchema);
export default User;
