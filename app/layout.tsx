import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientSessionProvider from "@/components/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apps Dashboard - Portfolio Projects",
  description: "Portfolio dashboard showcasing development projects with architecture diagrams and technology stacks",
  keywords: ["portfolio", "projects", "developer", "dashboard", "next.js", "react"],
  openGraph: {
    title: "Apps Dashboard - Portfolio Projects",
    description: "Portfolio dashboard showcasing development projects with architecture diagrams and technology stacks",
    url: "https://apps.haripriya.org",
    siteName: "Haripriya Apps Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Apps Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apps Dashboard - Portfolio Projects",
    description: "Portfolio dashboard showcasing development projects with architecture diagrams and technology stacks",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ClientSessionProvider session={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}