"use client";
import React, { PropsWithChildren } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
