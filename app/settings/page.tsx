import type { Metadata } from "next";
import Settings from "./client";

export const metadata: Metadata = {
  title: "Accord - Settings",
};

const Landing = () => {
  return <Settings />;
};

export default Landing;
