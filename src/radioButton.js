import React, { useState } from "react";
import ChartData  from "./chartData.js";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';


function RadioButtons({ chartDataTemp, chartDataHumid, chartDataWind }) {
    const [selectedOption, setSelectedOption] = useState("temp");
  
    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
      ChartData();
    };
  
    // let chartData;
    // if (selectedOption === "temp") {
    //   chartData = chartDataTemp;
      
    // } else if (selectedOption === "humidity") {
    //   chartData = chartDataHumid;
      
    // } else if (selectedOption === "windspeed") {
    //   chartData = chartDataWind;
    // }
  
    return (
      <div className="fillHow">
        <input
          type="radio"
          name="fillChart"
          value="temp"
          checked={selectedOption === "temp"}
          onChange={handleOptionChange}
        />
        
        <input
          type="radio"
          name="fillChart"
          value="humidity"
          checked={selectedOption === "humidity"}
          onChange={handleOptionChange}
        />
        <input
          type="radio"
          name="fillChart"
          value="windspeed"
          checked={selectedOption === "windspeed"}
          onChange={handleOptionChange}
        />
      </div>
    );
  }

  export default RadioButtons;