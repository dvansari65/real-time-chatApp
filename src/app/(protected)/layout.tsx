import { SimpleNavbar } from "@/components/Navbar"
import InnerSidebar from "@/components/ui/Sidebars/InnerSidebar"
import OuterSidebar from "@/components/ui/Sidebars/OuterSidebar"

// app/(protected)/layout.tsx
export default function ProtectedLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        <SimpleNavbar />
        <div className="w-full h-screen flex">
          <div>
            <OuterSidebar />
          </div>
          <div className="hidden md:block">
            <InnerSidebar />
          </div>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </>
    )
  }