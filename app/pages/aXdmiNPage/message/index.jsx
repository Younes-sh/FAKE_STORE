import React from 'react';
import MessageCard from '@/Components/Admin/Cards/MessageCard/MessageCard';
import AdminLayout from '@/Components/Admin/AdminLayout/Layout';

function message() {
  return (
    <AdminLayout>
      <div className='main'>
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
      </div>
    </AdminLayout>
  )
}

export default message