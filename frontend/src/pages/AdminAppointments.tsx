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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Appointment Management</h1>
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-white text-slate-900 border border-slate-200 hover:border-slate-300"
            }`}
          >
            <Clock size={20} />
            Pending Appointments ({pendingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "confirmed"
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {displayedAppointments.length === 0 ? (
                  <p className="p-6 text-center text-slate-600">
                    No {activeTab === "pending" ? "pending" : "confirmed"} appointments
                  </p>
                ) : (
                  <table className="w-full">
                    <thead className={`text-white ${
                      activeTab === "pending" ? "bg-yellow-600" : "bg-green-600"
                    }`}>
                      <tr>
                        <th className="px-6 py-3 text-left">Patient</th>
                        <th className="px-6 py-3 text-left">Department</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Patient ID</th>
                        <th className="px-6 py-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedAppointments.map((apt: any) => (
                        <tr
                          key={apt._id}
                          className="border-b border-slate-200 hover:bg-slate-50"
                        >
                          <td className="px-6 py-3">{apt.patientName}</td>
                          <td className="px-6 py-3">{apt.department}</td>
                          <td className="px-6 py-3">
                            {new Date(apt.appointmentDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3">
                            {apt.patientId ? (
                              <span className="font-mono text-blue-600 font-semibold">
                                {apt.patientId?.patientId || "-"}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            {apt.status === "pending" && (
                              <button
                                onClick={() => setSelectedAppointment(apt)}
                                className="text-blue-600 hover:text-blue-800 font-semibold"
                              >
                                Confirm
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Confirmation Panel */}
            {selectedAppointment && (
              <div className="bg-white rounded-xl shadow-lg p-6">
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
                <div className="flex gap-3">
                  <button
                    onClick={() => confirmAppointment(selectedAppointment._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <CheckCircle size={18} />
                    Confirm & Create Patient
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAppointment(null);
                      setNotes("");
                    }}
                    className="flex-1 px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400"
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