export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1280px] px-20 max-lg:px-10 max-md:px-5">
      {children}
    </div>
  );
}