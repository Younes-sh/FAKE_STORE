import { useRouter } from "next/router";
import { useState } from "react";
import AdminNavbar from "@/Components/Admin/AdminLayout/Layout";
import { AlertModal } from "@/Components/AlertModal/AlertModal";
import Style from './singleUser.module.css';

export default function User({ dataUser }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Format the createdAt date
  const formattedDate = new Date(dataUser.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/user/${dataUser._id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        router.push(`/aXdmiNPage/users`);
      } else {
        console.error('Failed to delete user');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setIsDeleting(false);
    }
  };

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

          {/* دکمه حذف کاربر */}
          <button 
            className={Style.deleteButton}
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>

      {/* مودال تأیید حذف با استفاده از AlertModal */}
      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={`Delete ${dataUser.firstname} ${dataUser.lastname}?`}
        message={
          <>
            Are you sure you want to permanently delete this user account?
            <br />
            <strong>This action cannot be undone!</strong>
          </>
        }
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        onConfirm={handleDeleteUser}
        type="error"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        }
      />
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