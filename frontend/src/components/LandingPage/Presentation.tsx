import { GrMapLocation } from "react-icons/gr";
import { LuBellRing } from "react-icons/lu";
import { TiThumbsOk } from "react-icons/ti";

const Presentation = () => {
	return (
		<section id="presentation" className="w-full bg-white text-center px-4 pt-16 pb-16 rounded-t-3xl -mt-8 relative z-20 ">
			<h2 className="text-3xl font-bold mb-4">Pourquoi BeatZone ?</h2>
			<div className="w-24 h-1 bg-blue-500 mx-auto mb-10"></div>

			<div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
				<div className="bg-white shadow-md p-6 rounded-lg max-w-xs">
					<div className="w-20 h-20 bg-violet-200 mx-auto mb-4 rounded-full flex items-center justify-center">
						<GrMapLocation size={48} className="text-violet-500" />
					</div>
					<h3 className="text-xl font-semibold mb-2">
						Géolocalisation précise
					</h3>
					<p className="text-gray-600">
						Trouvez instantanément tous les concerts dans un rayon
						de votre choix. Notre technologie vous montre les
						événements les plus proches.
					</p>
				</div>

				<div className="bg-white shadow-md p-6 rounded-lg max-w-xs">
					<div className="w-20 h-20 bg-violet-200 mx-auto mb-4 rounded-full flex items-center justify-center">
						<LuBellRing size={48} className="text-violet-500" />
					</div>
					<h3 className="text-xl font-semibold mb-2">
						Notifications personnalisées
					</h3>
					<p className="text-gray-600">
						Recevez des alertes pour vos artistes préférés et les
						nouveaux concerts dans votre zone. Ne manquez plus
						jamais un événement important.
					</p>
				</div>

				<div className="bg-white shadow-md p-6 rounded-lg max-w-xs">
					<div className="w-20 h-20 bg-violet-200 mx-auto mb-4 rounded-full flex items-center justify-center">
						<TiThumbsOk size={48} className="text-violet-500" />
					</div>
					<h3 className="text-xl font-semibold mb-2">
						Recommandations intelligentes
					</h3>
					<p className="text-gray-600">
						Trouvez instantanément tous les concerts autour de vous.
					</p>
				</div>
			</div>
		</section>
	);
};

export default Presentation;
