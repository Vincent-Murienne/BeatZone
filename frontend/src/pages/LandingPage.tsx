// import { Link } from "react-router-dom";
import FaqSection from "../components/LandingPage/Faq";
import Footer from "../components/LandingPage/Footer";
import HeroBanner from "../components/LandingPage/HeroBanner";
import MobileApp from "../components/LandingPage/MobileApp";
import Navbar from "../components/LandingPage/Navbar";
import Presentation from "../components/LandingPage/Presentation";

export default function LandingPage() {
	return (
		<main>
			<Navbar />
			<HeroBanner />
			<Presentation />
			<MobileApp />
			<FaqSection />
			<Footer />
		</main>
	);
}
