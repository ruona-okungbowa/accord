"use client";
import { Gavel, Notifications } from "@mui/icons-material";
import Image from "next/image";
import logo from "@/public/logo.svg";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  firm_name?: string | null;
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-400 mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-slate-900 cursor-pointer">
            <div className="w-8 h-8 text-white rounded flex items-center justify-center shadow-sm">
              <Image
                src={logo}
                width={600}
                height={600}
                alt="Logo for Accord"
              />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">
              Accord
            </span>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href="/contracts"
              className="px-3 py-2 text-sm font-medium rounded-md text-indigo-600 bg-indigo-600/5"
            >
              Contracts
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <div className="text-xs capitalize font-bold text-slate-700">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-[10px] text-slate-500">
                Partner • Latham &amp; Watkins
              </div>
            </div>
            <div className="w-8 h-8 bg-slate-200 rounded-full border-white shadow-sm overflow-hidden">
              {/** Image goes here */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
