import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Shield,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  User,
} from "lucide-react";
import background from "../../assets/backgrounds/sssurf.svg";
import useAuth from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button/Button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function SignIn() {
  const { signin } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({ mode: "onSubmit" });

  const onSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);
    setAuthError("");

    try {
      await signin(data);
    } catch (error) {
      setAuthError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputFocus = () => {
    clearErrors();
    setAuthError("");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
      }}
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center justify-center p-4"
    >
      {/* Dark mode overlay for background image */}
      <div className="absolute inset-0 bg-body-50 dark:bg-body-950"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Header Card */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-body-50 dark:bg-body-900 backdrop-blur-sm rounded-2xl shadow-lg mb-4 border border-body-200 dark:border-body-700">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-body-900 dark:text-body-50 font-['Lora'] tracking-tight">
            Support Panel
          </h1>
          <p className="text-body-600 dark:text-body-400 mt-2 text-sm">
            Secure access to your dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-body-50 dark:bg-body-900/95 backdrop-blur-sm rounded-xl shadow-xl border border-body-200 dark:border-body-700 p-8">
          {/* Error Message */}
          {authError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  Authentication Error
                </p>
                <p className="text-sm text-error dark:text-red-400 mt-1">
                  {authError}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-body-700 dark:text-body-300 block"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className="w-4 h-4 text-body-400 dark:text-body-500" />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  onFocus={handleInputFocus}
                  className={cn(
                    "w-full pl-10 pr-4 py-3",
                    "bg-body-50 dark:bg-body-900",
                    "border border-body-300 dark:border-body-600",
                    "rounded-lg",
                    "text-body-900 dark:text-body-50",
                    "placeholder:text-body-400 dark:placeholder:text-body-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                    "transition-all duration-200",
                    errors.username &&
                      "border-error dark:border-error focus:ring-error/20",
                    // "hover:border-body-400 dark:hover:border-body-500",
                  )}
                  {...register("username", {
                    required: "Username is required",
                    validate: {
                      notEmpty: (value) =>
                        !!value.trim() || "Username is required",
                    },
                  })}
                />
                {errors.username && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-body-700 dark:text-body-300 block"
                >
                  Password
                </label>
                {/* <button
                  type="button"
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
                  Forgot password?
                </button> */}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-body-400 dark:text-body-500" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onFocus={handleInputFocus}
                  className={cn(
                    "w-full pl-10 pr-10 py-3",
                    "bg-body-50 dark:bg-body-900",
                    "border border-body-300 dark:border-body-600",
                    "rounded-lg",
                    "text-body-900 dark:text-body-50",
                    "placeholder:text-body-400 dark:placeholder:text-body-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                    "transition-all duration-200",
                    errors.password
                      ? "border-error dark:border-error focus:ring-error/20"
                      : "hover:border-body-400 dark:hover:border-body-500",
                  )}
                  {...register("password", {
                    required: "Password is required",
                    validate: {
                      notEmpty: (value) =>
                        !!value.trim() || "Password is required",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-body-400 hover:text-body-600 dark:text-body-500 dark:hover:text-body-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-body-300 dark:border-body-600 bg-body-50 dark:bg-body-900 text-primary-600 dark:text-primary-400 focus:ring-2 focus:ring-primary-500/20"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-body-600 dark:text-body-400 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary-600 
             dark:text-white font-medium rounded-lg transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    <span>Sign In</span>
                  </>
                )}
              </div>
            </Button>
          </form>

          {/* Support Link */}
          <div className="mt-6 pt-6 border-t border-body-200 dark:border-body-700 text-center">
            <p className="text-sm text-body-500 dark:text-body-400">
              Need an account?{" "}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Contact administrator
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="text-sm text-body-500 dark:text-body-400 mb-1">
            Powered by{" "}
            <span className="font-semibold text-body-700 dark:text-body-300">
              FINNAUX
            </span>
          </div>
          <p className="text-xs text-body-400 dark:text-body-500">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
