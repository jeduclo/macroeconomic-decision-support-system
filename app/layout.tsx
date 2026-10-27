import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MacroLab — Principles of Macroeconomics",
  description:
    "A 10-module introductory macroeconomics course — GDP, unemployment, inflation, growth, AE, AD/AS, IS-LM, fiscal and monetary policy — with interactive simulators, Python labs and quizzes. Created by Jean Alegue, PhD.",
  authors: [{ name: "Jean Alegue, PhD" }],
  creator: "Jean Alegue, PhD",
};

export const viewport: Viewport = { themeColor: "#020617" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
