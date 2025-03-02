import '@/styles/global.css'

import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";

import { MainLayout } from "@/layouts/MainLayout";

export const metadata = {
  title: "DeSo NextJS Starter App",
  description: "Designed by @brootle",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{colorScheme: 'dark'}}>
      <body>
        <AuthProvider>
          <UserProvider>
            <MainLayout>{children}</MainLayout>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
