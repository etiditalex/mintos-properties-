import type { Metadata } from "next";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export const metadata: Metadata = {
  title: "Mintos Properties Admin Dashboard",
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen bg-[#f4f6f9] text-slate-800 antialiased"
    >
      <AdminSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
