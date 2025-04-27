"use client";
import * as React from "react";
import Layout from "../components/layout";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button } from '@mui/material';
import Image from 'next/image';
import LineImage from './Line.jpg'; // Import the image

export default function SchmeticPage() {
  const [scale, setScale] = React.useState(1); // Image zoom scale
  const [isFitToViewer, setIsFitToViewer] = React.useState(false); // Whether the image is fitted to the viewer

  // Define relevant table data based on the image
  const tableData = [
    { location: "Skardu", height: "10,800 ft", flow: "-" },
    { location: "Bunji", height: "21,000 ft", flow: "-" },
    { location: "Bisham", height: "31,800 ft", flow: "-" },
    { location: "Tarbela Reservoir", height: "1,515.44 ft", flow: "55,000 cusecs" },
    { location: "Chashma Reservoir", height: "72,450 cusecs", flow: "63,000 cusecs" },
    { location: "Mangla Reservoir", height: "1,174.40 ft", flow: "32,000 cusecs" },
    { location: "Marala Barrage", height: "-", flow: "27,813 cusecs" },
    { location: "Kalabagh Barrage", height: "-", flow: "57,226 cusecs" },
  ];

  const handleZoomIn = () => {
    setScale(prevScale => prevScale * 1.2); // Zoom in by 20%
  };

  const handleZoomOut = () => {
    setScale(prevScale => prevScale / 1.2); // Zoom out by 20%
  };

  const handleFitToViewer = () => {
    setIsFitToViewer(true); // Fit image to the viewer
    setScale(1); // Reset scale to default
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Rivers & Canals Discharges</Typography>
        
        {/* Grid layout for side-by-side content */}
        <Grid container spacing={4}>
          {/* Left side: Image with buttons */}
          <Grid item xs={12} md={6}>
            {/* Buttons for zoom and fit */}
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" onClick={handleZoomIn} sx={{ mr: 2 }}>
                Zoom In
              </Button>
              <Button variant="contained" onClick={handleZoomOut} sx={{ mr: 2 }}>
                Zoom Out
              </Button>
              <Button variant="contained" onClick={handleFitToViewer}>
                Fit to Viewer
              </Button>
            </Box>

            {/* Display the image with dynamic scaling */}
            <Box
              sx={{
                width: '100%',
                height: isFitToViewer ? 'auto' : '500px', // Adjust height if Fit to Viewer is enabled
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Image
                src={LineImage}
                alt="Schematic Diagram"
                width={500 * scale} // Adjust width based on scale
                height={500 * scale} // Adjust height based on scale
                layout="intrinsic"
              />
            </Box>
          </Grid>

          {/* Right side: Table */}
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{
                        backgroundColor: '#1976d2', // Blue background for header
                        color: 'white', // White text color
                        fontWeight: 'bold',
                        textAlign: 'center', // Center-align text
                        padding: '12px', // Padding for better spacing
                      }}
                    >
                      <b>Location</b>
                    </TableCell>
                    <TableCell 
                      sx={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: '12px',
                      }}
                    >
                      <b>Height</b>
                    </TableCell>
                    <TableCell 
                      sx={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: '12px',
                      }}
                    >
                      <b>Flow (cusecs)</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: 'center', padding: '12px' }}>
                        {row.location}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', padding: '12px' }}>
                        {row.height}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', padding: '12px' }}>
                        {row.flow}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
