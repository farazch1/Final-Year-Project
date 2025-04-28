"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function SensorDataDisplay() {
  const [sensorReading, setSensorReading] = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchReading() {
      try {
        const res = await fetch("http://192.168.32.172:3005/water-level");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setSensorReading(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    // initial fetch
    fetchReading();

    // then poll every 2 seconds
    const interval = setInterval(fetchReading, 2000);

    // cleanup on unmount
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    </Layout>
  );
  if (error)   return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading data: {error.message}
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-teal-50 flex justify-center items-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-teal-700 mb-6">
            🌊 Live Water Level Monitor
          </h1>
          <div className="space-y-4">
            {/* Date */}
            <div className="flex items-center justify-center gap-2 bg-green-100 rounded-lg p-4">
              <CalendarTodayIcon className="text-green-600" fontSize="large" />
              <span className="text-lg font-medium">{sensorReading.date}</span>
            </div>
            {/* Time */}
            <div className="flex items-center justify-center gap-2 bg-yellow-100 rounded-lg p-4">
              <AccessTimeIcon className="text-yellow-600" fontSize="large" />
              <span className="text-lg font-medium">{sensorReading.time}</span>
            </div>
            {/* Water Level */}
            <div className="flex items-center justify-center gap-4 bg-blue-100 rounded-lg p-6">
              <WaterDropIcon className="text-blue-500" sx={{ fontSize: 40 }} />
              <span className="text-4xl font-bold">{sensorReading.waterLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
