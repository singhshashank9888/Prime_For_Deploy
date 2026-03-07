// src/components/layout/Layout.tsx
import { ReactNode } from "react";
import EmergencyBanner from "./EmergencyBanner";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-screen flex flex-col">
    {/* Top emergency info */}
    {/* <EmergencyBanner /> */}

    {/* Navbar */}
    <Navbar />

    {/* Main content */}
    <main className="flex-1">{children}</main>

    {/* Footer */}
    <Footer />
  </div>
);

export default Layout;