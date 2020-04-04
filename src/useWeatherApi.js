import { useState, useEffect, useCallback } from "react";

const fetchWeatherForecast = cityName => {
    return fetch(
        `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-7F486B33-2521-43D0-A5E1-4368F085EF09&locationName=${cityName}`
    )
        .then(response => response.json())
        .then(data => {
            const locationData = data.records.location[0];
            const weatherElements = locationData.weatherElement.reduce(
                (neededElements, item) => {
                    if (["Wx", "PoP", "CI"].includes(item.elementName)) {
                        neededElements[item.elementName] = item.time[0].parameter;
                    }
                    return neededElements;
                },
                {}
            );
            // 記得要回傳新的資料狀態回去
            return {
                description: weatherElements.Wx.parameterName,
                weatherCode: weatherElements.Wx.parameterValue,
                rainPossibility: weatherElements.PoP.parameterName,
                comfortability: weatherElements.CI.parameterName
            };
        });
};

const fetchCurrentWeather = locationName => {
    return fetch(
        `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-7F486B33-2521-43D0-A5E1-4368F085EF09&locationName=${locationName}`
    )
        .then(response => response.json())
        .then(data => {
            const locationData = data.records.location[0];
            const weatherElements = locationData.weatherElement.reduce(
                (neededElements, item) => {
                    if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
                        neededElements[item.elementName] = item.elementValue;
                    }
                    return neededElements;
                },
                {}
            );
            // console.log(locationData);
            return {
                observationTime: locationData.time.obsTime,
                locationName: locationData.locationName,
                temperature: weatherElements.TEMP,
                windSpeed: weatherElements.WDSD,
                humid: weatherElements.HUMD
            };
        });
};
const useWeatherApi = currentLocation => {
    const { locationName, cityName } = currentLocation;

    const [weatherElement, setWeatherElement] = useState({
        observationTime: new Date(),
        locationName: "",
        humid: 0,
        temperature: 0,
        windSpeed: 0,
        description: "",
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: "",
        isLoading: true
    });

    const fetchData = useCallback(() => {
        // console.log(num);
        const fetchingData = async () => {
            const [currentWeather, weatherForecast] = await Promise.all([
                fetchCurrentWeather(locationName),
                fetchWeatherForecast(cityName)
            ]);
            setWeatherElement({
                ...currentWeather,
                ...weatherForecast,
                isLoading: false
            });
        };

        setWeatherElement(prevState => ({
            ...prevState,
            isLoading: true
        }));

        fetchingData();
    }, [locationName, cityName]);

    useEffect(() => {
        // console.log("--- effect ---");

        fetchData();
    }, [fetchData]);
    return [weatherElement, fetchData];
};
export default useWeatherApi;
