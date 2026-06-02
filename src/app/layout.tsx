import "./globals.css"
import { AppThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return(
        <html lang="en">
              <body>
             <AppThemeProvider>
                      
                       {children}
                       <Toaster position="top-center" />
                     </AppThemeProvider>
              </body>
            </html>
    )
}
