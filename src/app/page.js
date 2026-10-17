import HeroSection from "@/components/pages/heroSection";
import TrendingMovies from "@/components/pages/trendingMovies";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-black font-sans">
      <HeroSection />
      <TrendingMovies />
    </div>
  );
}
