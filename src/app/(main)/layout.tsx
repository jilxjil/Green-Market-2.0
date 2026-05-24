// app/layout.tsx
"use client"; // Many Material Tailwind components need client-side rendering
import AppNavbar from "@/components/navigation/app-navbar";
import "./../globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import Footer from '../../components/common/footer';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the children with ThemeProvider */}
        <ThemeProvider>
          <AppNavbar/>
          {children}
         <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
