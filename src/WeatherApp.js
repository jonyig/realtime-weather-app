import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import WeatherCard from "./WeatherCard.js";
import { ThemeProvider } from "emotion-theming";
import useWeatherApi from "./useWeatherApi";
import useSunsetApi from "./useSunsetApi";
import WeatherSetting from "./WeatherSetting.js";
import { findLocation } from "./utils";
import Moment from "moment";

const theme = {
    light: {
        backgroundColor: "#ededed",
        foregroundColor: "#f9f9f9",
        boxShadow: "0 1px 3px 0 #999999",
        titleColor: "#212121",
        temperatureColor: "#757575",
        textColor: "#828282"
    },
    dark: {
        backgroundColor: "#1F2022",
        foregroundColor: "#121416",
        boxShadow:
            "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
        titleColor: "#f9f9fa",
        temperatureColor: "#dddddd",
        textColor: "#cccccc"
    }
};
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getMoment = (locationName,sunset) => {
    if (!sunset) return null;

    const now = new Date();
    const sunriseTimestamp = new Date(
        `${Moment().format('YYYY-MM-DD')} ${sunset.rising}`
    ).getTime();
    const sunsetTimestamp = new Date(
        `${Moment().format('YYYY-MM-DD')} ${sunset.falling}`
    ).getTime();
    const nowTimeStamp = now.getTime();

    return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
        ? "day"
        : "night";
};

const WeatherApp = () => {
    const storageCity = localStorage.getItem("cityName");

    const [currentCity, setCurrentCity] = useState(storageCity || "臺北市");
    const currentLocation = findLocation(currentCity) || {};

    const [weatherElement, fetchData] = useWeatherApi(currentLocation);
    const [currentTheme, setCurrentTheme] = useState("light");
    const [currentPage, setCurrentPage] = useState("WeatherCard");
    const sunset = useSunsetApi(currentLocation)
    const moment = useMemo(() => getMoment(currentLocation.sunriseCityName,sunset), [
        currentLocation.sunriseCityName
    ]);
    useEffect(() => {
        localStorage.setItem("cityName", currentCity);
        // STEP 3-2：dependencies 中放入 currentCity
    }, [currentCity]);
    useEffect(() => {
        setCurrentTheme(moment === "day" ? "light" : "dark");
    }, [moment]);
    return (
        <ThemeProvider theme={theme[currentTheme]}>
            <Container>
                {currentPage === "WeatherCard" && (
                    <WeatherCard
                        cityName={currentLocation.cityName}
                        weatherElement={weatherElement}
                        moment={moment}
                        fetchData={fetchData}
                        setCurrentPage={setCurrentPage}
                    />
                )}
                {currentPage === "WeatherSetting" && (
                    <WeatherSetting
                        setCurrentPage={setCurrentPage}
                        cityName={currentLocation.cityName}
                        setCurrentCity={setCurrentCity}
                    />
                )}
            </Container>
        </ThemeProvider>
    );
};

export default WeatherApp;
