import { useState } from "react";

const faqData = [
	{
		question: "Comment fonctionne la géolocalisation ?",
		answer: "Nous utilisons les données GPS et réseau pour afficher les concerts les plus proches de votre position en temps réel.",
	},
	{
		question: "Puis-je recevoir des notifications personnalisées ?",
		answer: "Oui, vous pouvez configurer des alertes selon vos artistes préférés, vos styles musicaux et votre localisation.",
	},
	{
		question: "BeatZone est-il gratuit ?",
		answer: "L'accès aux fonctionnalités de base est gratuit. Des fonctionnalités Premium sont proposées pour les utilisateurs qui souhaitent aller plus loin.",
	},
];

const FaqSection = () => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const toggle = (index: number) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	return (
		<section id="faq" className="w-full py-16 bg-white px-4">
			<h2 className="text-3xl font-bold text-center mb-8">
				Foire aux Questions
			</h2>

			<div className="max-w-2xl mx-auto space-y-4">
				{faqData.map((item, index) => (
					<div
						key={index}
						className="border border-gray-200 rounded-lg shadow-sm"
					>
						<button
							onClick={() => toggle(index)}
							className="w-full flex justify-between items-center px-4 py-3 text-left font-medium hover:bg-gray-50"
						>
							{item.question}
							<span
								className="transform transition-transform"
								style={{
									transform:
										activeIndex === index
											? "rotate(180deg)"
											: "rotate(0deg)",
								}}
							>
								▼
							</span>
						</button>

						{activeIndex === index && (
							<div className="px-4 py-3 text-gray-600 border-t">
								{item.answer}
							</div>
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default FaqSection;
