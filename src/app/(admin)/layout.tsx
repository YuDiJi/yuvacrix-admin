import { AdminShell } from "@/components/layout/AdminShell";
import { AdminAuthGuard } from "@/components/auth/AdminAuthGuard";
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <AdminAuthGuard><AdminShell>{children}</AdminShell></AdminAuthGuard>; }
