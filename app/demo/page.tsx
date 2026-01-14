import type { Metadata } from "next";
import DemoPage from "./client";

export const metadata: Metadata = {
  title: "Accord - Demo",
};

const Landing = () => {
  return <DemoPage />;
};

export default Landing;
