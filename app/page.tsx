import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import HomeEvents from "@/components/home/homeevent";
import HomeProjects from "@/components/home/homeproject";
import HomeTeam from "@/components/home/hometeam";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="mx-auto max-w-[1280px] space-y-32 px-20 pb-16 pt-28 max-lg:px-10 max-md:space-y-20 max-md:px-5 max-md:pt-20">
        <Suspense fallback={null}>
          <HomeEvents />
        </Suspense>
        <Suspense fallback={null}>
          <HomeProjects />
        </Suspense>
        <Suspense fallback={null}>
          <HomeTeam />
        </Suspense>
      </div>
    </main>
  );
}