import { useRouter } from "next/router";
import AdminNavbar from "@/Components/Admin/AdminLayout/Layout";
import Style from './singleUser.module.css';

export default function User({ dataUser }) {

  const router = useRouter();
  // Format the createdAt date
  const formattedDate = new Date(dataUser.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <AdminNavbar>
      <div className={Style.mainContainer}>
        <div className={Style.header}>
          <h1 className={Style.title}>User Profile</h1>
          <div className={Style.userStatus}>
            <span className={`${Style.statusBadge} ${dataUser.isActive ? Style.active : Style.inactive}`}>
              {dataUser.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className={Style.roleBadge}>{dataUser.role}</span>
            <span className={Style.backLink}
              onClick={() => router.back(`${process.env.URL}/aXdmiNPage/users`)}
            >Back to Users</span>
          </div>
        </div>

        <div className={Style.profileContainer}>
          <div className={Style.profileHeader}>
            <div className={Style.avatar}>
              {dataUser.lastname && dataUser.firstname && (
                <>
                  {dataUser.firstname.charAt(0)}{dataUser.lastname.charAt(0)}
                </>
              )}
            </div>
            <div className={Style.userMainInfo}>
              <h2 className={Style.userName}>{dataUser.firstname} {dataUser.lastname}</h2>
              <p className={Style.userEmail}>{dataUser.email}</p>
            </div>
          </div>

          <div className={Style.detailsGrid}>
            <div className={Style.detailSection}>
              <h3 className={Style.sectionTitle}>Personal Information</h3>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Username:</span>
                <span className={Style.detailValue}>{dataUser.username}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Phone:</span>
                <span className={Style.detailValue}>{dataUser.phone}</span>
              </div>
            </div>

            <div className={Style.detailSection}>
              <h3 className={Style.sectionTitle}>Address</h3>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Street:</span>
                <span className={Style.detailValue}>{dataUser.address.street}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>City:</span>
                <span className={Style.detailValue}>{dataUser.address.city}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Postal Code:</span>
                <span className={Style.detailValue}>{dataUser.address.postalCode}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Country:</span>
                <span className={Style.detailValue}>{dataUser.address.country}</span>
              </div>
            </div>

            <div className={Style.detailSection}>
              <h3 className={Style.sectionTitle}>Account Information</h3>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Account Created:</span>
                <span className={Style.detailValue}>{formattedDate}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Last Updated:</span>
                <span className={Style.detailValue}>
                  {new Date(dataUser.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>User ID:</span>
                <span className={Style.detailValue}>{dataUser._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminNavbar>
  );
}


export async function getServerSideProps(context) {
  const { _id } = context.params;

  const res = await fetch(`${process.env.URL}/api/user/${_id}`);
  const data = await res.json();

  return {
    props: { dataUser: data.data }
  };
}