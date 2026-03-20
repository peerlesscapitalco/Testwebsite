import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HopeFund - Domestic Violence Charity Platform",
  description:
    "Connect donors with verified domestic violence charities. Track every dollar, measure every impact, change every life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
