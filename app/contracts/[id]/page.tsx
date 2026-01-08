import type { Metadata } from "next";
import ContractDashboard from "./client";

export const metadata: Metadata = {
  title: "Accord - Contract Dashboard",
};

const Dashboard = () => {
  return <ContractDashboard />;
};

export default Dashboard;
