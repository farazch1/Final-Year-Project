"use client";
import React, { useState } from "react";
import Layout from "../components/layout";
import { Box, Typography, Grid, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Button, MenuItem } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

// Sample temperature data for the charts
const sampleData = [
  { name: "January", Tmax: 35, Tmin: 10, Tmean: 22 },
  { name: "February", Tmax: 38, Tmin: 12, Tmean: 25 },
  { name: "March", Tmax: 40, Tmin: 15, Tmean: 28 },
  { name: "April", Tmax: 45, Tmin: 20, Tmean: 32 },
  { name: "May", Tmax: 48, Tmin: 25, Tmean: 36 },
  { name: "June", Tmax: 50, Tmin: 28, Tmean: 39 },
  { name: "July", Tmax: 47, Tmin: 27, Tmean: 37 },
];

export default function TemperaturePage() {
  const [plotType, setPlotType] = useState("BarChart");
  const [factor, setFactor] = useState("Tmax");
  const [selectedData, setSelectedData] = useState(sampleData);

  const handlePlotTypeChange = (event) => {
    setPlotType(event.target.value);
  };

  const handleFactorChange = (event) => {
    setFactor(event.target.value);
  };

  const handleView = () => {
    // Logic for filtering data or updating chart based on inputs can go here
    console.log("Viewing data...");
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Temperature Plotting
        </Typography>
        <Grid container spacing={3}>
          {/* Input Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
              <FormControl fullWidth margin="normal">
                <TextField label="Catchment" select>
                  <MenuItem value="Region1">Region 1</MenuItem>
                  <MenuItem value="Region2">Region 2</MenuItem>
                </TextField>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField label="From Date" type="date" InputLabelProps={{ shrink: true }} />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField label="To Date" type="date" InputLabelProps={{ shrink: true }} />
              </FormControl>
              <FormControl component="fieldset" margin="normal">
                <Typography>Plotting Factor:</Typography>
                <RadioGroup value={factor} onChange={handleFactorChange} row>
                  <FormControlLabel value="Tmax" control={<Radio />} label="Tmax" />
                  <FormControlLabel value="Tmin" control={<Radio />} label="Tmin" />
                  <FormControlLabel value="Tmean" control={<Radio />} label="Tmean" />
                </RadioGroup>
              </FormControl>
              <FormControl component="fieldset" margin="normal">
                <Typography>Plot Type:</Typography>
                <RadioGroup value={plotType} onChange={handlePlotTypeChange} row>
                  <FormControlLabel value="BarChart" control={<Radio />} label="Bar Chart" />
                  <FormControlLabel value="LineChart" control={<Radio />} label="Line Chart" />
                </RadioGroup>
              </FormControl>
              <Button variant="contained" color="primary" fullWidth onClick={handleView}>
                View
              </Button>
            </Box>
          </Grid>

          {/* Chart Section */}
          <Grid item xs={12} md={8}>
            {plotType === "BarChart" ? (
              <BarChart width={600} height={300} data={selectedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={factor} fill="#8884d8" />
              </BarChart>
            ) : (
              <LineChart width={600} height={300} data={selectedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={factor} stroke="#8884d8" />
              </LineChart>
            )}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
