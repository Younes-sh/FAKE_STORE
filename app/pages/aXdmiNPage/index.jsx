import style from './style.module.css';
import AdminLayout from '@/Components/Admin/AdminLayout/Layout';
import dynamic from 'next/dynamic';

// حتماً ssr:false تا در رندر سمت سرور گیر نده
const UserMonthlyGrowth = dynamic(() => import('@/components/charts/UserMonthlyGrowth/UserMonthlyGrowth'), { ssr: false });
const UsersByRolePie   = dynamic(() => import('@/components/charts/UsersByRolePie/UsersByRolePie'), { ssr: false });
const ActiveUsersPie   = dynamic(() => import('@/components/charts/ActiveUsersPie/ActiveUsersPie'), { ssr: false });
const TopCountriesBar  = dynamic(() => import('@/components/charts/TopCountriesBar/TopCountriesBar'), { ssr: false });



export default function AdminPage() {
  return (
    <AdminLayout>

      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Admin Dashboard</h1>

        {/* کارت 1: رشد ماهانه */}
        <UserMonthlyGrowth months={12} />

        {/* گرید برای سه چارت بعدی */}
        <div className={style.grid3}>
          {/* Users by Role */}
          <UsersByRolePie />

          {/* Active vs Inactive */}
          <ActiveUsersPie />

          {/* Top Countries */}
          <TopCountriesBar top={8} />
        </div>
      </div>
    </AdminLayout>
  );
}
