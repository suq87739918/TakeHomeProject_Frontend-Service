import React from "react";
import LegendItem from "./LegendItem";

function Sidebar({ interpolationSum }) {
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
          text="Interpolation Count of Persons (28 - 24 Years Old) in Tract"
        />
      </div>
    </div>
  );
}

export default Sidebar;
