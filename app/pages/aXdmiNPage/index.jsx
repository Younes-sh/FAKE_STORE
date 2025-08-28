import dynamic from "next/dynamic";
import AdminLayout from "../../Components/Admin/AdminLayout/Layout";
import { getSession, useSession } from "next-auth/react";
import style from "./style.module.css";
import { useState, useEffect } from "react";

// کامپوننت‌های داینامیک
const UserMonthlyGrowth = dynamic(() => import("../../../components/charts/UserMonthlyGrowth/UserMonthlyGrowth"), { 
  ssr: false,
  loading: () => <div className={style.chartLoading}>Loading user growth chart...</div>
});

const UsersByRolePie = dynamic(() => import("../../../components/charts/UsersByRolePie/UsersByRolePie"), { 
  ssr: false,
  loading: () => <div className={style.chartLoading}>Loading user roles chart...</div>
});

const ActiveUsersPie = dynamic(() => import("../../../components/charts/ActiveUsersPie/ActiveUsersPie"), { 
  ssr: false,
  loading: () => <div className={style.chartLoading}>Loading active users chart...</div>
});

const TopCountriesBar = dynamic(() => import("../../../components/charts/TopCountriesBar/TopCountriesBar"), { 
  ssr: false,
  loading: () => <div className={style.chartLoading}>Loading countries chart...</div>
});

// کامپوننت‌های جایگزین برای editor
const EditorStats = dynamic(() => import("../../../components/charts/EditorStats/EditorStats"), { 
  ssr: false,
  loading: () => <div className={style.chartLoading}>Loading editor stats...</div>
});

const ContentActivity = dynamic(() => import("../../../components/charts/ContentActivity/ContentActivity"), { 
  ssr: false,
  loading: () => <div className={style.chartLoading}>Loading content activity...</div>
});

export default function AdminPage({ session: ssrSession }) {
  const { data: session, status } = useSession({ initialData: ssrSession });
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role);
    }
  }, [session]);

  if (status === "loading") return <p style={{ padding: 24 }}>Loading...</p>;

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: 24 }}>
          <h1>Error loading data</h1>
          <p>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  const isAdmin = userRole === "admin";
  const isEditor = userRole === "editor";

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          {isAdmin ? "Admin Dashboard" : "Editor Dashboard"}
        </h1>
        
        {/* نمایش داشبورد بر اساس نقش کاربر */}
        {isAdmin && (
          <>
            <div className={style.chartContainer}>
              <UserMonthlyGrowth months={12} />
            </div>
            
            <div className={style.grid3}>
              <div className={style.chartContainer}>
                <UsersByRolePie />
              </div>
              <div className={style.chartContainer}>
                <ActiveUsersPie />
              </div>
              <div className={style.chartContainer}>
                <TopCountriesBar top={8} />
              </div>
            </div>
          </>
        )}
        
        {isEditor && (
          <div className={style.grid2}>
            <div className={style.chartContainer}>
              <EditorStats />
            </div>
            <div className={style.chartContainer}>
              <ContentActivity />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !["admin", "editor"].includes(session?.user?.role)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}