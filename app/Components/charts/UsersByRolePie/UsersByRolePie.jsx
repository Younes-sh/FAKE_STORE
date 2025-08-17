'use client';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import styles from '../style.module.css';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function UsersByRolePie() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/users/stats?type=roles')
      .then(r => r.json())
      .then(d => setData(d.map(x => ({ name: x.role, value: x.count }))))
      .catch(console.error);
  }, []);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Users by Role</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} innerRadius={60}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend className={styles.legend}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
