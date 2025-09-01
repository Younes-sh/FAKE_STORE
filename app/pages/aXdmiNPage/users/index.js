// pages/admin/users.js
import React from 'react';
import AdminLayout from "@/Components/Admin/AdminLayout/Layout";
import UserCard from '@/Components/Admin/Cards/UserCard/UserCard';
import Style from './style.module.css';
import { useSession, getSession } from "next-auth/react";

export default function UserDataPage({ userData, session: ssrSession }) {
  const { data: session, status } = useSession({
    required: true,
    initialData: ssrSession,
  });

  if (status === "loading") return <p>Loading...</p>;

  return (
    <AdminLayout className="Container">
      <h1>Users</h1>
      <div className={Style.row}>
        {userData.map(user => (
          <div className='col' key={user._id}>
            <UserCard {...user} currentUserRole={session?.user?.role} />
          </div>
        ))}
      </div>
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
    
    const response = await fetch(`${baseUrl}/api/users`);
    
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