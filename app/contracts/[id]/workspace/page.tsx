import type { Metadata } from "next";
import DocumentWorkspace from "./client";

export const metadata: Metadata = {
  title: "Accord - Contract Workspace",
};

const Workspace = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <DocumentWorkspace id={id} />;
};

export default Workspace;
