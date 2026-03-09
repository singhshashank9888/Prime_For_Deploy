import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, ArrowLeft, Phone, User, Copy } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const AdminAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed">("pending");
  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      toast.error("Failed to load appointments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmAppointment = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/confirm`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      });
      const data = await response.json();
      if (data.success) {
        const patientId = data.appointment.patientId?.patientId;
        setCreatedPatientId(patientId);

        toast.success(
          `Appointment confirmed! New Patient ID: ${patientId}`
        );
        setSelectedAppointment(null);
        setNotes("");
        fetchAppointments();
        setActiveTab("confirmed");

        // Show success notification for 5 seconds
        setTimeout(() => setCreatedPatientId(null), 5000);
      }
    } catch (error) {
      toast.error("Failed to confirm appointment");
      console.error(error);
    }
  };

  const copyPatientId = (patientId: string) => {
    navigator.clipboard.writeText(patientId);
    toast.success("Patient ID copied to clipboard!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const pendingAppointments = appointments.filter((apt: any) => apt.status === "pending");
  const confirmedAppointments = appointments.filter((apt: any) => apt.status === "confirmed");

  const displayedAppointments = activeTab === "pending" ? pendingAppointments : confirmedAppointments;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Appointments</h1>
        </div>
      </div>

      {/* Success Banner for Created Patient */}
      {createdPatientId && (
        <div className="bg-green-50 border-b-2 border-green-500 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User size={24} className="text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Patient Created Successfully!</p>
                <p className="text-sm text-green-800">New Patient ID: <span className="font-mono font-bold">{createdPatientId}</span></p>
              </div>
            </div>
            <button
              onClick={() => copyPatientId(createdPatientId)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
            >
              <Copy size={18} />
              Copy ID
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${activeTab === "pending"
              ? "bg-yellow-600 text-white"
              : "bg-white text-slate-900 border border-slate-200 hover:border-slate-300"
              }`}
          >
            <Clock size={20} />
            Pending Appointments ({pendingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${activeTab === "confirmed"
              ? "bg-green-600 text-white"
              : "bg-white text-slate-900 border border-slate-200 hover:border-slate-300"
              }`}
          >
            <CheckCircle size={20} />
            Confirmed Appointments ({confirmedAppointments.length})
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointments List */}
            <div className="lg:col-span-2">
              <div className="md:bg-white md:rounded-xl md:shadow-lg md:overflow-hidden">
                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className={`text-white text-sm ${activeTab === "pending" ? "bg-yellow-600" : "bg-green-600"}`}>
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Patient</th>
                        <th className="px-6 py-4 text-left font-semibold">Department</th>
                        <th className="px-6 py-4 text-left font-semibold">Date</th>
                        <th className="px-6 py-4 text-left font-semibold">ID</th>
                        <th className="px-6 py-4 text-center font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {displayedAppointments.map((apt: any) => (
                        <tr
                          key={apt._id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium">{apt.patientName}</td>
                          <td className="px-6 py-4 text-slate-500">{apt.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                            {new Date(apt.appointmentDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {apt.patientId ? (
                              <span className="font-mono text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-xs">
                                {apt.patientId?.patientId || "-"}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {apt.status === "pending" && (
                              <button
                                onClick={() => setSelectedAppointment(apt)}
                                className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-bold transition-all text-xs uppercase tracking-wider"
                              >
                                Confirm
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                  {displayedAppointments.map((apt: any) => (
                    <div key={apt._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${activeTab === "pending" ? "bg-yellow-600" : "bg-green-600"}`} />

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 leading-tight">{apt.patientName}</h4>
                          <p className="text-sm text-slate-500 mt-1">{apt.department}</p>
                        </div>
                        {apt.patientId && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">{apt.patientId.patientId}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded-xl text-center">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Date</p>
                          <p className="text-xs font-bold text-slate-900">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl text-center">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Time Slot</p>
                          <p className="text-xs font-bold text-slate-900">{apt.timeSlot || "N/A"}</p>
                        </div>
                      </div>

                      {apt.status === "pending" && (
                        <button
                          onClick={() => setSelectedAppointment(apt)}
                          className="w-full py-3 bg-slate-950 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                        >
                          Review & Confirm
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Confirmation Panel */}
            {selectedAppointment && (
              <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Confirm Appointment
                </h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-slate-600">Patient Name</p>
                    <p className="font-semibold">{selectedAppointment.patientName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Phone size={16} />
                      Phone Number
                    </p>
                    <p className="font-semibold text-blue-600">
                      {selectedAppointment.phone || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-semibold">{selectedAppointment.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">Department</p>
                    <p className="font-semibold">{selectedAppointment.department}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">Appointment Date</p>
                    <p className="font-semibold">
                      {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">Time Slot</p>
                    <p className="font-semibold">{selectedAppointment.timeSlot}</p>
                  </div>

                  {selectedAppointment.reason && (
                    <div>
                      <p className="text-sm text-slate-600">Reason</p>
                      <p className="font-semibold text-slate-900">{selectedAppointment.reason}</p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-xs text-blue-700">
                      ℹ️ A new patient record will be created with this appointment when confirmed.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Notes for Patient
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Add any important notes..."
                      rows={4}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => confirmAppointment(selectedAppointment._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold transition-all text-sm"
                  >
                    <CheckCircle size={18} />
                    Confirm & Create
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAppointment(null);
                      setNotes("");
                    }}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold transition-all text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;