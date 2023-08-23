import React from "react";

function LegendItem({ color, text, value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "25px",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: color,
          marginRight: "15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {value && <b style={{ fontSize: "20px" }}>{value}</b>}
      </div>
      <span>{text}</span>
    </div>
  );
}

export default LegendItem;
