import type { Metadata } from "next";
import DashboardPage from "./client";

export const metadata: Metadata = {
  title: "Accord - Dashboard",
};

const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;
