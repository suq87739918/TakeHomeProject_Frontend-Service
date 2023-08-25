import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import * as turf from "@turf/turf";

const API_BASE_URL =
  "http://TakeHomeProjectDemo-env.eba-xetrpece.us-east-1.elasticbeanstalk.com";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3VxODc3Mzk5MTgiLCJhIjoiY2xsaGRxbzN5MDlyZTNlbmwxYTV0enZhZCJ9.OlK3d8wMIiyuhzHy0DRNRA";

function MapContainer({
  setInterpolationSum,
  showInterpolation,
  showIncome,
  showPopulation,
  setAverageIncome,
}) {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  const polygonLayers = useRef([]);
  const interpolations = useRef([]);
  const averageIncomes = useRef([]);
  const incomeAndPopulation = useRef([]);

  const fetchIncomeAndPopulation = async () => {
    const response = await axios.get(
      // "http://localhost:8080/api/getIncomeAndPopulation"
      `${API_BASE_URL}/api/getIncomeAndPopulation`
    );
    const data = response.data;
    incomeAndPopulation.current = data;
  };

  const fetchAverageIncome = async () => {
    const response = await axios.get(
      // "http://localhost:8080/api/getAverageIncomes"
      `${API_BASE_URL}/api/getAverageIncomes`
    );
    const data = response.data;
    averageIncomes.current = data;
  };

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-96.57159, 33.1799],
      zoom: 10,
    });

    map.current.on("load", async () => {
      await fetchAverageIncome();
      await fetchIncomeAndPopulation();
      const response = await axios.get(
        // `http://localhost:8080/api/getInterpolations`
        `${API_BASE_URL}/api/getInterpolations`
      );
      const data = response.data;

      data.forEach((item) => {
        const sourceId = `geojsonLayer-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        polygonLayers.current.push(sourceId);

        map.current.addSource(sourceId, {
          type: "geojson",
          data: JSON.parse(item.geoJSON),
        });

        map.current.addLayer({
          id: sourceId + "-fill",
          type: "fill",
          source: sourceId,
          layout: {},
          paint: {
            "fill-color": "#A8E6CF",
            "fill-opacity": 0.4,
          },
        });

        map.current.addLayer({
          id: sourceId + "-outline",
          type: "line",
          source: sourceId,
          layout: {},
          paint: {
            "line-color": "#000000",
            "line-width": 2,
          },
        });

        const centroid = turf.centroid(JSON.parse(item.geoJSON));
        interpolations.current.push(item.interpolation);

        const centroidSourceId = `centroid-${sourceId}`;
        map.current.addSource(centroidSourceId, {
          type: "geojson",
          data: centroid,
        });

        map.current.addLayer({
          id: centroidSourceId,
          type: "circle",
          source: centroidSourceId,
          paint: {
            "circle-color": "#0000FF",
            "circle-radius": 5,
          },
        });

        map.current.addLayer({
          id: sourceId + "-label",
          type: "symbol",
          source: centroidSourceId,
          layout: {
            "text-field": showInterpolation
              ? item.interpolation.toFixed(2)
              : "",
            "text-offset": [0, 1.5],
          },
          paint: {
            "text-color": "#0000FF",
            "text-halo-color": "#FFFFFF",
            "text-halo-width": 1.5,
          },
        });
      });

      map.current.on("click", (e) => {
        const clickedPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);
        const circle = turf.circle(clickedPoint.geometry.coordinates, 5, {
          steps: 100,
          units: "kilometers",
        });

        if (map.current.getSource("clicked-circle")) {
          map.current.getSource("clicked-circle").setData(circle);
        } else {
          map.current.addSource("clicked-circle", {
            type: "geojson",
            data: circle,
          });

          map.current.addLayer({
            id: "clicked-circle-layer",
            type: "fill",
            source: "clicked-circle",
            paint: {
              "fill-color": "#FFFF00",
              "fill-opacity": 0.5,
            },
          });
        }

        let currentInterpolationSum = 0;
        let currentAverageIncomeSum = 0;
        let selectedPolygonCount = 0;
        polygonLayers.current.forEach((sourceId, index) => {
          const centroidSourceId = `centroid-${sourceId}`;
          const distance = turf.distance(
            map.current.getSource(centroidSourceId).serialize().data.geometry
              .coordinates,
            clickedPoint.geometry.coordinates,
            { units: "kilometers" }
          );
          if (distance <= 5) {
            currentInterpolationSum += interpolations.current[index];
            currentAverageIncomeSum += averageIncomes.current[index];
            selectedPolygonCount++;
            map.current.setPaintProperty(
              sourceId + "-fill",
              "fill-color",
              "#FF0000"
            );
          } else {
            map.current.setPaintProperty(
              sourceId + "-fill",
              "fill-color",
              "#A8E6CF"
            );
          }
        });
        setInterpolationSum(currentInterpolationSum);
        const newAverageIncome = selectedPolygonCount
          ? currentAverageIncomeSum / selectedPolygonCount
          : 0;

        setAverageIncome(newAverageIncome);
      });
    });

    return () => map.current.remove();
  }, [setInterpolationSum]);

  useEffect(() => {
    if (map.current) {
      polygonLayers.current.forEach((sourceId, index) => {
        let label = "";
        if (showInterpolation) {
          label += `Interpolation: ${interpolations.current[index].toFixed(
            2
          )}\n`;
        }
        if (showIncome) {
          label += `Income: ${incomeAndPopulation.current[index]?.income}\n`;
        }
        if (showPopulation) {
          label += `Population: ${incomeAndPopulation.current[index]?.population}\n`;
        }

        map.current.setLayoutProperty(sourceId + "-label", "text-field", label);
      });
    }
  }, [showInterpolation, showIncome, showPopulation]);

  return (
    <div ref={mapContainerRef} style={{ width: "80%", height: "100vh" }} />
  );
}

export default MapContainer;
