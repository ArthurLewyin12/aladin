import { AccountHeader } from "@/components/ui/account-header";
import { AuthGuard } from "@/components/guards/auth-guard";
import Image from "next/image";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="flex flex-col w-full min-h-screen bg-[#F5F4F1] relative">
        <AccountHeader />

        {/* Images décoratives en background - fixed position */}
        <div className="fixed bottom-0 left-0 pointer-events-none opacity-95 z-0">
          <Image
            src="/left-svg.png"
            alt=""
            width={500}
            height={350}
            className="object-contain"
          />
        </div>
        <div className="fixed bottom-0 right-0 pointer-events-none opacity-95 z-0">
          <Image
            src="/rigth-svg.png"
            alt=""
            width={500}
            height={350}
            className="object-contain"
          />
        </div>

        <main className="flex-1 relative z-10">{children}</main>
      </div>
    </AuthGuard>
  );
}