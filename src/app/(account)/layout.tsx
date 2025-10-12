import { AccountHeader } from "@/components/ui/account-header";
import { AuthGuard } from "@/components/guards/auth-guard";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="flex flex-col w-full h-screen bg-[#F5F4F1]">
        <AccountHeader />

        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}