import React, { useState } from "react";
import LegendItem from "./LegendItem";

function Sidebar({
  interpolationSum,
  setShowInterpolation,
  averageIncome,
  setShowIncome,
  setShowPopulation,
}) {
  const [isCheckedPopulation, setCheckedPopulation] = useState(false);
  const [isCheckedIncome, setCheckedIncome] = useState(false);
  const [isCheckedInterpolation, setCheckedInterpolation] = useState(false);

  const handleInterpolationCheck = () => {
    setCheckedInterpolation(!isCheckedInterpolation);
    setShowInterpolation(!isCheckedInterpolation);
  };

  //Income Checkbox Status
  const handleIncomeCheck = () => {
    setCheckedIncome(!isCheckedIncome);
    setShowIncome(!isCheckedIncome);
  };

  //Population Checkbox Status
  const handlePopulationCheck = () => {
    setCheckedPopulation(!isCheckedPopulation);
    setShowPopulation(!isCheckedPopulation);
  };

  console.log("Current averageIncome:", averageIncome);

  return (
    <div
      style={{
        width: "20%",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Areal Interpolation With Tract Level Census Data
      </h2>
      <p style={{ textAlign: "center" }}>Interpolation: {interpolationSum}</p>
      <p style={{ textAlign: "center" }}>Average Income: {averageIncome}</p>
      <hr style={{ width: "100%" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // 确保这里是左对齐
        }}
      >
        <LegendItem color="#A8E6CF" text="Tract Polygon" />
        <LegendItem
          color="#FFFF00"
          text="Areas of Tract Polygons Captured Within the Area of Interest"
        />
        <LegendItem
          value="10"
          text="Interpolation Count of Persons (18 - 24 Years Old) in Tract"
        />
      </div>
      <hr style={{ width: "100%" }} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={isCheckedPopulation}
            onChange={handlePopulationCheck}
          />
          Population
        </label>
        <label style={{ display: "block", marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={isCheckedIncome}
            onChange={handleIncomeCheck}
          />
          Income
        </label>
        <label style={{ display: "block", marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={isCheckedInterpolation}
            onChange={handleInterpolationCheck}
          />
          Interpolation
        </label>
      </div>
    </div>
  );
}

export default Sidebar;
