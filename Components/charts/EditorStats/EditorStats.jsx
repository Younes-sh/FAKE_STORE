'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import styles from '../style.module.css';

// کامپوننت Tooltip سفارشی برای نمایش انگلیسی
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip} style={{ 
        backgroundColor: '#fff', 
        padding: '10px', 
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontFamily: 'inherit'
      }}>
        <p><strong>{label}</strong></p>
        <p style={{ color: '#4f46e5' }}>{`Articles: ${payload[0].value}`}</p>
        <p style={{ color: '#10b981' }}>{`Reviews: ${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function EditorStats() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Sample data for demonstration
    const sampleData = [
      { name: 'Articles', articles: 24, reviews: 15 },
      { name: 'News', articles: 18, reviews: 12 },
      { name: 'Blog', articles: 10, reviews: 8 },
    ];
    
    setData(sampleData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Editor Statistics</h3>
        <div className={styles.chartWrapper}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%'
          }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Editor Statistics</h3>
        <div className={styles.chartWrapper}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%', 
            color: 'red' 
          }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Editor Statistics</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="articles" fill="#4f46e5" name="Articles" />
            <Bar dataKey="reviews" fill="#10b981" name="Reviews" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}