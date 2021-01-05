import {useCallback, useEffect, useState} from "react";
import Moment from "moment";

const fetchWeatherSunset = cityName => {
    return fetch(
        `https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWB-7F486B33-2521-43D0-A5E1-4368F085EF09&locationName=${cityName}&dataTime=${Moment().format('YYYY-MM-DD')}`
    )
        .then(response => response.json())
        .then(data => {
            const sunsetData = data.records.locations.location[0].time[0].parameter;

            const sunRising = sunsetData.find(item => item.parameterName === '日出時刻')
            const sunFalling = sunsetData.find(item => item.parameterName === '日沒時刻')
            return {
                rising: sunRising.parameterValue,
                falling: sunFalling.parameterValue
            }
        })
}

const useSunsetApi = currentLocation => {
    const {locationName, cityName} = currentLocation;
    const [sunset, setSunset] = useState();
    const fetchData = useCallback(() => {
        // console.log(num);
        const fetchingData = async () => {
            const [currentSunset] = await Promise.all([
                fetchWeatherSunset(cityName)
            ]);
            setSunset(currentSunset)
        };

        fetchingData();
    }, [locationName, cityName]);

    useEffect(() => {
        // console.log("--- effect ---");

        fetchData();
    }, [fetchData]);
    return sunset
}

export default useSunsetApi;
