export default function ChartData({ times, temps, humids, winds, yAxis }) {

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

    return {
        chartDataTemp,
        chartDataHumid,
        chartDataWind,
    };
}