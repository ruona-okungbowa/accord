import type { Metadata } from "next";
import LandingPage from "./client";

export const metadata: Metadata = {
  title: "Accord",
};

const Landing = () => {
  return <LandingPage />;
};

export default Landing;
