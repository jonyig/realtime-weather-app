import React, { useState } from "react";
import styled from "@emotion/styled";
import { availableLocations } from "./utils";

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;
const locations = availableLocations.map(location => location.cityName);

const WeatherSetting = props => {
    const { cityName, setCurrentPage, setCurrentCity } = props;
    const [locationName, setLocationName] = useState(cityName);
    const handleChange = e => {
        console.log(e.target.value);

        // STEP 5：把使用者輸入的內容更新到 React 內的資料狀態
        setLocationName(e.target.value);
    };

    const handleSave = () => {
        if (locations.includes(locationName)) {
            setCurrentPage("WeatherCard");
            setCurrentCity(locationName);
        } else {
            alert(`儲存失敗：您輸入的 ${locationName} 並非有效的地區`);
            return;
        }
    };
    return (
        <WeatherSettingWrapper>
            <Title>設定</Title>
            <StyledLabel htmlFor="location">地區</StyledLabel>
            <StyledInputList
                list="location-list"
                id="location"
                name="location"
                onChange={handleChange}
                value={locationName}
            />
            <datalist id="location-list">
                <option value="123" key="123" />
                {locations.map(location => (
                    <option value={location} key={location} />
                ))}{" "}
            </datalist>

            <ButtonGroup>
                <Back onClick={() => setCurrentPage("WeatherCard")}>返回</Back>
                <Save onClick={handleSave}>儲存</Save>
            </ButtonGroup>
        </WeatherSettingWrapper>
    );
};

export default WeatherSetting;
