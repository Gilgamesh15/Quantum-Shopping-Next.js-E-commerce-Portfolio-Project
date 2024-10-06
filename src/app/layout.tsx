import { QueryProvider, ThemeProvider } from "@/components/Providers";
import "./globals.css";

import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import SmoothScroll from "@/components/SmoothScroll";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <SessionProvider session={session}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
