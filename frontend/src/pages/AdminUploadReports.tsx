import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, Trash2, Plus, X, Search } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const AdminUploadReports = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [createNewPatient, setCreateNewPatient] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientDateOfBirth: "",
    patientGender: "",
    reportType: "X-Ray",
    department: "",
    reportDate: new Date().toISOString().split('T')[0],
    description: "",
    doctorName: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchPatients();
    fetchReports();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setPatients(data.patients || []);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients");
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
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

  const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      patientName: value,
    }));

    if (value.trim().length > 0) {
      const filtered = patients.filter((p: any) =>
        p.patientId.toLowerCase().includes(value.toLowerCase()) ||
        p.fullName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
      setShowPatientDropdown(true);
    } else {
      setShowPatientDropdown(false);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setFormData((prev) => ({
      ...prev,
      patientId: patient._id,
      patientName: patient.fullName,
    }));
    setShowPatientDropdown(false);
  };

  // FIXED: Accumulate files instead of replacing them
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const validFiles = files.filter(file => {
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          toast.error(`${file.name}: Invalid file type`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: File too large (max 5MB)`);
          return false;
        }
        return true;
      });

      // KEY FIX: Add new files to existing ones instead of replacing
      setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
      if (validFiles.length > 0) {
        toast.success(`${validFiles.length} file(s) added to upload queue`);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one report image");
      return;
    }

    if (createNewPatient) {
      if (!formData.patientName || !formData.patientEmail || !formData.patientPhone || 
          !formData.patientDateOfBirth || !formData.patientGender) {
        toast.error("Please fill all patient details");
        return;
      }
    } else {
      if (!formData.patientId.trim()) {
        toast.error("Please select a patient");
        return;
      }
    }

    if (!formData.reportType) {
      toast.error("Please select a report type");
      return;
    }

    setReportLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const formDataToSend = new FormData();
      
      selectedFiles.forEach(file => {
        formDataToSend.append('reportImages', file);
      });

      if (createNewPatient) {
        formDataToSend.append("patientName", formData.patientName);
        formDataToSend.append("patientEmail", formData.patientEmail);
        formDataToSend.append("patientPhone", formData.patientPhone);
        formDataToSend.append("patientDateOfBirth", formData.patientDateOfBirth);
        formDataToSend.append("patientGender", formData.patientGender);
        formDataToSend.append("createNewPatient", "true");
      } else {
        formDataToSend.append("patientId", formData.patientId);
        formDataToSend.append("createNewPatient", "false");
      }

      formDataToSend.append("reportType", formData.reportType);
      formDataToSend.append("department", formData.department || "General");
      formDataToSend.append("reportDate", formData.reportDate);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("doctorName", formData.doctorName || "Not Specified");

      const response = await fetch(`${API_BASE_URL}/reports/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`${selectedFiles.length} report(s) uploaded successfully!`);
        setSelectedFiles([]);
        setFormData({
          patientId: "",
          patientName: "",
          patientEmail: "",
          patientPhone: "",
          patientDateOfBirth: "",
          patientGender: "",
          reportType: "X-Ray",
          department: "",
          reportDate: new Date().toISOString().split('T')[0],
          description: "",
          doctorName: "",
        });
        setCreateNewPatient(false);
        fetchReports();
        fetchPatients();
      } else {
        toast.error(data.message || "Failed to upload reports");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        fetchReports();
        toast.success("Report deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Upload Medical Reports</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Upload Report</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Mode Toggle */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setCreateNewPatient(false);
                    setFormData({ ...formData, patientId: "", patientName: "" });
                    setShowPatientDropdown(false);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                    !createNewPatient
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                  }`}
                >
                  Existing Patient
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreateNewPatient(true);
                    setFormData({ ...formData, patientId: "", patientName: "" });
                    setShowPatientDropdown(false);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                    createNewPatient
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                  }`}
                >
                  <Plus size={16} className="inline mr-2" />
                  New Patient
                </button>
              </div>

              {/* EXISTING PATIENT - SIMPLIFIED */}
              {!createNewPatient && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Patient *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={formData.patientName}
                      onChange={handlePatientSearch}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoComplete="off"
                    />
                    
                    {/* Patient Dropdown */}
                    {showPatientDropdown && filteredPatients.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {filteredPatients.map((patient: any) => (
                          <button
                            key={patient._id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectPatient(patient);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-b-0"
                          >
                            <p className="font-semibold text-slate-900">{patient.patientId}</p>
                            <p className="text-sm text-slate-600">{patient.fullName}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.patientId && (
                    <p className="text-xs text-green-600 mt-2">✓ Patient selected: {formData.patientName}</p>
                  )}
                </div>
              )}

              {/* NEW PATIENT - FULL FORM */}
              {createNewPatient && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-slate-900">Patient Details</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Name *</label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Email *</label>
                    <input
                      type="email"
                      name="patientEmail"
                      value={formData.patientEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="9841234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">DOB *</label>
                    <input
                      type="date"
                      name="patientDateOfBirth"
                      value={formData.patientDateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Gender *</label>
                    <select
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {/* REPORT TYPE - REQUIRED */}
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Report Type *
                </label>
                <select
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="X-Ray">X-Ray</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="MRI">MRI</option>
                  <option value="ECG">ECG</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* OPTIONAL FIELDS - Hidden by default */}
              <details className="cursor-pointer group">
                <summary className="text-sm font-semibold text-slate-700 py-2 hover:text-slate-900">
                  + Additional Details (Optional)
                </summary>
                <div className="space-y-4 mt-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Cardiology"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Doctor Name</label>
                    <input
                      type="text"
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Dr. Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Notes</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional notes..."
                      rows={2}
                    />
                  </div>
                </div>
              </details>

              {/* REPORT DATE - AUTO SET */}
              <input
                type="hidden"
                name="reportDate"
                value={formData.reportDate}
              />

              {/* FILE UPLOAD */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Report Images *
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer block">
                    <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">Click or drag images here</p>
                  </label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-slate-900">Selected: {selectedFiles.length}</p>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-sm text-green-900">{file.name}</p>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={reportLoading}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {reportLoading ? `Uploading ${selectedFiles.length}...` : `Upload ${selectedFiles.length || 0} Report(s)`}
              </button>
            </form>
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Reports ({reports.length})</h2>
            <div className="max-h-[600px] overflow-y-auto space-y-3">
              {reports.length === 0 ? (
                <p className="text-center text-slate-600">No reports yet</p>
              ) : (
                reports.slice(0, 15).map((report: any) => (
                  <div key={report._id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{report.reportType}</p>
                        <p className="text-xs text-slate-600">{report.patientName}</p>
                        <p className="text-xs text-blue-600">{report.patientId?.patientId}</p>
                      </div>
                      <button
                        onClick={() => deleteReport(report._id)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUploadReports;