import type { Metadata } from "next";
import "./globals.css";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { getSiteContact } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: {
    default: "ZOR Professional",
    template: "%s | ZOR Professional",
  },
  description:
    "ZOR Professional is a premium Croatian toilet paper presentation website foundation for homes, companies, apartments, institutions, production, careers, and contact.",
  icons: {
    icon: [{ url: "/brand/zor-icon.png", type: "image/png", sizes: "1024x1024" }],
    apple: [{ url: "/brand/zor-icon.png", type: "image/png", sizes: "1024x1024" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contact = await getSiteContact();

  return (
    <html lang="hr">
      <body>
        <SiteSettingsProvider value={contact}>{children}</SiteSettingsProvider>
      </body>
    </html>
  );
}
