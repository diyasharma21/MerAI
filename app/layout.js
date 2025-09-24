import {Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const inter=Inter({subsets:["latin"]})
export const metadata = {
  title: "Merai – AI Career & Learning Mentor",
  description: "Merai is your all-in-one AI companion: learn smarter, practice interviews, build resumes and cover letters, take skill tests, and achieve your career goals faster.",
};

export default function RootLayout({ children }) {
  return (
     <ClerkProvider appearance={{
      baseTheme:dark
     }}
      fallbackRedirectUrl="/dashboard"   // replaces afterSignInUrl
      signOutFallbackRedirectUrl="/"
      >
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${inter.variable} `}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/*header*/}
            <Header />
            <main className="min-h-screen">
             {children} 
            </main>
            <Toaster richColors />
            {/*footer*/}
            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>🚀 Designed & Developed by Diya</p>
              </div>
            </footer>
            
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
