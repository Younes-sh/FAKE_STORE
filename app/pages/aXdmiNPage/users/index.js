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
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !["admin", "editor"].includes(session.user.role)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // استفاده از آدرس کامل برای API
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    const res = await fetch(`${baseUrl}/api/users`);
    
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    
    const data = await res.json();

    return {
      props: { 
        userData: data.users ?? [],
        session
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    
    return {
      props: { 
        userData: [],
        session,
        error: error.message
      },
    };
  }
}