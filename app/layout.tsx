import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";

const urbanShadow = localFont({
  src: "./fonts/Urban Shadow Sans Serif.otf",
  variable: "--font-urban-shadow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLTZ",
  description: "Build your digital locker.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={urbanShadow.variable}>
      <body>{children}</body>
    </html>
  );
}
