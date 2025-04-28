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
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!inputDate || !selectedReach) {
      alert("Please select both a date and a reservoir!");
      return;
    }
    setLoading(true);
    setPredictionResult(null);
    try {
      const res = await fetch("http://192.168.32.172:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: inputDate,
          reservoir: selectedReach,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { prediction } = await res.json();
      setPredictionResult(
        `Predicted outflow for ${selectedReach} on ${inputDate}: ${prediction}`
      );
    } catch (err) {
      setPredictionResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-xl font-bold mb-4">Predict Outflows & Inflows</h2>
            <form onSubmit={handlePredict} className="flex flex-col md:flex-row gap-4">
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="border p-2 rounded w-full md:w-1/3"
              />
              <select
                value={selectedReach}
                onChange={(e) => setSelectedReach(e.target.value)}
                className="border p-2 rounded w-full md:w-1/3"
              >
                <option value="">Select Reservoir</option>
                {["Tarbela","Chashma","Taunsa","Guddu","Sukkur","Kotri"].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded text-white shadow ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Predicting…
                  </span>
                ) : (
                  "Predict Outflow"
                )}
              </button>
            </form>

            {predictionResult && (
              <div className="mt-4 text-lg text-green-700 font-semibold">
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
