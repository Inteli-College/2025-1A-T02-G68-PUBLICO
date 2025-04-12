
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Forgot password logic would go here
    console.log("Password reset requested for:", email);
    setSubmitted(true);
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-primary text-3xl font-bold mb-2">TradeTrack</h1>
          <h2 className="text-gray-700 text-xl font-medium leading-tight mb-6">
            Reset Your Password
          </h2>
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 font-medium">Email Address</span>
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

            <Button type="submit" className="w-full bg-primary text-white">
              Send Reset Link
            </Button>
            
            <div className="mt-4">
              <Link to="/" className="flex items-center text-sm text-gray-600 hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="rounded-full bg-green-50 p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Check your email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setSubmitted(false)}
              >
                Try a different email
              </Button>
              <Link to="/">
                <Button type="button" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
