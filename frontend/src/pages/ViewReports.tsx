import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, ArrowLeft, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const ViewReports = () => {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  const SERVER_BASE_URL = API_BASE_URL.replace('/api', '');

  // Handle search - NO dropdown, just direct search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId.trim()) {
      toast.error("Please enter your Patient ID");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const token = localStorage.getItem("authToken");
      
      // Assume patientId is MongoDB ID or PT00001 format
      const mongoDbId = patientId.trim();

      const response = await fetch(`${API_BASE_URL}/reports/patient/${mongoDbId}`, {
        headers: { Authorization: `Bearer ${token || ''}` },
      });

      const data = await response.json();

      if (data.success) {
        setReports(data.reports);
        toast.success(`Found ${data.reports.length} report(s)`);
      } else {
        setReports([]);
        toast.error(data.message || "No reports found");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Download report
  const downloadReport = async (imageUrl: string, fileName: string) => {
    setDownloading(true);
    try {
      const fullUrl = `${SERVER_BASE_URL}${imageUrl}`;

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: { 'Accept': 'image/*' }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'report.jpg';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download report.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">My Medical Reports</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-slate-200">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Find Your Reports</h2>
            <p className="text-slate-600 mt-2">Enter your Patient ID to view your medical reports</p>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Patient ID
              </label>
              <input
                type="text"
                placeholder="e.g., PT00001"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-5 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
                autoComplete="off"
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter your unique Patient ID (e.g., PT00001)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || patientId.trim().length === 0}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </span>
              ) : (
                'Search Reports'
              )}
            </button>
          </form>
        </div>

        {/* Reports List */}
        {searched && (
          <div>
            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-slate-200">
                <FileText size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 text-lg font-semibold">No reports found</p>
                <p className="text-slate-500 text-sm mt-2">Please verify your Patient ID and try again</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Your Reports ({reports.length})
                </h3>
                {reports.map((report: any) => (
                  <div
                    key={report._id}
                    className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900">
                            {report.reportType}
                          </h3>
                          <p className="text-slate-600 text-sm mt-2">
                            {report.description || "No additional details"}
                          </p>
                        </div>
                        <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold whitespace-nowrap ml-2">
                          {report.reportType}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-t border-b border-slate-100">
                        <div>
                          <p className="text-xs text-slate-600 font-semibold uppercase">Report Date</p>
                          <p className="text-sm font-semibold text-slate-900 mt-1">
                            {new Date(report.reportDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-semibold uppercase">Department</p>
                          <p className="text-sm font-semibold text-slate-900 mt-1">{report.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-semibold uppercase">Doctor</p>
                          <p className="text-sm font-semibold text-slate-900 mt-1">{report.doctorName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-semibold uppercase">Upload Date</p>
                          <p className="text-sm font-semibold text-slate-900 mt-1">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          <Eye size={18} />
                          View
                        </button>
                        <button
                          onClick={() => downloadReport(report.reportImageUrl, `Report-${report.reportType}.jpg`)}
                          disabled={downloading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                        >
                          <Download size={18} />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Report Preview Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {selectedReport.reportType}
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">Patient</p>
                      <p className="text-base font-semibold text-slate-900 mt-1">{selectedReport.patientName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">Department</p>
                      <p className="text-base font-semibold text-slate-900 mt-1">{selectedReport.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">Doctor</p>
                      <p className="text-base font-semibold text-slate-900 mt-1">{selectedReport.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">Date</p>
                      <p className="text-base font-semibold text-slate-900 mt-1">
                        {new Date(selectedReport.reportDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Report Image</p>
                  <img
                    src={`${SERVER_BASE_URL}${selectedReport.reportImageUrl}`}
                    alt={selectedReport.reportType}
                    className="w-full rounded-lg border-2 border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3EImage Failed to Load%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {selectedReport.description && (
                  <div>
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Notes</p>
                    <p className="text-slate-700 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      {selectedReport.description}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => downloadReport(selectedReport.reportImageUrl, `Report-${selectedReport.reportType}.jpg`)}
                    disabled={downloading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="flex-1 px-4 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReports;