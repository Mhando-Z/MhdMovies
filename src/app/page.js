import HeroSection from "@/components/pages/heroSection";
import TrendingMovies from "@/components/pages/trendingMovies";
import UpcomingMovies from "@/components/pages/upcomingMovies";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-black font-sans">
      <HeroSection />
      <TrendingMovies />
      <UpcomingMovies />
    </div>
  );
}
