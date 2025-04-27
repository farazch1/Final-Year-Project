// "use client";
// import React, { useState } from "react";
// import Layout from "../components/layout";
// import { Line } from "react-chartjs-2";

// export default function SeasonalForecast() {
//   const [selectedSeason, setSelectedSeason] = useState("Kharif");

//   const handleSeasonChange = (event) => {
//     setSelectedSeason(event.target.value);
//   };

//   // Kharif and Rabi forecast block data
//   const kharifData = [
//     { name: "Taunsa D/S", value: "5,000 Cusecs", color: "#FBE9E7" }, // Light Orange
//     { name: "Panjnad D/S", value: "3,200 Cusecs", color: "#E3F2FD" }, // Light Blue
//     { name: "Kotri D/S", value: "4,500 Cusecs", color: "#E8F5E9" }, // Light Green
//     { name: "System Inflow (2+3-4)", value: "10,700 Cusecs", color: "#FCE4EC" }, // Light Pink
//   ];

//   const rabiData = [
//     { name: "Chenab D/S", value: "2,800 Cusecs", color: "#FFF3E0" }, // Light Orange-Yellow
//     { name: "Jhelum D/S", value: "3,100 Cusecs", color: "#E1F5FE" }, // Light Sky Blue
//     { name: "Ravi D/S", value: "1,800 Cusecs", color: "#E8F5E9" }, // Light Green
//     { name: "System Outflow (2+3-4)", value: "7,700 Cusecs", color: "#FCE4EC" }, // Light Pink
//   ];

//   const forecastData = selectedSeason === "Kharif" ? kharifData : rabiData;

//   // Kharif detailed table and graph data
//   const detailedData = {
//     indusZone: [
//       { year: 2004, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2005, indus: 56.0, kabul: 23.006, systemInflow: 92.956, canalWdls: 52.849, gainsLosses: -15.725 },
//       { year: 2004, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2004, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2004, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2004, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2004, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2004, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },

//     ],
//     jcZone: [
//       { year: 2004, jhelum: 11.739, chenab: 14.903, systemInflow: 24.481, canalWdls: 15.658, gainsLosses: -2.411 },
//       { year: 2005, jhelum: 17.725, chenab: 21.112, systemInflow: 36.079, canalWdls: 17.906, gainsLosses: -0.556 },
//       { year: 2006, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2007, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2008, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2009, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2010, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2011, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2012, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2013, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },
//       { year: 2014, indus: 42.063, kabul: 11.13, systemInflow: 56.455, canalWdls: 43.458, gainsLosses: -12.792 },

//     ],
//   };

//   return (
//     <Layout>
//       <div className="container">
//         <h1>Seasonal Forecast</h1>

//         {/* Forecast Blocks */}
//         <div className="forecast-blocks">
//           {forecastData.map((block, index) => (
//             <div
//               key={index}
//               className="forecast-block"
//               style={{ backgroundColor: block.color }}
//             >
//               <h3>{block.name}</h3>
//               <p>{block.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Radio Buttons */}
//         <div className="radio-buttons">
//           <label>
//             <input
//               type="radio"
//               value="Kharif"
//               checked={selectedSeason === "Kharif"}
//               onChange={handleSeasonChange}
//             />
//             <span>Kharif</span>
//           </label>
//           <label>
//             <input
//               type="radio"
//               value="Rabi"
//               checked={selectedSeason === "Rabi"}
//               onChange={handleSeasonChange}
//             />
//             <span>Rabi</span>
//           </label>
//         </div>

//         {/* Kharif Detailed Tables and Graphs */}
//         {selectedSeason === "Kharif" && (
//           <>
//             <h2>Kharif Detailed Forecast</h2>

//             <h3>Indus Zone</h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Year</th>
//                   <th>Indus @ Tarbela</th>
//                   <th>Kabul @ Nowshera</th>
//                   <th>System Inflow</th>
//                   <th>Canal Wdls</th>
//                   <th>Gains/Losses</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {detailedData.indusZone.map((row, index) => (
//                   <tr key={index}>
//                     <td>{row.year}</td>
//                     <td>{row.indus}</td>
//                     <td>{row.kabul}</td>
//                     <td>{row.systemInflow}</td>
//                     <td>{row.canalWdls}</td>
//                     <td>{row.gainsLosses}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <h3>Graphs</h3>
//             <Line
//               data={{
//                 labels: detailedData.indusZone.map((row) => row.year),
//                 datasets: [
//                   {
//                     label: "System Inflow (Indus Zone)",
//                     data: detailedData.indusZone.map((row) => row.systemInflow),
//                     borderColor: "blue",
//                     fill: false,
//                   },
//                   {
//                     label: "System Inflow (J-C Zone)",
//                     data: detailedData.jcZone.map((row) => row.systemInflow),
//                     borderColor: "green",
//                     fill: false,
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: { position: "top" },
//                 },
//               }}
//             />
//           </>
//         )}
//       </div>

//       <style jsx>{`
//         .container {
//           text-align: center;
//           margin: 20px auto;
//           max-width: 900px;
//         }
//         .forecast-blocks {
//           display: flex;
//           justify-content: space-between;
//           gap: 10px;
//           margin: 20px 0;
//         }
//         .forecast-block {
//           flex: 1;
//           padding: 15px;
//           color: #333;
//           border-radius: 10px;
//           text-align: center;
//           border: 1px solid #ddd;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
//         }
//         .forecast-block h3 {
//           font-size: 16px;
//           margin-bottom: 5px;
//           color: #555;
//         }
//         .forecast-block p {
//           font-size: 14px;
//           font-weight: bold;
//         }
//         .radio-buttons {
//           margin: 20px 0;
//           display: flex;
//           justify-content: center;
//           gap: 30px;
//         }
//         .radio-buttons label {
//           font-size: 18px;
//           font-weight: bold;
//           display: flex;
//           align-items: center;
//           cursor: pointer;
//         }
//         .radio-buttons input {
//           margin-right: 10px;
//           accent-color: #007bff; /* Custom color for radio buttons */
//         }
//         table {
//           width: 100%;
//           margin: 20px 0;
//           border-collapse: collapse;
//         }
//         thead th, tbody td {
//           border: 1px solid #ccc;
//           padding: 8px;
//         }
//         thead th {
//           background-color: #f4f4f4;
//         }
//       `}</style>
//     </Layout>
//   );
// }


"use client";
import Layout from "../components/layout";
import { useState } from "react";


export default function SeasonalForecast()
{
  return(<Layout>
    <div>HELLO </div>
  </Layout>)
}