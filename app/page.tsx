import Hero from "@/components/Hero";
import WorkCarousel from "@/components/WorkCarousel";
import Receipts from "@/components/Receipts";
import Leading from "@/components/Leading";
import Person from "@/components/Person";
import NowFooter from "@/components/NowFooter";
import StickyNav from "@/components/StickyNav";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      <Reveal />
      <StickyNav />
      <Hero />
      <WorkCarousel />
      <Receipts />
      <Leading />
      <Person />
      <NowFooter />
    </main>
  );
}
