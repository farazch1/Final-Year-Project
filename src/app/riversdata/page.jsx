"use client";
import Layout from "../components/layout";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import useDataFetcher from "../scripts/dataFetcher";
import oneRiver from "../scripts/oneRiverData";
//import useDataFetcher, { oneRiver } from "../scripts/dataFetcher";

import Image from "next/image";
import LineImage from "./image.jpeg";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function RiversData() {
  const [scale, setScale] = useState(1);
  const [paragraphContent, setParagraphContent] = useState("60,000"); // State for paragraph content
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Handle both Date objects and ISO strings
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [reach, setReach] = useState("Tarbela_to_Chashma");
  const [startDate, setStartDate] = useState("1994-03-29");
  const [endDate, setEndDate] = useState("1994-04-02");
  const [rivSelection_tg, setRivSelection_tg] = useState("Pnj");
  const [rivSelection_tc, setRivSelection_tc] = useState("Tarbela");
  const [fetchCount, setFetchCount] = useState(0);
  const [dateError, setDateError] = useState("");

  const { data, error } = useDataFetcher(
    reach,
    startDate,
    endDate,
    rivSelection_tc,
    rivSelection_tg
  );

  // For map data

  const [oneReach, setOneReach] = useState("Tarbela_to_Chashma");
  const [oneDate, setOneDate] = useState("1994-03-29");
  const [oneRivSelection_tg, setOneRivSelection_tg] = useState("Pnj");
  const [oneRivSelection_tc, setOneRivSelection_tc] = useState("Tarbela");

  const { oneData, oneError } = oneRiver(
    oneReach,
    oneDate,
    oneRivSelection_tc,
    oneRivSelection_tg
  );

  useEffect(() => {
    console.log("oneData:", oneData);
  }, [oneData]); // Runs every time `oneData` updates

  const formatHeader = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const getDateKey = () => {
    switch (reach) {
      case "Tarbela_to_Chashma":
        return rivSelection_tc === "Tarbela" ? "Date" : "Chashma_Date";
      case "Chashma_to_Taunsa":
        return "Taunsa_Date";
      case "Taunsa_to_Guddu":
        return rivSelection_tg === "Pnj" ? "Pnj_Date" : "Guddu_Date";
      case "Guddu_to_Sukkur":
        return "Sukkur_Date";
      case "Sukkur_to_Kotri":
        return "Kotri_Date";
      default:
        return "Date";
    }
  };

  const dateKey = data.length > 0 ? getDateKey() : "";
  const orderedKeys =
    data.length > 0
      ? [dateKey, ...Object.keys(data[0]).filter((key) => key !== dateKey)]
      : [];

  return (
    <Layout>
      <div className="max-h-96 overflow-y-scroll bg-white pb-2 pl-2 pr-2 rounded-lg shadow-md">
        <div className="mt-2 pb-2 sticky top-0 flex bg-white flex-wrap gap-2 items-center">
          <h2 className="text-xl font-bold text-gray-800">Rivers Data</h2>

          {/* Date Inputs */}
          <div className="flex gap-2">
            <div className="flex flex-col">
              <label htmlFor="startDate" className="text-sm text-gray-600">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-300 p-1 rounded-lg focus:ring focus:bg-white"
                max={endDate}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="endDate" className="text-sm text-gray-600">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;

                  // Prevent selecting an earlier date for "Guddu to Sukkur"
                  if (
                    reach === "Guddu_to_Sukkur" &&
                    selectedDate < "1994-04-03"
                  ) {
                    alert(
                      "End date must be from 04-03-1994 onwards for Guddu to Sukkur."
                    );
                    return;
                  }

                  // Prevent selecting an earlier date for "Sukkur to Kotri"
                  if (
                    reach === "Sukkur_to_Kotri" &&
                    selectedDate < "1994-04-08"
                  ) {
                    alert(
                      "End date must be from 08-04-1994 onwards for Sukkur to Kotri."
                    );
                    return;
                  }

                  setEndDate(selectedDate);
                }}
                className="bg-slate-300 p-1 rounded-lg focus:ring focus:bg-white"
                min={startDate}
              />
            </div>
          </div>

          {/* Reach Selector */}
          <div className="flex flex-col">
            <label htmlFor="reach" className="text-sm text-gray-600">
              Reach
            </label>
            <select
              id="reach"
              className="bg-slate-300 p-1 rounded-lg focus:ring focus:bg-white cursor-pointer"
              value={reach}
              onChange={(e) => {
                const selectedReach = e.target.value;
                setReach(selectedReach);

                // Alert for "Taunsa to Guddu"
                if (selectedReach === "Taunsa_to_Guddu") {
                  alert("Please select start date from 30-03-1994 onwards.");
                  setStartDate("1994-03-30"); // Default start date
                }

                // Alert for "Guddu to Sukkur"
                if (selectedReach === "Guddu_to_Sukkur") {
                  alert("Please select an end date from 04-03-1994 onwards.");
                  setEndDate("1994-04-03"); // Default end date
                }

                // Alert for "Sukkur to Kotri"
                if (selectedReach === "Sukkur_to_Kotri") {
                  alert("Please select an end date from 08-04-1994 onwards.");
                  setEndDate("1994-04-08"); // Default end date
                }
              }}
            >
              <option value="Tarbela_to_Chashma">Tarbela to Chashma</option>
              <option value="Chashma_to_Taunsa">Chashma to Taunsa</option>
              <option value="Taunsa_to_Guddu">Taunsa to Guddu</option>
              <option value="Guddu_to_Sukkur">Guddu to Sukkur</option>
              <option value="Sukkur_to_Kotri">Sukkur to Kotri</option>
            </select>
          </div>

          {/* Additional Selectors */}
          {reach === "Tarbela_to_Chashma" && (
            <div className="flex flex-col">
              <label
                htmlFor="rivSelection_tc"
                className="text-sm text-gray-600"
              >
                Location
              </label>
              <select
                id="rivSelection_tc"
                className="bg-slate-300 p-1 rounded-lg focus:ring focus:bg-white cursor-pointer"
                value={rivSelection_tc}
                onChange={(e) => setRivSelection_tc(e.target.value)}
              >
                <option value="Tarbela">Tarbela</option>
                <option value="Chashma">Chashma</option>
              </select>
            </div>
          )}

          {reach === "Taunsa_to_Guddu" && (
            <div className="flex flex-col">
              <label
                htmlFor="rivSelection_tg"
                className="text-sm text-gray-600"
              >
                Location
              </label>
              <select
                id="rivSelection_tg"
                className="bg-slate-300 p-1 rounded-lg focus:ring focus:bg-white cursor-pointer"
                value={rivSelection_tg}
                onChange={(e) => setRivSelection_tg(e.target.value)}
              >
                <option value="Pnj">Punjnad</option>
                <option value="Guddu">Guddu</option>
              </select>
            </div>
          )}

          {/* Fetch Button */}
          {/* <button
            onClick={handleFetch}
            className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 mt-5"
          >
            Fetch Data
          </button> */}
        </div>

        {/* Error Messages */}
        {dateError && <p className="text-red-500 text-sm mt-2">{dateError}</p>}
        {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}

        {/* Data Table */}
        {data.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 table-fixed">
            <thead className="sticky top-10">
              <tr className="bg-gray-200">
                {orderedKeys.map((key) => (
                  <th
                    key={key}
                    className="px-2 py-1 text-left text-sm font-semibold text-gray-800 border-b border-gray-300"
                  >
                    {formatHeader(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {orderedKeys.map((key) => (
                    <td
                      key={key}
                      className="px-2 py-1 border-b border-gray-300"
                    >
                      {key.toLowerCase().includes("date")
                        ? formatDate(item[key])
                        : item[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-2">No data available</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 justify-center my-5">
        {/* Date Input */}
        <div className="flex flex-col">
          <label htmlFor="oneDate" className="text-sm text-gray-600">
            Date
          </label>
          <input
            id="oneDate"
            type="date"
            value={oneDate}
            onChange={(e) => setOneDate(e.target.value)}
            className="bg-slate-300 p-1 rounded-lg focus:ring focus:bg-white"
          />
        </div>

        {/* Reach Selector */}
        <div className="flex flex-col">
          <label htmlFor="oneReach" className="text-sm text-gray-600">
            Reach
          </label>
          <select
            id="oneReach"
            className="bg-slate-300 p-1 rounded-lg focus:ring focus:bg-white cursor-pointer"
            value={oneReach}
            onChange={(e) => {
              const selectedOneReach = e.target.value;
              setOneReach(selectedOneReach);

              // Show alert if "Taunsa to Guddu" is selected
              if (selectedOneReach === "Taunsa_to_Guddu") {
                alert("Please select a date from 30-03-1994 onwards.");
                setOneDate("1994-03-30"); // Set default date
              }

              // Show alert if "Guddu to Sukkur" is selected
              if (selectedOneReach === "Guddu_to_Sukkur") {
                alert("Please select a date from 04-03-1994 onwards.");
                setOneDate("1994-04-03"); // Set default date
              }

              // Show alert if "Sukkur to Kotri" is selected
              if (selectedOneReach === "Sukkur_to_Kotri") {
                alert("Please select a date from 08-04-1994 onwards.");
                setOneDate("1994-04-08"); // Set default date
              }
            }}
          >
            <option value="Tarbela_to_Chashma">Tarbela to Chashma</option>
            <option value="Chashma_to_Taunsa">Chashma to Taunsa</option>
            <option value="Taunsa_to_Guddu">Taunsa to Guddu</option>
            <option value="Guddu_to_Sukkur">Guddu to Sukkur</option>
            <option value="Sukkur_to_Kotri">Sukkur to Kotri</option>
          </select>
        </div>

        {/* Conditional Selectors */}
        {reach === "Tarbela_to_Chashma" && (
          <div className="flex flex-col">
            <label htmlFor="rivSelection_tc" className="text-sm text-gray-600">
              Location
            </label>
            <select
              id="rivSelection_tc"
              className="bg-slate-300 p-1 rounded-lg focus:ring focus:bg-white cursor-pointer"
              value={rivSelection_tc}
              onChange={(e) => setRivSelection_tc(e.target.value)}
            >
              <option value="Tarbela">Tarbela</option>
              <option value="Chashma">Chashma</option>
            </select>
          </div>
        )}

        {reach === "Taunsa_to_Guddu" && (
          <div className="flex flex-col">
            <label htmlFor="rivSelection_tg" className="text-sm text-gray-600">
              Location
            </label>
            <select
              id="rivSelection_tg"
              className="bg-slate-300 p-1 rounded-lg focus:ring focus:bg-white cursor-pointer"
              value={rivSelection_tg}
              onChange={(e) => setRivSelection_tg(e.target.value)}
            >
              <option value="Pnj">Punjnad</option>
              <option value="Guddu">Guddu</option>
            </select>
          </div>
        )}
      </div>

      {/* Image Component */}
      <div className="flex justify-center mt-5">
        <Image
          src={LineImage}
          alt="Schematic Diagram"
          width={700 * scale} // Adjust width based on scale
          height={500 * scale} // Adjust height based on scale
          className="rounded-lg shadow-md z-10 absolute"
        />
        <p className="absolute left-[620px] top-[623px] text-[12px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Tarbela_Outflows ? (
            oneData[0].Tarbela_Outflows
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>

        <p className="absolute left-[620px] top-[642px] text-[12px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Bal_for_Chashma ? (
            oneData[0].Bal_for_Chashma
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>

        <p className="absolute left-[620px] top-[816px] text-[12px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Chashma_upstream ? (
            oneData[0].Chashma_upstream
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>

        <p className="absolute left-[620px] top-[836px] text-[12px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Chashma_downstream ? (
            oneData[0].Chashma_downstream
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>

        {/* Kotri */}
        <p className="absolute left-[620px] top-[1405px] text-[9.5px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Kotri_U_S ? (
            oneData[0].Kotri_U_S
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>

        <p className="absolute left-[620px] top-[1417px] text-[9.5px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Kotri_D_S ? (
            oneData[0].Kotri_D_S
          ) : (
            <span className="opacity-50">NIL</span>
          )}
        </p>

        {/* Taunsa */}

        <p className="absolute left-[620px] top-[1070px] text-[12px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Taunsa_U_S ? (
            oneData[0].Taunsa_U_S
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>

        <p className="absolute left-[620px] top-[1088px] text-[12px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Taunsa_D_S ? (
            oneData[0].Taunsa_D_S
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>

        {/* Guddu */}
        <p className="absolute left-[620px] top-[1335px] text-[10px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Guddu_U_S ? (
            oneData[0].Guddu_U_S
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>

        <p className="absolute left-[620px] top-[1349px] text-[10px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Guddu_D_S ? (
            oneData[0].Guddu_D_S
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>

        {/* Sukkur */}
        <p className="absolute left-[620px] top-[1375px] text-[10px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Sukkur_U_S ? (
            oneData[0].Sukkur_U_S
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>

        <p className="absolute left-[620px] top-[1390px] text-[10px] font-semibold text-black z-20">
          {oneData && oneData.length > 0 && oneData[0].Sukkur_D_S ? (
            oneData[0].Sukkur_D_S
          ) : (
            <span className="opacity-50">N/A</span>
          )}
        </p>
      </div>
    </Layout>
  );
}
