"use client";

import Link from "next/link";
import {
  ArrowForwardOutlined,
  LockOutlined,
  MailOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { LoginFormSchema } from "@/lib/validations/auth";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    const validatedFields = LoginFormSchema.safeParse(formData);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      const errorObj: Record<string, string> = {};

      Object.entries(fieldErrors).forEach(([key, errorArray]) => {
        if (errorArray && errorArray.length > 0) {
          errorObj[key] = errorArray[0];
        }
      });

      setErrors(errorObj);
      return;
    }

    try {
      const response = await fetch("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedFields.data),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.session) {
          // Redirect to dashboard or home page
          router.push("/contracts");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 font-sans antialiased h-screen w-full relative overflow-hidden flex items-center justify-center selection:bg-[#06b6d4] selection:text-white">
      <div className="absolute inset-0 opacity-60 bg-[#f8fafc] bg-grid-pattern bg-[length:40px_40px] pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#4f46e5]/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob delay-[2000] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#06b6d4]/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob pointer-events-none delay-[2000]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8b5cf6]/15 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob delay-[4000] pointer-events-none "></div>
      <div className="relative z-10 w-full max-w-md mx-4 animate-slide-up">
        <div className="flex justify-center mb-8">
          <a
            className="flex items-center gap-3 group cursor-pointer transition-transform hover:scale-105"
            href="#"
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#4f46e5]/20 rounded-lg rotate-0 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="absolute inset-0 border-2 border-[#4f46e5] rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500 ease-out"></div>
              <div className="w-2 h-2 bg-[#4f46e5] rounded-full"></div>
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight text-[#1e293b]">
              Accord <span className="text-cyan-500">.</span>
            </span>
          </a>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-cyan-500 to-violet-500"></div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 font-light">
              Sign in to your workspace
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label
                htmlFor="email"
                className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1"
              >
                Work Email
              </label>
              <div className="relative rounded-xl bg-white focus:ring border border-slate-200">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-[20px] group-focus-within:text-indigo-600 transition-colors">
                    <MailOutlined />
                  </span>
                </div>
                <input
                  autoComplete="email"
                  className="block w-full pl-11 pr-4 py-3 bg-transparent border-none rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                />
              </div>
            </div>
            <div className="group">
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label
                  className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-medium text-indigo-600 hover:text-slate-800 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative rounded-xl focus:ring bg-white border border-slate-200">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-[20px] group-focus-within:text-indigo-600 transition-colors">
                    <LockOutlined />
                  </span>
                </div>
                <input
                  type="password"
                  className="block w-full pl-11 pr-4 py-3 bg-transparent border-none rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="password"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-slate-900 shadow-lg shadow-slate-900/30 hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
              type="submit"
            >
              <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2">
                Sign In
                <span className="text-[18px] group-hover:transalte-x-1 transition-transform">
                  <ArrowForwardOutlined />
                </span>
              </span>
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{" "}
              <Link
                className="font-bold text-indigo-600 hover:text-slate-800 transition-colors"
                href="/register"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
