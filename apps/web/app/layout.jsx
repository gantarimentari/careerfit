import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
});



import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "CareerFit AI",
  description: "Platform analisis CV & Pencari Karir Berbasis AI",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full antialiased `}
    >
      <body className="min-h-full flex flex-col bg-background">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
