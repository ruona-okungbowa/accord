import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto py-8">
      <div className="max-w-400 mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
        <div>© 2026 Accord.</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a className="hover:text-slate-600" href="#">
            Privacy &amp; Terms
          </a>
          <a className="hover:text-slate-600" href="#">
            Compliance Center
          </a>
          <a className="hover:text-slate-600" href="#">
            Help
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
