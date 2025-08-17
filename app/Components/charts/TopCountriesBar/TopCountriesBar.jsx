'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from '../style.module.css';

export default function TopCountriesBar({ top = 10 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/users/stats?type=countries&top=${top}`)
      .then(r => r.json())
      .then(d => setData(d.map(x => ({ name: x.country || 'Unknown', value: x.count }))))
      .catch(console.error);
  }, [top]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Top Countries</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
