import React, { useState } from "react";
import MapContainer from "./MapContainer";
import Sidebar from "./Sidebar";

function MapboxTest() {
  const [interpolationSum, setInterpolationSum] = useState(0);

  return (
    <div style={{ display: "flex" }}>
      <MapContainer setInterpolationSum={setInterpolationSum} />
      <Sidebar interpolationSum={interpolationSum.toFixed(1)} />
    </div>
  );
}

export default MapboxTest;
