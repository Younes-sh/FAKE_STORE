import { useRouter } from "next/router";
import AdminNavbar from "@/Components/Admin/AdminLayout/Layout";
import Style from './singleUser.module.css';

export default function User({ dataUser }) {
  return (
    <AdminNavbar>
      <div className="main">
        <h1>User</h1>
        <div className={Style.infoContainer}>
          <p><b>firstname:</b> {dataUser.firstname}</p>
          <p><b>lastname:</b> {dataUser.lastname}</p>
          <p><b>username:</b> {dataUser.username}</p>
          <p><b>email:</b> {dataUser.email}</p>
          <p><b>phone:</b> {dataUser.phone}</p>
          <p><b>address:</b> {dataUser.address}</p>
          <p><b>role:</b> {dataUser.role}</p>
        </div>
        <br/>
        <p><b>Created Account:</b> {dataUser.createdAt}</p>

      </div>
    </AdminNavbar>
  );
}


const baseURL = process.env.NEXTAUTH_URL;

export async function getServerSideProps(context) {
  const { _id } = context.params;

  const res = await fetch(`${baseURL}/api/user/${_id}`);
  const data = await res.json();


 
  return {
    props: { dataUser: data.data }
  };
}
