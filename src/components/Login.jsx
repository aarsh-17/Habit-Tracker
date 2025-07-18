import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useHabit } from "../context/HabitContext.jsx";

const Login = () => {
 
  const {username}=useHabit();
   const [isSignup,setIsSignup]= useState(false);
  const [name,setName]= useState('');
  const [showPassword,setShowPassword]=useState(false);
  const[email,setEmail]= useState('')
  const[password,setPassword]= useState('')
  const [error, setError] = useState(false);
    const [emailerror, setEmailerror] = useState(false);
  const [passworderror, setPassworderror] =  useState(false);
  const [nameerror, setNameerror] = useState(false);
  const navigate=useNavigate();
  const handlesubmit = async (e) => {
  e.preventDefault();

  const url = `http://localhost:5000/auth/${isSignup ? "signup" : "login"}`;
  const payload = isSignup
    ? { fullname: name, email, password }
    : { email, password };

  // Basic validation
  resetErrors();
  if (email === "") return setEmailerror(true);
  if (password === "") return setPassworderror(true);
  if (isSignup && name === "") return setNameerror(true);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Authentication failed");
    }

    if (isSignup) {
      // After signup, navigate to login
      setIsSignup(false);
      setError(false);
      navigate("/login");
    } else {
      // Save token, redirect to dashboard

   
      const getUsername=async()=>{
        try {
          const res = await fetch(`http://localhost:5000/user/${email}`, {
          method: "GET",
          credentials: "include", // ✅ ensures cookies are sent
        });
        const data = await res.json();
  
        
        return data.fullname
        } catch (error) {
          console.error(error.message);
          
        }
        
      };
      
      getUsername().then((name) => {
        localStorage.setItem("username",name);
        });
      
      
      setError(false);
      navigate("/dashboard");
    }
  } catch (err) {
    setError(err.message || "Something went wrong");
  }
};


  const switchMode = () => {
    setIsSignup(!isSignup);
    setEmail('');
    setPassword('');
    setName('');
    resetErrors();
  };


  const resetErrors=()=>{
    setEmailerror(false);
    setNameerror(false);
    setPassworderror(false);
  }


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {isSignup ? (
                <User className="w-8 h-8 text-white" />
              ) : (
                <Lock className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-blue-100 text-sm">
              {isSignup ? "Join us and start tracking your habits" : "Sign in to continue your journey"}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Name field for signup */}
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-200 ${
                        nameerror ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {nameerror && <p className="text-red-500 text-sm mt-2">Name is required</p>}
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-200 ${
                      emailerror ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {emailerror && <p className="text-red-500 text-sm mt-2">Email is required</p>}
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-200 ${
                      passworderror ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                    )}
                  </button>
                </div>
                {passworderror && <p className="text-red-500 text-sm mt-2">Password is required</p>}
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                  <p className="text-red-600 text-sm">Invalid email or password. Please try again.</p>
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handlesubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                {isSignup ? "Create Account" : "Sign In"}
              </button>
            </div>

            {/* Switch mode */}
            <div className="mt-8 text-center">
              <button
                onClick={switchMode}
                className="text-gray-600 hover:text-blue-500 text-sm font-medium transition-colors duration-200"
              >
                {isSignup 
                  ? "Already have an account? Sign In" 
                  : "Don't have an account? Create one"}
              </button>
            </div>

            {/* Demo info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
              <p className="text-gray-500 text-xs text-center">
                🔒 Demo Mode: Data stored securely in memory
              </p>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Login;