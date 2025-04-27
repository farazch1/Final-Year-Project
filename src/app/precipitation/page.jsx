"use client";
import React from 'react';
import Layout from "@/app/components/layout";
import { Bar, Line } from 'react-chartjs-2'; // Assuming you're using Chart.js for charts
import { Table, Card } from 'react-bootstrap'; // Import from react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is loaded

// Precipitation Data (Example Data)
const precipitationData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 150 },
  { month: 'Mar', value: 110 },
  { month: 'Apr', value: 80 },
  { month: 'May', value: 200 },
  { month: 'Jun', value: 180 },
  { month: 'Jul', value: 300 },
  { month: 'Aug', value: 250 },
  { month: 'Sep', value: 180 },
  { month: 'Oct', value: 220 },
  { month: 'Nov', value: 190 },
  { month: 'Dec', value: 160 },
];

// Calculate Total Precipitation
const totalPrecipitation = precipitationData.reduce((acc, curr) => acc + curr.value, 0);

// Bar chart for monthly precipitation
const barChartData = {
  labels: precipitationData.map(data => data.month),
  datasets: [
    {
      label: 'Monthly Precipitation (mm)',
      data: precipitationData.map(data => data.value),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
};

// Line chart for monthly trends
const lineChartData = {
  labels: precipitationData.map(data => data.month),
  datasets: [
    {
      label: 'Precipitation Trend (mm)',
      data: precipitationData.map(data => data.value),
      fill: false,
      backgroundColor: 'rgba(75, 192, 192, 1)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
    },
  ],
};

export default function PrecipitationPage() {
  return (
    <Layout>
      <h2>Precipitation Overview</h2>

      <Card className="mb-4">
        <Card.Body>
          <h4>Total Annual Precipitation</h4>
          <p><strong>{totalPrecipitation} mm</strong></p>
        </Card.Body>
      </Card>

      <h3>Precipitation Data Table</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Month</th>
            <th>Precipitation (mm)</th>
          </tr>
        </thead>
        <tbody>
          {precipitationData.map((data, index) => (
            <tr key={index}>
              <td>{data.month}</td>
              <td>{data.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Monthly Precipitation Trends</h3>
      <Bar data={barChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Monthly Precipitation (mm)' } } }} />

      <h3>Precipitation Trend Over the Year</h3>
      <Line data={lineChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Yearly Precipitation Trend (mm)' } } }} />

      <h3>Monthly Precipitation Summary</h3>
      <ul>
        <li><strong>Highest Precipitation:</strong> {Math.max(...precipitationData.map(data => data.value))} mm</li>
        <li><strong>Lowest Precipitation:</strong> {Math.min(...precipitationData.map(data => data.value))} mm</li>
        <li><strong>Average Precipitation:</strong> {(totalPrecipitation / precipitationData.length).toFixed(2)} mm</li>
      </ul>

      <h3>Recommendations / Insights</h3>
      <ul>
        <li><strong>Actionable Insight:</strong> The highest precipitation occurs in July, which might indicate monsoon season. Ensure proper drainage systems are in place for this period.</li>
        <li><strong>Strategy:</strong> Focus on water conservation during the months with lower precipitation (e.g., January-April).</li>
        <li><strong>Analysis:</strong> A significant decrease in precipitation from June to August should be considered for agricultural planning.</li>
      </ul>
    </Layout>
  );
}
