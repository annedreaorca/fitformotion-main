// import LegalNoticeModal from "@/components/LegalNoticeModal.client"; // Import the Client Component
import Navbar from "@/components/Navbar/Navbar";
import ActiveWorkoutWarning from "@/components/Notices/ActiveWorkoutWarning";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import LayoutWrapper from "./LayoutWrapper.client";
import SiteNotice from "./SiteNotice";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <SiteNotice
        message="Beta: Data may be subject to change or loss."
        variant="danger"
        visible={false}
      />
      <div className="flex grow z-50">
        <Sidebar />
        <main className="flex flex-col grow w-full">
          <Navbar />
          <LayoutWrapper>
            <ActiveWorkoutWarning />
            {children}
          </LayoutWrapper>
        </main>
        {/* <LegalNoticeModal /> */}
      </div>
    </ClerkProvider>
  );
}
