import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import ProblemSolution from "@/components/landing/ProblemSolution";
import HowItWorks from "@/components/landing/HowItWorks";
import Audience from "@/components/landing/Audience";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-400/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-teal-300/50 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40rem] h-[40rem] bg-emerald-200/60 rounded-full blur-[120px] mix-blend-multiply"></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Stats />
        <ProblemSolution />
        <HowItWorks />
        <Audience />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
