import "./PageNotFound.css";

export default function NotFound() {
	const handleReturnHome = () => {
		window.location.href = "/";
	};

	return (
		<div className="video">
			<video className="video-espace" autoPlay muted loop>
				<source src="/public/images/espace2.mp4" type="video/mp4" />
			</video>

			<div className="container-not-found">
				<h2 className="titre-not-found">⚠️404 Not Found</h2>
				<p className="message-not-found">
					Oups ! La page que vous voulez voir n'existe pas.
				</p>
				<button
					type="button"
					className="boutton-not-found"
					onClick={handleReturnHome}
				>
					Revenir à l'accueil
				</button>
			</div>
		</div>
	);
}
