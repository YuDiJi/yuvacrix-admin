import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { StoreProvider } from "@/store/provider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: { default: "YuvaCrix Admin", template: "%s | YuvaCrix Admin" },
  description: "YuvaCrix cricket platform administration portal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body><StoreProvider>{children}</StoreProvider></body>
    </html>
  );
}
