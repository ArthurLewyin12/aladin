import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full min-h-screen bg-[#F5F4F1] relative">
      {/* Images décoratives en background - fixed position - hidden on mobile */}
      <div className="hidden md:block fixed bottom-0 left-0 pointer-events-none opacity-95 z-0">
        <Image
          src="/left-svg.png"
          alt=""
          width={500}
          height={350}
          className="object-contain"
        />
      </div>
      <div className="hidden md:block fixed bottom-0 right-0 pointer-events-none opacity-95 z-0">
        <Image
          src="/rigth-svg.png"
          alt=""
          width={500}
          height={350}
          className="object-contain"
        />
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center p-8 relative z-10">
        <div className="max-w-md text-center ">
          <Image
            src="/login-img.png"
            alt="Illustration Aladin"
            width={400}
            height={300}
            className="mx-auto translate-y-16"
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              height={100}
              width={100}
              src="/logo.png"
              alt="Logo Aladin"
              className="mx-auto md:mx-0 md:h-[120px] md:w-[120px]"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
