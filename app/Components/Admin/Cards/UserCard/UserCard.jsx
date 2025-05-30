import Style from './userCard.module.css';
import Link from 'next/link';

export default function UserCard({
  _id,
  firstname,
  lastname,
  username,
  email,
  phone,
  address,
  role,
}) {
  return (
    <Link href={`/younessheikhlar/users/${_id}`} className={Style.link}>
      <div className={Style.userCard}>
        <p>firstname: {firstname}</p>
        <p>lastname: {lastname}</p>
        <p>username: {username}</p>
        <p>email: {email}</p>
        <p>phone: {phone}</p>
        <p>address: {address}</p>
        <p>role: {role}</p>
      </div>
    </Link>
  )
}
