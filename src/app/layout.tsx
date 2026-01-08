import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Keep default fonts or switch to Inter if preferred, sticking to default for now but could use Inter as requested "modern typography" usually implies Inter/custom.
// User mentioned "Inter, Roboto, or Outfit". Default Next.js Geist is very modern too. I'll stick to Geist or use Inter.
// Let's use Inter from google fonts to be safe with "Modern" request if Geist isn't preferred, but Geist is the Vercel font.
// actually user said "similar to provided image reference... Inter...".
// I'll stick to Geist as it's the default and very clean.
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modern Password Generator",
  description: "Generate secure, random passwords with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground selection:bg-primary/20`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
