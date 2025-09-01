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
        destination: "/", // یا هر صفحه دیگه
        permanent: false,
      },
    };
  }


  const res = await fetch("/api/user");
  const data = await res.json();

  return {
    props: { 
      userData: data.users ?? [],
      session // پاس دادن session به front-end
    },
  };
}
