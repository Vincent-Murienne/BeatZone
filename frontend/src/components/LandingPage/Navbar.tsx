import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-20 text-white">
			<h1 className="text-xl font-bold">BeatZone</h1>
			<nav className="flex space-x-6">
				<a href="#presentation" className="hover:underline">
					Présentation
				</a>
				<a href="#faq" className="hover:underline">
					FAQ
				</a>
				<Link to="/cgu" target="_blank">CGU</Link>
				<a href="#contact" className="hover:underline">
					Contact
				</a>
			</nav>
		</header>
	);
};

export default Navbar;
