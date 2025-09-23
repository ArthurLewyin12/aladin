import type { Metadata } from "next";
import { Geist_Mono, Advent_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const adventPro = Advent_Pro({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-advent-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aladin website",
  description:
    "aladin une superbe app web pour vous aider dans votre cursus scolaire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${adventPro.variable}  font-sans text-base md:text-lg antialiased `}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
