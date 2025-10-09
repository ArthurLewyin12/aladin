import type { Metadata } from "next";
import { Advent_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/provider";
import { ToasterProvider } from "@/components/toaster-provider";

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
        <Providers>
          {children}
          <ToasterProvider />
        </Providers>
      </body>
    </html>
  );
}
