import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
