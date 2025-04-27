"use client";
import React, { useState, useRef } from "react";
import Layout from "../components/layout";
import Image from "next/image";
import ForecastChart1 from "./3.png";
import ForecastChart2 from "./2.png";
import ForecastChart3 from "./1.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function MLPrediction() {
  const [inputDate, setInputDate] = useState("");
  const [selectedReach, setSelectedReach] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);
  const reportRef = useRef();

  const handlePredict = (e) => {
    e.preventDefault();

    if (!inputDate || !selectedReach) {
      alert("Please select both a date and a reach!");
      return;
    }

    const fakePrediction = 83200; // Simulated value
    const resultText = `Predicted Flow for ${selectedReach.replaceAll(
      "_",
      " "
    )} on ${inputDate}: ${fakePrediction}`;
    setPredictionResult(resultText);
  };

  const generatePDFReport = async () => {
    const input = reportRef.current;

    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ML_Prediction_Report_${Date.now()}.pdf`);
  };

  return (
    <Layout>
      <div className="p-4 bg-gray-100 min-h-screen">
        <div ref={reportRef}>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            ML-Based Tarbela Outflow Forecasting
          </h1>

          {/* Forecast Charts */}
          <div className="flex overflow-x-auto space-x-6 mb-6">
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Predicting Outflows and Inflows
            </h2>

            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full md:w-1/3"
              />

              <select
                value={selectedReach}
                onChange={(e) => setSelectedReach(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full md:w-1/3"
              >
                <option value="">Select Reservoir</option>
                <option value="Tarbela">Tarbela</option>
                <option value="Chashma">Chashma</option>
                <option value="Taunsa">Taunsa</option>
                <option value="Guddu">Guddu</option>
                <option value="Sukkur">Sukkur</option>
                <option value="Kotri">Kotri</option>
              </select>

              <button
                onClick={handlePredict}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
              >
                Predict Outflow
              </button>
            </div>

            {predictionResult && (
              <div className="text-lg text-green-700 font-semibold mb-4">
                {predictionResult}
              </div>
            )}
          </div>
        </div>

        {/* Generate PDF Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={generatePDFReport}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow"
          >
            Generate PDF Report
          </button>
        </div>
      </div>
    </Layout>
  );
}
