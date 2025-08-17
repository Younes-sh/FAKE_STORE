'use client';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import styles from '../style.module.css';

export default function UserMonthlyGrowth({ months = 12 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/users/stats?type=monthly&months=${months}`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, [months]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>User Signups (Last {months} months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
