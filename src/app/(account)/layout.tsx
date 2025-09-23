import { AccountHeader } from "@/components/ui/account-header";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen bg-[#F5F4F1]">
      <AccountHeader />

      <div>{children}</div>
    </div>
  );
}
