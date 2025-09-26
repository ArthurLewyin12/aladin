export function AuthError() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full text-red-500 text-xl">
      <p>Vous n'êtes pas autorisé à accéder à cette page.</p>
      <p>Veuillez vous connecter.</p>
    </div>
  );
}
