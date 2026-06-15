import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
