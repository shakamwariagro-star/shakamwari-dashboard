import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Shakamwari Agro India Pvt Ltd — Empowering Agriculture, Enriching Lives",
    template: "%s | Shakamwari Agro",
  },
  description:
    "Agriculture services company working in MP & UP since 2016. Soil testing labs, Farmer Producer Companies (FPCs), and PM-MKSSY fisheries cooperative strengthening.",
  metadataBase: new URL("https://shakamwariagro.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-cream font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
