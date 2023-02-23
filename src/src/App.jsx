import './App.css';
import React, { useState, useEffect } from "react";
import { ApiClient } from './apiClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
// import RadioButtons from './radioButton.js';
// import ChartData from './chartData';


function App() {
	const client = new ApiClient();
	const [data, setData] = useState({})
	const [location, setLocation] = useState('')
	const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=06af2c84a95e6a736fd7bab4b3be279d`

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	// const timeInput = new Date(parseInt(data.list && data.list[0].dt) * 1000);

	const day = new Date(parseInt(data.list && data.list[0].dt) * 1000);
	const nameDay = days[day.getDay(day)];
	const month = months[day.getMonth(day)];
	const date = day.getDate(day);

	

	function returnTimes() {

		const timeArr = [];

		for (let i = 0; i < 8; i++) {
			const time = new Date(parseInt(data.list && data.list[i].dt) * 1000);
			const hour = time.getHours();
			let temp = String(hour % 12);
			if (temp === "0") {
				temp = "12";
			}
			temp += hour >= 12 ? " P.M." : " A.M.";
			timeArr.push(temp);
		}
		const length = timeArr.length - 1;
		timeArr.unshift(timeArr[length]);
		timeArr.pop()

		console.log(timeArr);
		return timeArr
	}

	function returnTemps() {
		const tempArr = [];
		for (let i = 0; i < 8; i++) {
			const temp = data.list && data.list[i].main.temp
			tempArr.push(temp + "°C");
		}
		return tempArr
	}

	function returnHumidity() {
		const tempArr = [];
		for (let i = 0; i < 8; i++) {
			const humid = data.list && data.list[i].main.humidity
			tempArr.push(humid + "%");
		}
		return tempArr
	}

	function returnClouds() {
		const tempArr = [];
		for (let i = 0; i < 8; i++) {
			const clouds = data.list && data.list[i].weather[0].main
			tempArr.push(clouds)
		}
		return tempArr
	}

	function returnCloudsDescription() {
		const tempArr = [];
		for (let i = 0; i < 8; i++) {
			const desc = data.list && data.list[i].weather[0].description
			tempArr.push(desc)
		}
		return tempArr
	}

	function returnWinds() {
		const tempArr = [];
		for (let i = 0; i < 8; i++) {
			const wind = data.list && data.list[i].wind.speed
			tempArr.push(wind + " m/s");
		}
		return tempArr
	}


	const times = returnTimes()
	const temps = returnTemps()
	const humids = returnHumidity()
	const clouds = returnClouds()
	const desc = returnCloudsDescription()
	const winds = returnWinds()



	const buildTableHead = (arr) => {
		return arr.map((current) => (
			<th>{current}</th>
		)
		)
	}

	const buildTableCell = (arr) => {
		return arr.map((current) => (
			<td>{current}</td>
		)
		)
	}

	// function JSClock(timeInput) {
	//   const time = timeInput
	//   const hour = time.getHours();
	//   const minute = time.getMinutes();
	//   const second = time.getSeconds();
	//   let temp = String(hour % 12);
	//   if (temp === "0") {
	//     temp = "12";
	//   }
	//   temp += hour >= 12 ? " P.M." : " A.M.";
	//   return temp;
	// }

	// const timeOutput = JSClock(timeInput);

	const searchLocation = (event) => {
		if (event.key === 'Enter') {
			axios.get(url).then((response) => {
				setData(response.data)
			})
			setLocation('');
		}
	}

	useEffect(() => {
		client.getWeather();
	}, [])

	const chartDataTemp = times.slice(0, 8).map((time, i) => ({
        time: time,
        chartKey: parseFloat(temps[i]),
        yAxis: calculateDegreesC(parseFloat(temps[i]))
    }));

    function calculateDegreesC(temp) {
        const maxTemp = 10; // maximum temperature for the y-axis
        let degreeIncrement = 4; // degree increment for y-axis
        const maxDegrees = getMaxDegrees(temp); // maximum degree value for y-axis
        const degreesC = [];

        // calculate the degreesC values based on the temp value
        for (let i = 0; i <= maxTemp; i += degreeIncrement) {
            const degrees = ((i / maxTemp) * maxDegrees).toFixed(2);
            degreesC.push(degrees);

            // adjust degree increment based on temperature value
            const tempFactor = temp / maxTemp;
            degreeIncrement -= degreeIncrement * tempFactor * 0.1; // reduce degree increment by 10% for every 1 unit increase in temperature (crashes if you try to modify this lol)
        }

        if (temp > maxTemp) {
            // calculate the additional degreesC values beyond the maximum temperature
            const remainingTemp = temp - maxTemp;
            const remainingDegrees = ((remainingTemp / maxTemp) * maxDegrees).toFixed(2);
            const additionalIncrements = Math.ceil(remainingTemp / degreeIncrement);
            for (let i = 1; i <= additionalIncrements; i++) {
                const degrees = (parseFloat(degreesC[degreesC.length - 1]) + parseFloat(remainingDegrees) / additionalIncrements).toFixed(2);
                degreesC.push(degrees);
            }
        }

        function getMaxDegrees(temp) {
            let maxDegrees = 30; // maximum degree value for y-axis

            if (temp > 12 && temp <= 20) {
                maxDegrees = 30;
            } else if (temp > 20 && temp <= 30) {
                maxDegrees = 40;
            } else if (temp > 30 && temp <= 40) {
                maxDegrees = 50;
            } else if (temp > 40) {
                maxDegrees = 60;
            }

            return maxDegrees;
        }


        return degreesC;
    }

	

    const chartDataHumid = times.slice(0, 8).map((time, i) => ({
        time: time,
        chartKey: parseFloat(humids[i]),
        yAxis: [0, 20, 40, 60, 80, 100]
    }));

    const chartDataWind = times.slice(0, 8).map((time, i) => ({
        time: time,
        chartKey: parseFloat(winds[i]),
        yAxis: [0, 5, 10, 15, 20, 25, 30, 35, 40]
    }));

	const [selectedOption, setSelectedOption] = useState("temp");
  
    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    //   ChartData();
    };

	let chartData;
    if (selectedOption === "temp") {
      chartData = chartDataTemp;
      
    } else if (selectedOption === "humidity") {
      chartData = chartDataHumid;
      
    } else if (selectedOption === "windspeed") {
      chartData = chartDataWind;
    }

	return (
		<>
			<div className="App">
				<div className="search">
					<input value={location}
						onChange={event => setLocation(event.target.value)}
						onKeyDown={searchLocation}
						placeholder='Enter Location'
						type="text" />
				</div>
				{data.list != undefined &&
					<div className="container">
						<div className="top">
							<div className="location">
								{/* remove checks!! */}
								<p>{data.city.name}</p>
								<div className="temp">
								</div>
							</div>
							<div className="time">
								<h4>{nameDay} {date} {month}</h4>
								<Table>
									<thead>
										<tr>
											<th>Time</th>
											{buildTableHead(times)}
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Temp</td>
											{buildTableCell(temps)}
										</tr>
									</tbody>
									<tbody>
										<tr>
											<td>Humidity</td>
											{buildTableCell(humids)}
										</tr>
									</tbody>
									<tbody>
										<tr>
											<td>sky</td>
											{buildTableCell(clouds)}
										</tr>
									</tbody>
									<tbody>
										<tr>
											<td>type</td>
											{buildTableCell(desc)}
										</tr>
									</tbody>
								</Table>
								{/* <h4>{temps}</h4> */}
								{/* <h4> {nameDay} {date} {month} {timeOutput}</h4> */}
							</div>
							<div className="description">
								<div className="currentInfo"><h3>current weather</h3></div>
								<div className="bottomBox">
									<div className="bottom">
										<div className="feelsLike">
											<p>feels like</p>
											{data.list && <h4>{data.list[0].main.feels_like}°C</h4>}
										</div>
										<div className="humidity">
											<p>humidity</p>
											{data.list && <h4>{data.list[0].main.humidity}%</h4>}
										</div>
										<div className="wind">
											<p>wind speed</p>
											{data.list && <h4>{data.list[0].wind.speed} m/s</h4>}

										</div>
									</div>
									<div className="chart">
										<div className="fillHow">
											<input
												type="radio"
												name="fillChart"
												value="temp"
												checked={selectedOption === "temp"}
												onChange={handleOptionChange}
											/><h3 className="radioLabel">Temperature</h3>	
											<input
												type="radio"
												name="fillChart"
												value="humidity"
												checked={selectedOption === "humidity"}
												onChange={handleOptionChange}
											/> <h3 className="radioLabel">Humidity</h3>
											<input
												type="radio"
												name="fillChart"
												value="windspeed"
												checked={selectedOption === "windspeed"}
												onChange={handleOptionChange}
											/> <h3 className="radioLabel">Wind Speed</h3>
										</div>
										<ResponsiveContainer width={730} height={350}>
											<LineChart data={chartData}
												margin={{ top: 15, right: 70, left: 0, bottom: 0 }}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="time" />
												<YAxis dataKey="yAxis" />
												<Tooltip />
												<Legend dataKey="value" />
												<Line type="monotone" dataKey="chartKey" stroke="#8884d8" />

											</LineChart>
										</ResponsiveContainer>
									</div>
								</div>
							</div>


						</div>
					</div>
				}
			</div>
		</>
	);
			}

export default App;