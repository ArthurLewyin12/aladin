import Image from "next/image";

export default function StudentAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen">
      <div className="flex-1 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <Image
            src="/login-img.png"
            alt="Illustration Aladin"
            width={400}
            height={300}
            className="mx-auto"
          />
        </div>
      </div>

      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              height={60}
              width={60}
              src="/logo.png"
              alt="Logo Aladin"
              className="md:h-[80px] md:w-[80px]"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
