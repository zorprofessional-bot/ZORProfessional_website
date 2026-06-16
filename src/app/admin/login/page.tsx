import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Admin login | ZOR Professional",
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
