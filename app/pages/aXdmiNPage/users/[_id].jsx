import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import AdminNavbar from "@/Components/Admin/AdminLayout/Layout";
import { AlertModal } from "@/Components/AlertModal/AlertModal";
import Style from './singleUser.module.css';
import { io } from "socket.io-client";
import { useSession, getSession } from "next-auth/react";

export default function User({ dataUser }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState(null);

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

  // دسترسی: فقط admin و editor
  useEffect(() => {
  if (status !== "authenticated") return;
  const role = session?.user?.role?.toLowerCase() ?? '';
  if (!["admin","editor"].includes(role)) {
    router.replace("/");
  }
}, [session, status, router]);


  // Socket.IO
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("user-update", (data) => {
      if (data._id === userData._id) setUserData(prev => ({ ...prev, ...data }));
    });
    socket.on("user-delete", (data) => {
      if (data._id === userData._id) router.push("/aXdmiNPage/users");
    });
    return () => {
      socket.off("user-update");
      socket.off("user-delete");
    };
  }, [socket, userData._id, router]);

  const formattedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  const handleDeleteUser = async () => {
    if (session?.user.role !== "admin") return;
    setIsDeleting(true);
    const res = await fetch(`/api/user/${userData._id}`, { method: 'DELETE' });
    if (res.ok) router.push('/aXdmiNPage/users');
    else setIsDeleting(false);
  };

  const handleBlockUser = async () => {
    if (session?.user.role !== "admin") return;
    setIsUpdating(true);
    const res = await fetch(`/api/user/${userData._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !userData.isActive })
    });
    if (res.ok) {
      const updatedUser = await res.json();
      setUserData(prev => ({ ...prev, ...updatedUser.data, address: updatedUser.data?.address ?? safeAddress }));
      setShowBlockModal(false);
    }
    setIsUpdating(false);
  };

  const handleRoleChange = async () => {
    if (session?.user.role !== "admin") return;
    setIsUpdating(true);
    const res = await fetch(`/api/user/${userData._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: selectedRole })
    });
    if (res.ok) {
      const updatedUser = await res.json();
      setUserData(prev => ({ ...prev, ...updatedUser.data, address: updatedUser.data?.address ?? safeAddress }));
      setShowRoleModal(false);
    }
    setIsUpdating(false);
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
            <span className={Style.backLink} onClick={() => router.push('/aXdmiNPage/users')}>Back to Users</span>
          </div>
        </div>

        <div className={Style.profileContainer}>
          <div className={Style.profileHeader}>
            <div className={Style.avatar}>
              {userData?.firstname?.charAt(0) ?? '—'}{userData?.lastname?.charAt(0) ?? ''}
            </div>
            <div className={Style.userMainInfo}>
              <h2 className={Style.userName}>{`${userData?.firstname ?? ''} ${userData?.lastname ?? ''}`}</h2>
              <p className={Style.userEmail}>{userData?.email ?? '—'}</p>
            </div>
          </div>

          <div className={Style.detailsGrid}>
            <div className={Style.detailSection}>
              <h3 className={Style.sectionTitle}>Personal Information</h3>
              <div className={Style.detailItem}><span className={Style.detailLabel}>Username:</span><span className={Style.detailValue}>{userData?.username ?? '—'}</span></div>
              <div className={Style.detailItem}><span className={Style.detailLabel}>Phone:</span><span className={Style.detailValue}>{userData?.phone ?? '—'}</span></div>
            </div>

            <div className={Style.detailSection}>
              <h3 className={Style.sectionTitle}>Address</h3>
              <div className={Style.detailItem}><span className={Style.detailLabel}>Street:</span><span className={Style.detailValue}>{userData?.address?.street ?? '—'}</span></div>
              <div className={Style.detailItem}><span className={Style.detailLabel}>City:</span><span className={Style.detailValue}>{userData?.address?.city ?? '—'}</span></div>
              <div className={Style.detailItem}><span className={Style.detailLabel}>Postal Code:</span><span className={Style.detailValue}>{userData?.address?.postalCode ?? '—'}</span></div>
              <div className={Style.detailItem}><span className={Style.detailLabel}>Country:</span><span className={Style.detailValue}>{userData?.address?.country ?? '—'}</span></div>
            </div>

            <div className={Style.detailSection}>
              <h3 className={Style.sectionTitle}>Account Information</h3>
              <div className={Style.detailItem}><span className={Style.detailLabel}>Account Created:</span><span className={Style.detailValue}>{formattedDate}</span></div>
              <div className={Style.detailItem}><span className={Style.detailLabel}>User ID:</span><span className={Style.detailValue}>{userData?._id ?? '—'}</span></div>
            </div>
          </div>

          {session?.user.role === "admin" && (
            <div className={Style.actionButtons}>
              <button className={Style.changeRoleButton} onClick={() => setShowRoleModal(true)} disabled={isUpdating}>Change Role</button>
              <button className={`${Style.blockButton} ${!userData.isActive ? Style.unblockButton : ''}`} onClick={() => setShowBlockModal(true)} disabled={isUpdating}>
                {userData.isActive ? 'Block User' : 'Unblock User'}
              </button>
              <button className={Style.deleteButton} onClick={() => setShowDeleteModal(true)} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          )}


        </div>
      </div>

      {/* Modals */}
      <AlertModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title={`Delete ${userData?.firstname ?? ''} ${userData?.lastname ?? ''}?`} message={<>Are you sure you want to permanently delete this user account?<br /><strong>This action cannot be undone!</strong></>} confirmText={isDeleting ? 'Deleting...' : 'Delete'} cancelText="Cancel" onConfirm={handleDeleteUser} type="error" />

      <AlertModal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)} title={`${userData.isActive ? 'Block' : 'Unblock'} ${userData?.firstname ?? ''} ${userData?.lastname ?? ''}?`} message={<>{userData.isActive ? <strong>Blocked users cannot access the system!</strong> : <strong>User will regain access to the system!</strong>}</>} confirmText={isUpdating ? 'Processing...' : userData.isActive ? 'Block' : 'Unblock'} cancelText="Cancel" onConfirm={handleBlockUser} type="warning" />

      <AlertModal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} title={`Change Role for ${userData?.firstname ?? ''} ${userData?.lastname ?? ''}`} message={<div className={Style.roleSelection}><label>Select new role:</label><select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className={Style.roleSelect}><option value="user">User</option><option value="editor">Editor</option><option value="admin">Admin</option></select></div>} confirmText={isUpdating ? 'Updating...' : 'Update Role'} cancelText="Cancel" onConfirm={handleRoleChange} type="info" />
    </AdminNavbar>
  );
}

// -----------------------------------
// Server-side: دسترسی و serialization
// -----------------------------------
export async function getServerSideProps(context) {
  const { _id } = context.params;
  const session = await getSession(context);

  if (!session || !["admin", "editor"].includes(session.user.role)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const res = await fetch(`/api/user/${_id}`);
    if (!res.ok) return { notFound: true };
    let data = await res.json();
    let dataUser = data?.data ?? null;

    // تبدیل ObjectId و Date برای serialization
    if (dataUser) {
      dataUser = {
        ...dataUser,
        _id: dataUser._id.toString(),
        createdAt: dataUser.createdAt ? new Date(dataUser.createdAt).toISOString() : null,
        updatedAt: dataUser.updatedAt ? new Date(dataUser.updatedAt).toISOString() : null,
        emailVerified: dataUser.emailVerified ? new Date(dataUser.emailVerified).toISOString() : null,
      };
    }

    return { props: { dataUser } };
  } catch (e) {
    return { notFound: true };
  }
}
