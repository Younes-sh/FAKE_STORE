import { useRouter } from "next/router";
import { useState } from "react";
import AdminNavbar from "@/Components/Admin/AdminLayout/Layout";
import { AlertModal } from "@/Components/AlertModal/AlertModal";
import Style from './singleUser.module.css';

export default function User({ dataUser }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(dataUser.role);
  const [userData, setUserData] = useState(dataUser);

  // Format the createdAt date
  const formattedDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/user/${userData._id}`, {
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

  const handleBlockUser = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/user/${userData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !userData.isActive
        })
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser.data);
        setShowBlockModal(false);
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoleChange = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/user/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedRole
        })
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser.data);
        setShowRoleModal(false);
      } else {
        console.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminNavbar>
      <div className={Style.mainContainer}>
        <div className={Style.header}>
          <h1 className={Style.title}>User Profile</h1>
          <div className={Style.userStatus}>
            <span className={`${Style.statusBadge} ${userData.isActive ? Style.active : Style.inactive}`}>
              {userData.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className={Style.roleBadge}>{userData.role}</span>
            <span className={Style.backLink}
              onClick={() => router.back(`${process.env.URL}/aXdmiNPage/users`)}
            >Back to Users</span>
          </div>
        </div>

        <div className={Style.profileContainer}>
          <div className={Style.profileHeader}>
            <div className={Style.avatar}>
              {userData.lastname && userData.firstname && (
                <>
                  {userData.firstname.charAt(0)}{userData.lastname.charAt(0)}
                </>
              )}
            </div>
            <div className={Style.userMainInfo}>
              <h2 className={Style.userName}>{userData.firstname} {userData.lastname}</h2>
              <p className={Style.userEmail}>{userData.email}</p>
            </div>
          </div>

          <div className={Style.detailsGrid}>
            <div className={Style.detailSection}>
              <h3 className={Style.sectionTitle}>Personal Information</h3>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Username:</span>
                <span className={Style.detailValue}>{userData.username}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Phone:</span>
                <span className={Style.detailValue}>{userData.phone}</span>
              </div>
            </div>

            <div className={Style.detailSection}>
              <h3 className={Style.sectionTitle}>Address</h3>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Street:</span>
                <span className={Style.detailValue}>{userData.address.street}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>City:</span>
                <span className={Style.detailValue}>{userData.address.city}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Postal Code:</span>
                <span className={Style.detailValue}>{userData.address.postalCode}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Country:</span>
                <span className={Style.detailValue}>{userData.address.country}</span>
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
                  {new Date(userData.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>User ID:</span>
                <span className={Style.detailValue}>{userData._id}</span>
              </div>
            </div>
          </div>

          <div className={Style.actionButtons}>
            <button 
              className={Style.changeRoleButton}
              onClick={() => setShowRoleModal(true)}
              disabled={isUpdating}
            >
              Change Role
            </button>

            <button 
              className={`${Style.blockButton} ${!userData.isActive ? Style.unblockButton : ''}`}
              onClick={() => setShowBlockModal(true)}
              disabled={isUpdating}
            >
              {userData.isActive ? 'Block User' : 'Unblock User'}
            </button>

            <button 
              className={Style.deleteButton}
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete User Modal */}
      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={`Delete ${userData.firstname} ${userData.lastname}?`}
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />

      {/* Block User Modal */}
      <AlertModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title={`${userData.isActive ? 'Block' : 'Unblock'} ${userData.firstname} ${userData.lastname}?`}
        message={
          <>
            Are you sure you want to {userData.isActive ? 'block' : 'unblock'} this user account?
            <br />
            {userData.isActive ? (
              <strong>Blocked users cannot access the system!</strong>
            ) : (
              <strong>User will regain access to the system!</strong>
            )}
          </>
        }
        confirmText={isUpdating ? 'Processing...' : userData.isActive ? 'Block' : 'Unblock'}
        cancelText="Cancel"
        onConfirm={handleBlockUser}
        type="warning"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      {/* Change Role Modal */}
      <AlertModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title={`Change Role for ${userData.firstname} ${userData.lastname}`}
        message={
          <div className={Style.roleSelection}>
            <label>Select new role:</label>
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={Style.roleSelect}
            >
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        }
        confirmText={isUpdating ? 'Updating...' : 'Update Role'}
        cancelText="Cancel"
        onConfirm={handleRoleChange}
        type="info"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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