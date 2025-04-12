
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic would go here
    console.log("Login attempt with:", { email, password, rememberMe });
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-primary text-3xl font-bold mb-2">Orbix</h1>
          <h2 className="text-gray-700 text-xl font-medium leading-tight mb-6">
          AI-Powered Trading, Risk & Compliance for Investment Success
          </h2>
          <p className="text-gray-600 mb-6">Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700 font-medium">Email</span>
            </div>
            <Input 
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700 font-medium">Password</span>
            </div>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember Me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-primary">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-primary text-white">
            Sign In
          </Button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account? 
            <a href="#" className="text-primary font-medium ml-1">
              Contact administrator
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
