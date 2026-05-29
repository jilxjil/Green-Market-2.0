import "./globals.css"
import { AppThemeProvider } from "@/components/theme-provider";

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
                     
                     </AppThemeProvider>
              </body>
            </html>
    )
}
