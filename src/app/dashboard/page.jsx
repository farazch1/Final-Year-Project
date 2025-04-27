"use client";
import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/layout";
import { Chart } from "chart.js/auto";
import { FaTemperatureHigh, FaCloudRain, FaSnowflake, FaMountain } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Ensure Marker and Popup are imported
import Image from "next/image";
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import ForecastChart from "./1.png"; // Import the image
import PredictionChart from "./2.png"; // Import the image  
import RMSEChart from "./3.png"; // Import the image


export default function Dashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('Tarbela');

  // Function to fetch data with a specified query
  const fetchData = async (query, parameters = {}) => {
    try {
      console.log('Fetching data with query:', query);
      const response = await fetch('/api/neo4j', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, parameters }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      setData(result);
      console.log('Data fetched:', result);
      setError(null);  // Clear any previous error
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setData([]);  // Clear previous data if there's an error
    }
  };

  useEffect(() => {
    if (selectedRegion === 'Tarbela') {
      const query = `
        MATCH (d:Tarbela) RETURN(d) LIMIT 10
      `;
      fetchData(query);
    }
  }, [selectedRegion]);

  const chartRef = useRef(null);
  const myChartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (myChartRef.current) {
      myChartRef.current.destroy();
    }

    

    myChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["2020", "2021", "2022", "2023"], // Sample years
        datasets: [
          {
            label: "Metric 1",
            data: [12, 19, 3, 5], // Sample data
            backgroundColor: "rgba(54, 162, 235, 0.5)",
          },
          {
            label: "Metric 2",
            data: [2, 29, 5, 10], // Sample data
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      },
    });

    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (data.length > 0) {
        // const usefulKeys = lengthOfObject(data, 0);
        // console.log("Number of useful headings:", Object.keys(data[0])[0]);
        // document.querySelector(".datess").innerHTML = Object.keys(data[0])[0];
        console.log(data);
      }
  },[data]);

  return (
    <Layout>
      <div className="p-3 bg-gray-100 min-h-screen ">
        {/* Data Overview with Icons */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* Precipitation Box */}
          <div className="bg-green-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <FaCloudRain className="text-3xl text-green-700" />
            <h2 className="text-lg font-semibold text-green-700 mt-2">
              Precipitation
            </h2>
            <p className="text-sm text-gray-600">01-Jan-2000 to 27-Feb-2024</p>
          </div>

          {/* Temperature Box */}
          <div className="bg-orange-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <FaTemperatureHigh className="text-3xl text-orange-700" />
            <h2 className="text-lg font-semibold text-orange-700 mt-2">
              Temperature
            </h2>
            <p className="text-sm text-gray-600">04-Mar-2002 to 30-Aug-2021</p>
          </div>

          {/* SCA Box */}
          <div className="bg-blue-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <FaSnowflake className="text-3xl text-blue-700" />
            <h2 className="text-lg font-semibold text-blue-700 mt-2">SCA</h2>
            <p className="text-sm text-gray-600">26-Feb-2000 to 20-Feb-2024</p>
          </div>

          {/* Glacier Box */}
          <div className="bg-teal-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <FaMountain className="text-3xl text-teal-700" />
            <h2 className="text-lg font-semibold text-teal-700 mt-2">
              Glacier
            </h2>
            <p className="text-sm text-gray-600">26-Feb-2000 to 20-Feb-2024</p>
          </div>
        </div>

        {/* Table and Chart Section (Side by Side) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Table Section */}
          <div className="max-h-96 overflow-y-scroll bg-white pb-2 pl-2 pr-2 rounded-lg shadow-md">
            <div className="mt-2 sticky top-0 flex justify-between bg-white">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Tarbela Data
              </h2>
              {/* Dropdown to select region */}
              <select
                className="mb-2 bg-slate-300 p-2 rounded-lg focus:ring focus:bg-white cursor-pointer"
                name="regions"
                id="regions"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="Tarbela">Tarbela</option>
                <option value="Kabul">Kabul</option>
              </select>
              {/* Error display */}
              {error && <p style={{ color: "red" }}>Error: {error}</p>}
            </div>
            {/* Data display */}
            <table className="min-w-full bg-white border border-gray-300 table-fixed">
              <thead className="sticky top-10">
                <tr className="bg-gray-200">
                  <th className="px-2 py-1 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Date
                  </th>
                  <th className="px-2 py-1 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Tarbela Outflows
                  </th>
                  <th className="px-2 py-1 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Kabul River
                  </th>
                  <th className="px-2 py-1 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Thal Canal
                  </th>
                  <th className="px-2 py-1 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Bal For Chashma
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2 py-1 border-b border-gray-300">{`${item.date.day.low}/${item.date.month.low}/${item.date.year.low}`}</td>
                    <td className="px-2 py-1 border-b border-gray-300">
                      {item.tarbela_outflows.low}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-300">
                      {item.kabul_river.low}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-300">
                      {item.thal_canal.low}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-300">
                      {item.bal_for_chashma.low}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Data Overview Chart
            </h2>
            <canvas
              ref={chartRef}
              id="myChart"
              className="w-full h-64"
            ></canvas>
          </div>
        </div>

        {/* ================= ML Chart Section ================= */}
        <div className="bg-white p-6 mt-10 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            ML-Based Outflow Forecasting
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <Image
                src={PredictionChart}
                alt="Actual vs Predicted"
                width={400}
                height={300}
                className="rounded-lg shadow"
              />
              <p className="text-sm mt-2 text-center text-gray-700">
                Actual vs Predicted Outflows
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Image
                src={RMSEChart}
                alt="RMSE Chart"
                width={400}
                height={300}
                className="rounded-lg shadow"
              />
              <p className="text-sm mt-2 text-center text-gray-700">
                Model Error (RMSE)
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Image
                src={ForecastChart}
                alt="Future Forecast"
                width={400}
                height={300}
                className="rounded-lg shadow"
              />
              <p className="text-sm mt-2 text-center text-gray-700">
                Forecasted Outflows
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            World Map Overview
          </h2>

          <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
            <MapContainer
              center={[30.3753, 69.3451]}
              zoom={6}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Example Markers */}
              <Marker position={[28.4277, 69.7046]}>
                <Popup>
                  <strong>Guddu Barrage</strong>
                  <br />
                  <b>Upstream:</b> 100 km
                  <br />
                  <b>Downstream:</b> 80 km
                  <br />
                  <b>Lag Time:</b> 30 mins
                </Popup>
              </Marker>

              <Marker position={[27.6904, 68.8697]}>
                <Popup>
                  <strong>Sukkur Barrage</strong>
                  <br />
                  <b>Upstream:</b> 120 km
                  <br />
                  <b>Downstream:</b> 100 km
                  <br />
                  <b>Lag Time:</b> 45 mins
                </Popup>
              </Marker>

              <Marker position={[30.5209, 70.8674]}>
                <Popup>
                  <strong>Taunsa Barrage</strong>
                  <br />
                  <b>Upstream:</b> 150 km
                  <br />
                  <b>Downstream:</b> 120 km
                  <br />
                  <b>Lag Time:</b> 1 hour
                </Popup>
              </Marker>

              {/* Legend */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "5px",
                  boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                  zIndex: 1000,
                }}
              >
                <h4 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Legend
                </h4>
                <ul style={{ margin: 0, padding: 0, fontSize: "14px" }}>
                  <li>
                    <span style={{ color: "blue" }}>●</span> Rivers
                  </li>
                  <li>
                    <span style={{ color: "green" }}>●</span> Canals
                  </li>
                  <li>
                    <span style={{ color: "orange" }}>●</span> Main Canals
                  </li>
                  <li>
                    <span style={{ color: "red" }}>●</span> Barrages
                  </li>
                </ul>
              </div>
            </MapContainer>
          </div>
        </div>  
      </div>
    </Layout>
  );
}