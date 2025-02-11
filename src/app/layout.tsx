import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

const MyFOnt = localFont({
  src: "../fonts/NeueMachina-Regular.otf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "f0rest",
  description: "GENERATE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={MyFOnt.className}>{children}</body>
    </html>
  );
}
