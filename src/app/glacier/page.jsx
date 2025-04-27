"use client";
import React, { useState } from "react";
import Layout from "../components/layout";
import Image from "next/image";
import ForecastChart1 from "./3.png";
import ForecastChart2 from "./2.png";
import ForecastChart3 from "./1.png";

export default function MLPrediction() {
  const [inputDate, setInputDate] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();

    if (!inputDate) {
      alert("Please select a date!");
      return;
    }

    setPredictionResult("Loading...");

    // Simulate backend call
    setTimeout(() => {
      const fakePrediction = 83200; // Simulated value
      setPredictionResult(`Predicted Chashma Upstream Flow: ${fakePrediction}`);
    }, 1000);
  };

  return (
    <Layout>
      <div className="p-4 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          ML-Based Tarbela Outflow Forecasting
        </h1>

        {/* Forecast Charts */}
        <div className="flex overflow-x-auto space-x-6">
          {[ForecastChart1, ForecastChart2, ForecastChart3].map((img, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md min-w-[420px]"
            >
              <Image
                src={img}
                alt={`Forecast ${i + 1}`}
                width={400}
                height={300}
                className="rounded-lg shadow"
              />
              <p className="text-sm mt-2 text-center text-gray-700">
                Forecasted Outflows {i + 1}
              </p>
            </div>
          ))}
        </div>

        {/* Prediction Form */}
        <div className="bg-white p-6 mt-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Make a Prediction
          </h2>

          <form
            onSubmit={handlePredict}
            className="flex flex-col md:flex-row gap-4 items-center"
          >
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full md:w-1/3"
              placeholder="Select a date"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
            >
              Predict Outflow
            </button>
          </form>

          {predictionResult && (
            <div className="mt-4 text-lg text-green-700 font-semibold">
              {predictionResult}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
