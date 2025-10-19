// src/Analytics.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './App.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Analytics() {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [error, setError] = useState('');

    // Detect dark mode to set text color for charts
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const chartTextColor = isDarkMode ? '#e4e6eb' : '#1c1e21';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/analytics');
                setAnalyticsData(response.data);
            } catch (err) {
                setError('Failed to fetch analytics data.');
            }
        };
        fetchData();
    }, []);

    if (error) return <div className="error-alert">{error}</div>;
    if (!analyticsData) return <div className="container"><h1>Loading Analytics...</h1></div>;

    const barData = {
        labels: analyticsData.top_brands.map(item => item.brand),
        datasets: [{
            label: 'Top 10 Brands by Product Count',
            data: analyticsData.top_brands.map(item => item.count),
            backgroundColor: 'rgba(45, 136, 255, 0.6)',
        }]
    };

    const pieData = {
        labels: analyticsData.popular_categories.map(item => item.category),
        datasets: [{
            label: 'Product Count by Category',
            data: analyticsData.popular_categories.map(item => item.count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        }]
    };

    // --- CHART OPTIONS TO FIX STYLING ---
    const chartOptions = {
        plugins: {
            legend: { labels: { color: chartTextColor, font: { size: 14 } } }
        },
        scales: {
            y: {
                ticks: { color: chartTextColor, font: { size: 12 } },
                grid: { color: isDarkMode ? '#444' : '#ddd' }
            },
            x: {
                ticks: { color: chartTextColor, font: { size: 12 } },
                grid: { color: isDarkMode ? '#444' : '#ddd' }
            }
        }
    };

    return (
        <div className="container">
            <h1>Product Analytics</h1>
            <a href="/" style={{ marginBottom: '2rem', display: 'block', color: 'var(--primary-color)' }}>
                Back to Recommender
            </a>
            <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
                <h2>Top Brands</h2>
                <Bar data={barData} options={chartOptions} />
            </div>
            <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
                <h2>Popular Categories</h2>
                <Pie data={pieData} options={{ plugins: { legend: { labels: { color: chartTextColor } } } }} />
            </div>
        </div>
    );
}

export default Analytics;