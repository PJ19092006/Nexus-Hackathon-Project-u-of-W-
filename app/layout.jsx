import "./globals.css";
import GlassNav from "@/components/glass-nav";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen bg-cover bg-center">
        {/* 7 0r 2  */}
        {/* <GlassNav /> */}
        {children}
      </body>
    </html>
  );
}
