import { useEffect, useState } from "react";
import SlotCounter from "react-slot-counter";
import style from "./Search.module.css";

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
			`https://api.weatherstack.com/current?access_key=d4ab7b648203365b64e4625dda298335&query=${search}`,
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

	return (
		<section className={style.searchContainer}>
			<h1>Pouvez-vous sortir de chez vous ? </h1>
			<form onSubmit={handleClick}>
				<input
					type="text"
					name="searchBar"
					placeholder="Entrez une ville"
					onChange={handleChange}
				/>
				<input type="submit" />
			</form>
			{isSubmitted && data && data.current && data.location && (
				<section className={style.searchResult}>
					<section className={style.intro}>
						<h2>Tu te demandes si tu peux survivre à {search} ?</h2>
					</section>
					<section className={style.alert}>
						<img src={`${data?.current.weather_icons}`} alt="icone météo" />
					</section>
					<section className={style.location}>
						<h3>{data?.location.country}</h3>
						<p>{data?.location.localtime}</p>
					</section>
					<section className={style.weather}>
						<p>La température est de {data?.current.temperature} °C</p>
						<img src="images/radioactificone.jpg" alt="icône radioactive" />
						<p>
							Le vent radioactif souffle à{" "}
							<SlotCounter value={`${data?.current.wind_speed}`} /> km/h
						</p>
						<p>La visibilité dans la zone est de {data?.current.visibility}</p>
						<p>
							Le risque de se faire carboniser par le rayonnement solaire est de{" "}
							{data?.current.uv_index}%
						</p>
					</section>
					<section className={style.risk}>
						<p>
							Nous avons détecté{" "}
							<SlotCounter value={`${data?.current.pressure}`} /> zombies autour
							de chez vous
						</p>
						<p>
							Nous avons détecté {data?.current.humidity} mutants dans la zone
						</p>
					</section>
				</section>
			)}
		</section>
	);
}

export default Search;
