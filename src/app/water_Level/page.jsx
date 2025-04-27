"use client";
import React from "react";
import Layout from "../components/layout";
import { Box, Typography, Paper, Grid } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function SensorDataDisplay() {
  // Replace this with real data from sensor API in the future
  const sensorReading = {
    date: "21-April-2025",
    time: "10:33:45 PM",
    waterLevel: "11 CM",
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#e0f7fa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 6,
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            width: "100%",
            maxWidth: 500,
            textAlign: "center",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#00796b", marginBottom: 4 }}
          >
            🌊 Live Water Level Monitor
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: "#f1f8e9",
                  borderRadius: "12px",
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <CalendarTodayIcon color="primary" />
                <Typography variant="h6">{sensorReading.date}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: "#fffde7",
                  borderRadius: "12px",
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <AccessTimeIcon color="secondary" />
                <Typography variant="h6">{sensorReading.time}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: "#e3f2fd",
                  borderRadius: "12px",
                  padding: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <WaterDropIcon color="info" sx={{ fontSize: 40 }} />
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {sensorReading.waterLevel}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  );
}
