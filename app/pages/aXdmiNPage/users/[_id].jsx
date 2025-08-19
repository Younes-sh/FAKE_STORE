import { useRouter } from "next/router";
import { useState } from "react";
import AdminNavbar from "@/Components/Admin/AdminLayout/Layout";
import { AlertModal } from "@/Components/AlertModal/AlertModal";
import Style from './singleUser.module.css';

export default function User({ dataUser }) {
  const router = useRouter();

  // ایمن‌سازی state اولیه
  const safeAddress = dataUser?.address ?? { street: '', city: '', postalCode: '', country: '' };
  const [userData, setUserData] = useState({
    ...dataUser,
    address: safeAddress,
    firstname: dataUser?.firstname ?? '',
    lastname: dataUser?.lastname ?? '',
    username: dataUser?.username ?? '',
    phone: dataUser?.phone ?? '',
    role: dataUser?.role ?? 'user',
    isActive: dataUser?.isActive ?? false,
  });

  const [selectedRole, setSelectedRole] = useState(userData.role);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const formattedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : '—';

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/user/${userData._id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete user');
      router.push('/aXdmiNPage/users');
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  };

  const handleBlockUser = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/user/${userData._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !userData.isActive })
      });
      if (!response.ok) throw new Error('Failed to update user status');
      const updatedUser = await response.json();
      setUserData(prev => ({ ...prev, ...updatedUser.data, address: updatedUser.data?.address ?? safeAddress }));
      setShowBlockModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoleChange = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/user/${userData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole })
      });
      if (!response.ok) throw new Error('Failed to update role');
      const updatedUser = await response.json();
      setUserData(prev => ({ ...prev, ...updatedUser.data, address: updatedUser.data?.address ?? safeAddress }));
      setShowRoleModal(false);
    } catch (e) {
      console.error(e);
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
            <span className={Style.backLink} onClick={() => router.push('/aXdmiNPage/users')}>
              Back to Users
            </span>
          </div>
        </div>

        <div className={Style.profileContainer}>
          <div className={Style.profileHeader}>
            <div className={Style.avatar}>
              {(userData?.firstname && userData?.lastname) ? (
                <>
                  {userData.firstname.charAt(0)}{userData.lastname.charAt(0)}
                </>
              ) : '—'}
            </div>
            <div className={Style.userMainInfo}>
              <h2 className={Style.userName}>
                {(userData?.firstname ?? '') + ' ' + (userData?.lastname ?? '')}
              </h2>
              <p className={Style.userEmail}>{userData?.email ?? '—'}</p>
            </div>
          </div>

          <div className={Style.detailsGrid}>
            <div className={Style.detailSection}>
              <h3 className={Style.sectionTitle}>Personal Information</h3>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Username:</span>
                <span className={Style.detailValue}>{userData?.username ?? '—'}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Phone:</span>
                <span className={Style.detailValue}>{userData?.phone ?? '—'}</span>
              </div>
            </div>

            <div className={Style.detailSection}>
              <h3 className={Style.sectionTitle}>Address</h3>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Street:</span>
                <span className={Style.detailValue}>{userData?.address?.street ?? '—'}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>City:</span>
                <span className={Style.detailValue}>{userData?.address?.city ?? '—'}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Postal Code:</span>
                <span className={Style.detailValue}>{userData?.address?.postalCode ?? '—'}</span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>Country:</span>
                <span className={Style.detailValue}>{userData?.address?.country ?? '—'}</span>
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
                  {userData?.updatedAt
                    ? new Date(userData.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : '—'}
                </span>
              </div>
              <div className={Style.detailItem}>
                <span className={Style.detailLabel}>User ID:</span>
                <span className={Style.detailValue}>{userData?._id ?? '—'}</span>
              </div>
            </div>
          </div>

          <div className={Style.actionButtons}>
            <button className={Style.changeRoleButton} onClick={() => setShowRoleModal(true)} disabled={isUpdating}>
              Change Role
            </button>

            <button
              className={`${Style.blockButton} ${!userData.isActive ? Style.unblockButton : ''}`}
              onClick={() => setShowBlockModal(true)}
              disabled={isUpdating}
            >
              {userData.isActive ? 'Block User' : 'Unblock User'}
            </button>

            <button className={Style.deleteButton} onClick={() => setShowDeleteModal(true)} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>

      </div>

      {/* Delete User Modal */}
      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={`Delete ${(userData?.firstname ?? '')} ${(userData?.lastname ?? '')}?`}
        message={<>Are you sure you want to permanently delete this user account?<br /><strong>This action cannot be undone!</strong></>}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        onConfirm={handleDeleteUser}
        type="error"
      />

      {/* Block User Modal */}
      <AlertModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title={`${userData.isActive ? 'Block' : 'Unblock'} ${(userData?.firstname ?? '')} ${(userData?.lastname ?? '')}?`}
        message={
          <>
            Are you sure you want to {userData.isActive ? 'block' : 'unblock'} this user account?
            <br />
            {userData.isActive ? <strong>Blocked users cannot access the system!</strong> : <strong>User will regain access to the system!</strong>}
          </>
        }
        confirmText={isUpdating ? 'Processing...' : userData.isActive ? 'Block' : 'Unblock'}
        cancelText="Cancel"
        onConfirm={handleBlockUser}
        type="warning"
      />

      {/* Change Role Modal */}
      <AlertModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title={`Change Role for ${(userData?.firstname ?? '')} ${(userData?.lastname ?? '')}`}
        message={
          <div className={Style.roleSelection}>
            <label>Select new role:</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className={Style.roleSelect}>
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
      />
    </AdminNavbar>
  );
}

export async function getServerSideProps(context) {
  const { _id } = context.params;

  try {
    const base = process.env.URL ?? 'http://localhost:3000'; // اگر در dev هستید
    const res = await fetch(`${base}/api/user/${_id}`);
    if (!res.ok) {
      return { notFound: true };
    }
    const data = await res.json();
    return { props: { dataUser: data?.data ?? null } };
  } catch (e) {
    console.error('GSSP user fetch error:', e);
    return { notFound: true };
  }
}
