// app/layout.tsx
"use client"; // Many Material Tailwind components need client-side rendering
import Navbar from "@/components/navigation/seller-navbar";
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
          <Navbar/>
          {children}
         <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
