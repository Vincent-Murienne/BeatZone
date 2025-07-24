import { Link } from "react-router-dom";

const HeroBanner = () => {
	return (
		<div className="min-h-[50dvh] flex flex-col items-center justify-center text-center px-4 py-24 linear-gradient-hero text-white">
			<h1 className="text-3xl md:text-5xl font-bold mb-6">
				Découvrez les concerts près de chez vous
			</h1>

			<p className="max-w-xl text-lg mb-8">
				Ne ratez plus jamais un concert ! BeatZone vous aide à trouver
				tous les événements musicaux dans votre région et à découvrir de
				nouveaux artistes.
			</p>

			<button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition hover:cursor-pointer">
				Téléchargez l'App
			</button>
			<p className="my-2">ou</p>
			<button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition hover:cursor-pointer">
				<Link to="/map" target="_blank">Accédez à l'App</Link>
			</button>
		</div>
	);
};

export default HeroBanner;
