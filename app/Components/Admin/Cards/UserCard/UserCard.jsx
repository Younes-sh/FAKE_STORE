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
    <Link href={`/aXdmiNPage/users/${_id}`} className={Style.link}>
      <div className={Style.userCard}>
        <div className={Style.userAvatar}>
          {/* {firstname.charAt(0)}{lastname.charAt(0)} */}
          <img
            src={`https://ui-avatars.com/api/?name=${firstname}+${lastname}&background=random&size=128`}
            alt={`${firstname} ${lastname}`}
            className={Style.avatarImage}
          />
        </div>
        <div className={Style.userInfo}>
          <h3 className={Style.userName}>{firstname} {lastname}</h3>
          <p className={Style.userRole}>{role}</p>
          <p className={Style.userEmail}>{email}</p>
        </div>
      </div>
    </Link>
  )
}