"use client";
import React from 'react';
import Layout from "@/app/components/layout"; // Ensure the path to Layout is correct
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";


// Marker icons setup to avoid issues with default icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Define data for rivers and barrages with additional details (upstream, downstream, lag time)
const riverLocations = [
  { name: "River Indus", position: [30.3753, 69.3451], upstream: "500 km", downstream: "450 km", lagTime: "2 hours", type: 'river' },
  { name: "Chenab River", position: [32.293, 73.736], upstream: "300 km", downstream: "250 km", lagTime: "1.5 hours", type: 'river' },
  { name: "Jhelum River", position: [33.7667, 73.0833], upstream: "200 km", downstream: "150 km", lagTime: "1 hour", type: 'river' },
];

const barrageLocations = [
  { name: "Guddu Barrage", position: [28.4277, 69.7046], upstream: "100 km", downstream: "80 km", lagTime: "30 mins", type: 'barrage' },
  { name: "Sukkur Barrage", position: [27.6904, 68.8697], upstream: "120 km", downstream: "100 km", lagTime: "45 mins", type: 'barrage' },
  { name: "Taunsa Barrage", position: [30.5209, 70.8674], upstream: "150 km", downstream: "120 km", lagTime: "1 hour", type: 'barrage' },
];

// Legend content
const legendContent = [
  { label: "Rivers", color: "blue" },
  { label: "Canals", color: "green" },
  { label: "Main Canals", color: "orange" },
  { label: "Barrages", color: "red" },
];

// Create a custom marker icon function
const getMarkerIcon = (type) => {
  switch (type) {
    case 'river':
      return new L.Icon({ iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41], iconColor: 'blue' });
    case 'barrage':
      return new L.Icon({ iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41], iconColor: 'red' });
    // Add cases for canals and main canals if needed
    default:
      return new L.Icon({ iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
  }
};

const Legend = () => (
  <div style={{
    position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', zIndex: 1000
  }}>
    <h4>Legend</h4>
    <ul style={{ padding: 0, margin: 0 }}>
      {legendContent.map((item, index) => (
        <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: item.color, marginRight: '5px' }}></div>
          {item.label}
        </li>
      ))}
    </ul>
  </div>
);

export default function Map() {
  return (
    <Layout>
      <h2>OpenStreet Map</h2><br />
      <MapContainer center={[30.3753, 69.3451]} zoom={6} style={{ height: "600px", width: "100%", position: 'relative' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Rivers Markers */}
        {riverLocations.map((river, index) => (
          <Marker key={index} position={river.position} icon={getMarkerIcon(river.type)}>
            <Popup>
              <strong>{river.name}</strong><br />
              <b>Upstream:</b> {river.upstream}<br />
              <b>Downstream:</b> {river.downstream}<br />
              <b>Lag Time:</b> {river.lagTime}
            </Popup>
          </Marker>
        ))}

        {/* Barrages Markers */}
        {barrageLocations.map((barrage, index) => (
          <Marker key={index} position={barrage.position} icon={getMarkerIcon(barrage.type)}>
            <Popup>
              <strong>{barrage.name}</strong><br />
              <b>Upstream:</b> {barrage.upstream}<br />
              <b>Downstream:</b> {barrage.downstream}<br />
              <b>Lag Time:</b> {barrage.lagTime}
            </Popup>
          </Marker>
        ))}
        
        {/* Legend */}
        <Legend />
      </MapContainer>

      <h2>Insights and Recommendations</h2>
      <ul>
        <li><strong>Key Rivers:</strong> Important rivers like the Indus, Chenab, and Jhelum are displayed for easy identification.</li>
        <li><strong>Notable Barrages:</strong> Key barrages like Guddu, Sukkur, and Taunsa are marked, providing quick access to information and locations.</li>
        <li><strong>Actionable Insights:</strong> Use this map to analyze water distribution across rivers and assess the impact of various barrages on water flow.</li>
      </ul>
    </Layout>
  );
}
