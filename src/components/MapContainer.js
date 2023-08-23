import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import axios from "axios";
import * as turf from "@turf/turf";

const API_BASE_URL =
  "http://TakeHomeProjectDemo-env.eba-xetrpece.us-east-1.elasticbeanstalk.com";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3VxODc3Mzk5MTgiLCJhIjoiY2xsaGRxbzN5MDlyZTNlbmwxYTV0enZhZCJ9.OlK3d8wMIiyuhzHy0DRNRA";

function MapContainer({ setInterpolationSum }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-96.57159, 33.1799],
      zoom: 10,
    });

    const polygonLayers = [];
    const centroids = [];
    const interpolations = [];

    map.on("load", async () => {
      const response = await axios.get(
        // `http://localhost:8080/api/getInterpolations`
        `${API_BASE_URL}/api/getInterpolations`
      );
      const data = response.data;

      data.forEach((item) => {
        const sourceId = `geojsonLayer-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        polygonLayers.push(sourceId);

        map.addSource(sourceId, {
          type: "geojson",
          data: JSON.parse(item.geoJSON),
        });

        map.addLayer({
          id: sourceId + "-fill",
          type: "fill",
          source: sourceId,
          layout: {},
          paint: {
            "fill-color": "#A8E6CF",
            "fill-opacity": 0.4,
          },
        });

        map.addLayer({
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
        centroids.push({
          coordinates: centroid.geometry.coordinates,
          layerId: sourceId + "-fill",
        });

        interpolations.push(item.interpolation);

        const centroidSourceId = `centroid-${sourceId}`;
        map.addSource(centroidSourceId, {
          type: "geojson",
          data: centroid,
        });

        map.addLayer({
          id: centroidSourceId,
          type: "circle",
          source: centroidSourceId,
          paint: {
            "circle-color": "#0000FF",
            "circle-radius": 5,
          },
        });

        map.addLayer({
          id: sourceId + "-label",
          type: "symbol",
          source: centroidSourceId,
          layout: {
            "text-field": item.interpolation.toFixed(2),
            "text-offset": [0, 1.5],
          },
          paint: {
            "text-color": "#0000FF",
            "text-halo-color": "#FFFFFF",
            "text-halo-width": 1.5,
          },
        });
      });

      map.on("click", (e) => {
        const clickedPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);
        const circle = turf.circle(clickedPoint.geometry.coordinates, 5, {
          steps: 100,
          units: "kilometers",
        });

        if (map.getSource("clicked-circle")) {
          map.getSource("clicked-circle").setData(circle);
        } else {
          map.addSource("clicked-circle", {
            type: "geojson",
            data: circle,
          });

          map.addLayer({
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
        centroids.forEach((centroidData, index) => {
          const distance = turf.distance(
            centroidData.coordinates,
            clickedPoint.geometry.coordinates,
            { units: "kilometers" }
          );
          if (distance <= 5) {
            currentInterpolationSum += interpolations[index];
            map.setPaintProperty(centroidData.layerId, "fill-color", "#FF0000");
          } else {
            map.setPaintProperty(centroidData.layerId, "fill-color", "#A8E6CF");
          }
        });
        setInterpolationSum(currentInterpolationSum);
      });
    });

    return () => map.remove();
  }, [setInterpolationSum]);

  return (
    <div ref={mapContainerRef} style={{ width: "80%", height: "100vh" }} />
  );
}

export default MapContainer;
