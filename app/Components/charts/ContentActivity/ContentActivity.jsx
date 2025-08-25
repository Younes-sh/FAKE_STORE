'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
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
        <p><strong>Date: {label}</strong></p>
        <p style={{ color: '#4f46e5' }}>{`Published: ${payload[0].value}`}</p>
        <p style={{ color: '#10b981' }}>{`Draft: ${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function ContentActivity() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Sample data for demonstration
    const activityData = [
      { date: '2025/01/01', published: 5, draft: 2 },
      { date: '2025/01/02', published: 3, draft: 4 },
      { date: '2025/01/03', published: 7, draft: 1 },
      { date: '2025/01/04', published: 2, draft: 3 },
      { date: '2025/01/05', published: 6, draft: 2 },
    ];
    
    setData(activityData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Content Activity</h3>
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
        <h3 className={styles.title}>Content Activity</h3>
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
      <h3 className={styles.title}>Content Activity</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="published" stroke="#4f46e5" name="Published" />
            <Line type="monotone" dataKey="draft" stroke="#10b981" name="Draft" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}