import React ,{useState, useEffect} from 'react';
import AdminLayout from "@/Components/Admin/AdminLayout/Layout";
import UserCard from '@/Components/Admin/Cards/UserCard/UserCard';
import Style from './style.module.css';

export default function index({ userData}) {

  
  return (
    <AdminLayout className="Container">
      <h1>User</h1>
      <p>This is the User page</p>
      <br/>
      <hr/>

      <div className={Style.row}>
        {userData.map(user => (
          <div className='col' key={user}>
            <UserCard {...user} />
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}


export async function getServerSideProps () {
  const res = await fetch('http://localhost:3000/api/user');
  const data = await res.json();
  return {
    props: { userData: data.users}
  }
}
