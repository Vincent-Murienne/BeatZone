const Footer = () => {
	return (
		<footer className="w-full bg-black text-white px-6 py-12">
			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
				{/* Colonne 1 - Présentation */}
				<div>
					<h3 className="text-blue-500 font-semibold mb-2">
						BeatZone
					</h3>
					<p className="text-gray-400 mb-4">
						Votre compagnon musical pour découvrir les meilleurs
						concerts près de chez vous.
					</p>
					<div className="flex justify-center md:justify-start space-x-4 text-2xl">
						<a href="#" className="hover:text-blue-500">
							🌐
						</a>
						<a href="#" className="hover:text-blue-500">
							▶️
						</a>
						<a href="#" className="hover:text-blue-500">
							📸
						</a>
					</div>
				</div>

				{/* Colonne 2 - Liens rapides */}
				<div>
					<h3 className="text-blue-500 font-semibold mb-2">
						Liens rapides
					</h3>
					<ul className="space-y-2">
						<li>
							<a href="#" className="hover:underline">
								Télécharger
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Présentation
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Support
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Blog
							</a>
						</li>
					</ul>
				</div>

				{/* Colonne 3 - Contact */}
				<div>
					<h3 className="text-blue-500 font-semibold mb-2">
						Contact
					</h3>
					<ul className="space-y-2 text-gray-400">
						<li>contact@beatzone.com</li>
						<li>+33 1 23 45 67 89</li>
						<li>
							<a href="#" className="hover:underline">
								Politique de confidentialité
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Conditions d'utilisation
							</a>
						</li>
					</ul>
				</div>
			</div>

			<hr className="my-8 border-gray-700" />

			<p className="text-center text-gray-500 text-sm">
				&copy; {new Date().getFullYear()} BeatZone. Tous droits
				réservés.
			</p>
		</footer>
	);
};

export default Footer;
