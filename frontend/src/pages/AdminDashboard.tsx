import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  LogOut, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  ChevronRight,
  LayoutDashboard 
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ patients: 0, appointments: 0, messages: 0, reports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const responses = await Promise.all([
        fetch(`${API_BASE_URL}/patients`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/messages`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/reports`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [p, a, m, r] = await Promise.all(responses.map(res => res.json()));

      setStats({
        patients: p.patients?.length || 0,
        appointments: a.appointments?.length || 0,
        messages: m.messages?.length || 0,
        reports: r.reports?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminUser");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const dashboardItems = [
    { title: "Patients", count: stats.patients, icon: Users, path: "/admin/patients" },
    { title: "Appointments", count: stats.appointments, icon: Calendar, path: "/admin/appointments" },
    { title: "Messages", count: stats.messages, icon: MessageSquare, path: "/admin/messages" },
    { title: "Reports", count: stats.reports, icon: FileText, path: "/admin/reports" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      {/* Premium Header - Matching About Hero style */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <LayoutDashboard size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Admin Control <span className="font-light text-slate-400">Center</span></h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-primary transition-all duration-300 shadow-lg shadow-slate-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb - Consistent with About Page */}
        <div className="inline-block px-4 py-1.5 mb-10 rounded-full bg-slate-50 border border-slate-100">
          <nav className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400">
            <Link to="/" className="hover:text-primary transition-colors">Portal</Link>
            <ChevronRight size={10} />
            <span className="text-slate-900">Dashboard</span>
          </nav>
        </div>

        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-xs font-bold text-primary tracking-[0.4em] uppercase mb-3">Overview</h2>
          <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Hospital Metrics</h3>
        </div>

        {/* Stats Grid - Matching About Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {dashboardItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
            >
              <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-inner">
                <item.icon size={26} strokeWidth={1.5} />
              </div>
              <h4 className="text-sm font-bold text-slate-400 tracking-[0.2em] uppercase mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-5xl font-bold text-slate-900 tracking-tighter">{item.count}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                Manage Data <ChevronRight size={12} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions - Clean, Minimalist List */}
        <section className="bg-slate-50/50 rounded-[3rem] p-12 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-sm">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Management Suite</h2>
              <p className="text-slate-500 font-light">Direct access to core hospital administrative modules and reporting tools.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dashboardItems.map((action) => (
                <button
                  key={`btn-${action.path}`}
                  onClick={() => navigate(action.path)}
                  className="flex items-center justify-between gap-6 px-6 py-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <action.icon size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                    <span className="font-bold text-slate-700 text-sm tracking-tight">{action.title}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;