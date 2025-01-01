import { useEffect, useState } from "react";
import SlotCounter from "react-slot-counter";
import style from "./Search.module.css";
import GaugeComponent from "react-gauge-component";

type town = {
	location: {
		name: string;
		country: string;
		region: string;
		lat: number;
		lon: number;
		timezone_id: string;
		localtime: number;
		localtime_epoch: number;
		utc_offset: number;
	};
	current: {
		temperature: number;
		wind_speed: number;
		wind_degree: number;
		wind_dir: string;
		pressure: number;
		precip: number;
		humidity: number;
		cloudcover: number;
		feelslike: number;
		uv_index: number;
		visibility: number;
		weather_icons: [string];
	};
};

function Search() {
	const [search, setSearch] = useState<string | null>("");
	const [data, setData] = useState<town | null>(null);
	const [inputValue, setInputValue] = useState<string>("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		fetch(
			`https://api.weatherstack.com/current?access_key=549de1bff6a1786b4149ac4de19a04a8&query=${search}`,
		)
			.then((response) => response.json())
			.then((data) => setData(data))
			.catch((error) => console.error(error));
	}, [search]);

	const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSearch(inputValue);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
		setIsSubmitted(true);
	};

	function survivalPercentChance(
		wind_speed: number,
		uv_index: number,
		humidity: number,
		feelslike: number,
	): number | undefined {
		const percentChance =
			1000 / (wind_speed / 30 + uv_index / 20 + humidity / 20 + feelslike / 30);
		return Number.parseFloat(percentChance.toFixed(1));
	}
	function survivalChance(
		wind_speed: number,
		pressure: number,
		humidity: number,
		feelslike: number,
	) {
		const mySurvivalChance = survivalPercentChance(
			wind_speed,
			pressure,
			humidity,
			feelslike,
		);
		if (mySurvivalChance !== undefined) {
			if (mySurvivalChance <= 30) {
				return "Chances de survies extrêmement faibles !";
			}
			if (mySurvivalChance <= 50) {
				return "Risque important mais pas impossible ! S'armer en conséquence !";
			}
			return "Vous avez peut-être une chance ! ";
		}
	}
	return (
		<section className={style.searchContainer}>
			<section className={style.mobileMessage}>
				{" "}
				<p>
					Il n'y a plus de réseau dans le monde, donc inutile de faire une
					version mobile
				</p>
			</section>{" "}
			<section className={style.searchBar}>
				<h2 className={style.searchTitle}>
					Pouvez-vous sortir de chez vous ?{" "}
				</h2>
				<form onSubmit={handleClick} className={style.form}>
					<input
						type="text"
						name="searchBar"
						placeholder="Entrez une ville"
						onChange={handleChange}
						className={style.inputSearchBar}
					/>
					<input type="submit" className={style.submit} />
				</form>
			</section>
			{isSubmitted && data && data.current && data.location && (
				<section className={style.searchResult}>
					<section className={style.intro}>
						<h2>
							Tu te demandes si tu peux survivre à {search} (
							{data?.location.country}) ?
						</h2>
					</section>

					<section className={style.location}>
						<p>{data?.location.localtime}</p>
					</section>

					<section className={style.displayResults}>
						<section className={style.luckToSurvive}>
							<p className={style.luckTitle}>
								Pourcentage de chance de survie:{" "}
							</p>
							<GaugeComponent
								arc={{
									subArcs: [
										{
											limit: 20,
											color: "#EA4228",
											showTick: true,
										},
										{
											limit: 40,
											color: "#F58B19",
											showTick: true,
										},
										{
											limit: 60,
											color: "#F5CD19",
											showTick: true,
										},
										{
											limit: 100,
											color: "#12da3a",
											showTick: true,
										},
									],
								}}
								value={survivalPercentChance(
									data?.current.pressure,
									data?.current.humidity,
									data?.current.wind_speed,
									data?.current.feelslike,
								)}
								className={style.compteur}
							/>
							<p>
								Estimation de vos chances de survie :{" "}
								{survivalChance(
									data?.current.pressure,
									data?.current.humidity,
									data?.current.wind_speed,
									data?.current.feelslike,
								)}
							</p>
						</section>
					</section>
					<section className={style.luckToDie}>
						<section className={style.radioactivity}>
							<p>
								La température est de{" "}
								<SlotCounter value={data?.current.temperature} /> °C
							</p>
							<p>
								Un vent radioactif souffle à{" "}
								<SlotCounter value={data?.current.wind_speed} /> km/h
							</p>
							{data?.current.wind_speed > 20 && (
								<p>Prenez-votre combinaison anti-radiations !</p>
							)}
							<p>
								La visibilité dans la zone est de{" "}
								<SlotCounter value={data?.current.visibility} />
							</p>
							<p>
								Le risque de se faire carboniser par le rayonnement solaire est
								de {data?.current.uv_index}%
							</p>
							{data?.current.uv_index > 4 && (
								<p>N'oubliez pas de mettre votre crème indice 5000 </p>
							)}
						</section>

						<section className={style.risk}>
							<p>
								Nous avons détecté{" "}
								<SlotCounter value={data?.current.pressure} /> zombies et{" "}
								{data?.current.humidity} mutants autour de chez vous
							</p>
							{data?.current.pressure > 1000 && (
								<p>N'oubliez pas votre hache 🪓</p>
							)}

							{data?.current.humidity > 60 && (
								<p>Il serait peut-être judicieux de ne pas sortir ! </p>
							)}
						</section>
					</section>
				</section>
			)}
		</section>
	);
}

export default Search;
