import type { Metadata } from "next";
import "./globals.css";
import Provider from "./Provider"; // Import our new provider

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "A Twitter clone built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the entire app in the SessionProvider */}
        <Provider>
          <div className="max-w-xl mx-auto border-l border-r border-twitterBorder min-h-screen">
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}