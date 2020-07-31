const country_name_element = document.querySelector('.country .name');
const total_cases_element = document.querySelector('.total-cases .value');
const new_cases_element = document.querySelector('.total-cases .new-value');
const total_recovered_element = document.querySelector('.recovered .value');
const new_recovered_element = document.querySelector('.recovered .new-value');
const total_deaths_element = document.querySelector('.deaths .value');
const new_deaths_element = document.querySelector('.deaths .new-value');

//select the canvas
const ctx = document.getElementById('axes-line-chart').getContext('2d');

let app_data = [],
	cases_list = [],
	recovered_list = [],
	deaths_list = [],
	dates = [];

//Get users country code using geoplugin api
let region = geoplugin_countryCode() ?? 'network issues please!';
let user_country;
country_list.forEach((country) => {
	if(country.code == region) {
		user_country = country.name;
	}
});

//my api key "0123a40dd6mshafcf1a330795890p1c96a9jsn8f46636f4f0b"
async function fetchData(userCountry) {
	let data = await fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=${userCountry}`, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
			"x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
		}
	}).then(response => response.json())
	.catch((err) => `Error: ${err}`);

	try {
		dates = Object.keys(data);
		dates.forEach((date) => {
			let DATA = data[date];
			app_data.push(DATA);
			cases_list.push(+(DATA.total_cases.replace(/,/g, '')));
			recovered_list.push(+(DATA.total_recovered.replace(/,/g, '')));
			deaths_list.push(+(DATA.total_deaths.replace(/,/g, '')));
		});
		updateUI();
	} catch (error) {
		console.log(error);
	}
}
fetchData(user_country);

function updateUI() {
	updateStats();
	axesLinearChart();
}

function updateStats() {
	let last_entry = app_data[app_data.length - 1];
	let before_last_entry = app_data[app_data.length - 2];

	country_name_element.textContent = last_entry.country_name;
	total_cases_element.textContent = last_entry.total_cases || 0;
	new_cases_element.textContent = '+' + last_entry.new_cases;
	total_recovered_element.textContent = last_entry.total_recovered || 0;
	new_recovered_element.textContent = `+${parseInt(last_entry.total_recovered.replace(/,/g, '')) - parseInt(before_last_entry.total_recovered.replace(/,/g, '')) || 0}`;
	total_deaths_element.textContent = last_entry.total_deaths || 0;
	new_deaths_element.textContent = '+' + last_entry.new_deaths;
}
/**/
let myNewChart;
function axesLinearChart() {
	myNewChart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Cases',
				data: cases_list,
				fill: false,
				borderColor: '#fff',
				backgroundColor: '#fff',
				borderWidth: 1
				},
				{
				label: 'recovered',
				data: recovered_list,
				fill: false,
				borderColor: '#006988',
				backgroundColor: '#006988',
				borderWidth: 1
				},
				{
				label: 'Deaths',
				data: deaths_list,
				fill: false,
				borderColor: '#f44366',
				backgroundColor: '#f44366',
				borderWidth: 1
				}
			],
			labels: dates
		},
		options: {
			responsive: true,
			maintainAspectRatio: false
		}
	});
}

/*
fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=country`, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
			"x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
		}
	})
*/