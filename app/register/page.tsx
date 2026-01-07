"use client";
import { SignupFormSchema } from "@/lib/validations/auth";
import {
  ArrowForward,
  CheckCircleOutlined,
  Lock,
  LockReset,
  Mail,
  VerifiedUser,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const validatedFields = SignupFormSchema.safeParse(formData);
    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      const errorObj: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, errorArray]) => {
        if (errorArray && errorArray.length > 0) {
          errorObj[key] = errorArray[0];
        }
      });
      setErrors(errorObj);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedFields.data),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful - redirect to dashboard
        router.push("/contracts");
      } else {
        // Handle errors
        if (data.error) {
          setErrors({ general: data.error });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-white min-h-screen flex flex-col">
      <main className="flex grow items-center justify-center relative pt-24 pb-12 px-4 sm:px-6">
        <div className="absolute inset-0 bg-slate-50 bg-grid-pattern bg-size-[40px_40px] opacity-60 pointer-events-none"></div>
        <div className="absolute top-0 left-1/4 w-125 h-125 bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-cyan-500/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob delay-1000 pointer-events-none"></div>
        <div className="w-full max-w-5xl bg-white rounded-4xl shadow-2xl shadow-slate-900/5 border border-slate-200 overflow-hidden flex flex-col md:flex-row relative z-10 animate-slide-up">
          <div className="w-full md:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">
                Create your account
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                Join the platform where legal meets digital speed
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="group">
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 transition-colors"
                    htmlFor="first-name"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="block w-full rounded-lg border-slate-200 bg-slate-200/45 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm py-3 px-4 transition-all hover:bg-white focus:bg-white"
                      id="firstName"
                      required
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      name="firstName"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="group">
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 transition-colors"
                    htmlFor="last-name"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="block w-full rounded-lg border-slate-200 bg-slate-200/45 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm py-3 px-4 transition-all hover:bg-white focus:bg-white"
                      id="lastName"
                      required
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      name="lastName"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="group">
                <label
                  className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 transition-colors"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className=" absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] transform-colors pointer-events-none">
                    <Mail />
                  </span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-slate-200 bg-slate-200/45 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm py-3 pl-10 pr-4 transition-all hover:bg-white focus:bg-white placeholder:text-slate-400"
                    placeholder="name@company.com"
                  />
                  <span className="right-3 top-1/2 -translate-y-1/2 text-green-500 text-[20px] hidden animate-fade-in">
                    <CheckCircleOutlined />
                  </span>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 transition-colors"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] transition-colors pointer-events-none">
                      <Lock />
                    </span>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-lg border-slate-200 bg-slate-200/45 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm py-3 pl-10 pr-4 transition-all hover:bg-white focus:bg-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="mt-2 flex gap-1">
                    <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 w-full hidden"></div>
                    </div>
                    <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
                    <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
                    <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="group">
                  <label
                    htmlFor="confirm-password "
                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 transition-colors"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] transition-colors pointer-events-none">
                      <LockReset />
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="block w-full rounded-lg border-slate-200 bg-slate-200/45 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm py-3 pl-10 pr-4 transition-all hover:bg-white focus:bg-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="mt-2 flex gap-1">
                    <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 w-full hidden"></div>
                    </div>
                    <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
                    <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
                    <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 py-2">
                <div className="flex h-6 items-center">
                  <input
                    type="checkbox"
                    name="terms"
                    id="terms"
                    required
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="leading-6 text-sm">
                  <label htmlFor="terms" className="font-medium text-slate-600">
                    I agree to the Terms of Service and Privacy Policy.
                  </label>
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-slate-900 shadow-[0_0_25px_-5px_rgba(6,182,212,0.5)] hover:scale-[1.01] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,25%,rgba(255,255,255,0.2),50%,transparent)] bg-size-[200%_100%] animate-shimmer"></div>
                  <span className="relative flex items-center gap-2">
                    {loading ? "Creating Account" : "Create Account"}
                    <span className="text-sm group-hover:translate-x-1 trnasition-transform">
                      <ArrowForward />
                    </span>
                  </span>
                </button>
              </div>
            </form>
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  className="font-bold text-indigo-600 hover:text-slate-800 transition-colors"
                  href="/login"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
          <div className="w-full md:w-2/5 bg-slate-900 relative overflow-hidden flex flex-col justify-between p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-cyan-500/20 via-slate-900 to-slate-900"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-indigo-600/10 to-transparent"></div>
            <div className="absolute inset-0 bg-tech-dots bg-size-[24px_24px] opacity-20"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-8 shadow-lg">
                <span className="text-cyan-500 text-2xl">
                  <VerifiedUser />
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-white font-light leading-tight mb-4">
                Precision & Authority
              </h2>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-slate-400">
          © 2023 Accord Inc.
          <Link href="#" className="hover:text-indigo-600 ml-2">
            Help Center
          </Link>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
