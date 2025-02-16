import '@/styles/global.css'

import { AuthProvider } from "@/context/AuthContext";

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
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
