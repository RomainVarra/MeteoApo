import style from "./Header.module.css";

export default function Header() {
	return (
		<section className={style.header}>
			<img
				className={style.logoPicture}
				src="../../public/images/METEOAPO.png"
				alt="Logo Meteo Apo"
				id="LogoMeteoApo"
			/>
			<h1>Meteo Apo</h1>
		</section>
	);
}
