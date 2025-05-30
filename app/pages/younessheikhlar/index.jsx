import Style from './style.module.css';
import AdminLayout from '@/Components/Admin/AdminLayout/Layout';

export default function AdminPage() {
  return (
    <AdminLayout>

      <div className={Style.adminDashboard}>
        <h1 className={Style.dashboardTitle}>Admin Dashboard</h1>
        
        <div className={Style.statsGrid}>
          
        </div>
    
        {/* Other dashboard sections */}
      </div>
    </AdminLayout>
  );
}
