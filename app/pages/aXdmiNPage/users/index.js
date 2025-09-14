// pages/admin/users.js
import React, { useState } from 'react';
import AdminLayout from "@/Components/Admin/AdminLayout/Layout";
import UserCard from '@/Components/Admin/Cards/UserCard/UserCard';
import Style from './style.module.css';
import { useSession, getSession } from "next-auth/react";

export default function UserDataPage({ userData, session: ssrSession }) {
  const { data: session, status } = useSession({
    required: true,
    initialData: ssrSession,
  });
  const [filterRole, setFilterRole] = useState('all');

  if (status === "loading") return <p>Loading...</p>;

  // فیلتر کردن کاربران بر اساس نقش
  const filteredUsers = filterRole === 'all' 
    ? userData 
    : userData.filter(user => user.role === filterRole);

  return (
    <AdminLayout className="Container">
      <div className={Style.header}>
        <h1>Users Management</h1>
        
        {/* فیلتر بر اساس نقش */}
        <div className={Style.filterSection}>
          <label htmlFor="roleFilter">Filter by Role: </label>
          <select 
            id="roleFilter"
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className={Style.filterSelect}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="user">User</option>
          </select>
          
          <span className={Style.resultCount}>
            Showing {filteredUsers.length} of {userData.length} users
          </span>
        </div>
      </div>

      <div className={Style.row}>
        {filteredUsers.map(user => (
          <div className='col' key={user._id}>
            <UserCard {...user} currentUserRole={session?.user?.role} />
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className={Style.noResults}>
          <p>No users found with the selected role.</p>
        </div>
      )}
    </AdminLayout>
  );
}

// 🔐 چک کردن نقش در سمت سرور
export async function getServerSideProps({ req, res }) {
  try {
    // ابتدا session را بررسی کنید
    const session = await getSession({ req });
    
    if (!session || !["admin", "editor"].includes(session.user.role)) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    // سپس داده‌ها را fetch کنید
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const response = await fetch(`${baseUrl}/api/user`);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      props: { 
        userData: data.users || [],
        session // session را هم به props پاس دهید
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    return {
      props: { 
        userData: [],
        error: error.message
      }
    };
  }
}