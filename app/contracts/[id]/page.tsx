import type { Metadata } from "next";
import ContractDashboard from "./client";

export const metadata: Metadata = {
  title: "Accord - Contract Dashboard",
};

const Dashboard = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ContractDashboard id={id} />;
};

export default Dashboard;
