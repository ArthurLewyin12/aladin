import { AccountHeader } from "@/components/ui/account-header";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full ">
      <AccountHeader />

      <div>{children}</div>
    </div>
  );
}
