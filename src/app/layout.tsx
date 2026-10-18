import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Grind | Coffee Shop",
  description: "A coffee shop app built with Next.js, TypeScript, Tailwind CSS and Supabase.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
