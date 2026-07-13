import Hero from "@/components/Hero";
import Record from "@/components/Record";
import Receipts from "@/components/Receipts";
import Work from "@/components/Work";
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
      <Record />
      <Receipts />
      <Work />
      <Leading />
      <Person />
      <NowFooter />
    </main>
  );
}
