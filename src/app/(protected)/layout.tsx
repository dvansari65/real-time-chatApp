"use client";
import InnerSidebar from "@/components/ui/Sidebars/InnerSidebar";

// app/(protected)/layout.tsx
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full h-screen flex">
        <div className="hidden md:block">
          <InnerSidebar />
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </>
  );
}
