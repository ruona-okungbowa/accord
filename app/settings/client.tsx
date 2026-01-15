import React from "react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/action";
import { LogOut, User, Shield, Bell } from "lucide-react";

const Settings = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">
          Account Settings
        </h1>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* User Profile Section */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  Signed in as
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  {user?.email}
                </h2>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-8 bg-slate-50/50">
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl bg-white border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of Accord
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
