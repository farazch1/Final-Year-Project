"use client";
import React from 'react';
import Layout from "../../components/layout"; // Corrected and unique import
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Sample data for the charts
const barChartData = [
  { name: 'January', value: 4000 },
  { name: 'February', value: 3000 },
  { name: 'March', value: 2000 },
  { name: 'April', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'June', value: 2390 },
  { name: 'July', value: 3490 },
];

const pieChartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function PieChartPage() {
  return (
    <Layout>
      <h2>Monthly Data Overview</h2><br />
      <BarChart
        width={600}
        height={300}
        data={barChartData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>

      <h2>Distribution of Groups</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={pieChartData}
          cx={200}
          cy={200}
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <h2>Insights and Recommendations</h2>
      <ul>
        <li><strong>Monthly Trends:</strong> The bar chart indicates a steady increase in metrics from January to July, with a peak in July. Consider exploring the factors that contributed to this growth.</li>
        <li><strong>Group Distribution:</strong> The pie chart shows that Group A holds the largest share. Assess the performance of this group and identify potential areas for optimization.</li>
        <li><strong>Actionable Insights:</strong> Use this data to guide your strategy. Focus on enhancing the strengths of your top-performing metrics and addressing any weaknesses highlighted by the charts.</li>
      </ul>
    </Layout>
  );
}
