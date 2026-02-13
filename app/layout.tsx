import type { Metadata } from "next";
import { AuthProvider } from "@/app/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roomates - Find Your Husky Roommate",
  description:
    "The easiest way for UW students to find compatible roommates. Browse profiles, match with fellow Huskies, and find your perfect living situation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
