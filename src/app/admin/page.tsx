import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { getSupabaseAuthServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin | ZOR Professional",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await getSupabaseAuthServerClient();

  if (!supabase) {
    redirect("/admin/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email,full_name,role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <AdminPanel
      initialEmail={profile?.email ?? user.email ?? "admin"}
      initialName={profile?.full_name ?? null}
      initialRole={profile?.role ?? null}
    />
  );
}
