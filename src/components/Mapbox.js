import React, { useState } from "react";
import MapContainer from "./MapContainer";
import Sidebar from "./Sidebar";

function Mapbox() {
  const [interpolationSum, setInterpolationSum] = useState(0);
  const [showInterpolation, setShowInterpolation] = useState(false);
  const [showIncome, setShowIncome] = useState(false);
  const [showPopulation, setShowPopulation] = useState(false);
  const [averageIncome, setAverageIncome] = useState(0);

  return (
    <div style={{ display: "flex" }}>
      <MapContainer
        setInterpolationSum={setInterpolationSum}
        showInterpolation={showInterpolation}
        setAverageIncome={setAverageIncome}
        showIncome={showIncome}
        showPopulation={showPopulation}
      />
      <Sidebar
        interpolationSum={interpolationSum.toFixed(1)}
        setShowInterpolation={setShowInterpolation}
        averageIncome={
          typeof averageIncome === "number" ? averageIncome.toFixed(1) : "0.0"
        }
        setShowIncome={setShowIncome}
        setShowPopulation={setShowPopulation}
      />
    </div>
  );
}

export default Mapbox;
