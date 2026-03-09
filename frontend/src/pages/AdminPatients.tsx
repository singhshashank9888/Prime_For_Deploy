import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit, Plus, ArrowLeft, Search, X, Phone } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const AdminPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    medicalHistory: "",
    bloodGroup: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchPatients();
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setPatients(data.patients || []);
        setFilteredPatients(data.patients || []);
      }
    } catch (error) {
      toast.error("Failed to load patients");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.dateOfBirth || !formData.gender) {
      toast.error("Please fill in all required fields");
      return;
    }

    setFormLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Patient added successfully! ID: ${data.patient.patientId}`);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          medicalHistory: "",
          bloodGroup: "",
        });
        setShowAddPatientModal(false);
        fetchPatients();
      } else {
        toast.error(data.message || "Failed to add patient");
      }
    } catch (error) {
      toast.error("An error occurred while adding patient");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setPatients(patients.filter((p) => p._id !== id));
        toast.success("Patient deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete patient");
      }
    } catch (error) {
      toast.error("Failed to delete patient");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Patients</h1>
          </div>
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 sm:py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-sm text-sm"
          >
            <Plus size={18} />
            Add New Patient
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-slate-600 mt-2">
              Found {filteredPatients.length} patient(s)
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-center text-slate-600">Loading...</p>
        ) : (
          <div className="md:bg-white md:rounded-xl md:shadow-lg md:overflow-hidden">
            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 text-white text-sm">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Phone</th>
                    <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Blood Group</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredPatients.map((patient: any) => (
                    <tr
                      key={patient._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-blue-600">
                        {patient.patientId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{patient.fullName}</td>
                      <td className="px-6 py-4 text-slate-500">{patient.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">{patient.phone}</td>
                      <td className="px-6 py-4 text-center">{patient.bloodGroup || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => navigate(`/admin/patients/${patient._id}`)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title="View/Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deletePatient(patient._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
              {filteredPatients.map((patient: any) => (
                <div key={patient._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-900" />

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">{patient.patientId}</span>
                      <h4 className="text-lg font-bold text-slate-900 leading-tight">{patient.fullName}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/patients/${patient._id}`)} className="p-2 bg-slate-50 rounded-lg text-slate-600"><Edit size={16} /></button>
                      <button onClick={() => deletePatient(patient._id)} className="p-2 bg-red-50 rounded-lg text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">@</div>
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Phone size={14} />
                      </div>
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 font-bold text-[10px]">BG</div>
                      <span>Blood Group: <span className="font-bold text-slate-900">{patient.bloodGroup || "Not Specified"}</span></span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/admin/patients/${patient._id}`)}
                    className="mt-6 w-full py-3 bg-slate-50 text-slate-900 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                  >
                    View Full Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Add New Patient</h2>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="9841234567"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="123 Main Street"
                />
              </div>

              {/* Medical History */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Medical History
                </label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Any previous illnesses or conditions..."
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-semibold disabled:opacity-50"
                >
                  {formLoading ? "Adding..." : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPatients;