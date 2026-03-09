import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const AdminMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [activeTab, setActiveTab] = useState<"unread" | "replied">("unread");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      toast.error("Failed to load messages");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = async (message: any) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/messages/${message._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSelectedMessage(data.message);
      }
    } catch (error) {
      toast.error("Failed to load message");
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE_URL}/messages/${selectedMessage._id}/reply`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ repliedMessage: replyText }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Reply sent successfully!");
        setReplyText("");
        fetchMessages();
        setSelectedMessage(null);
        setActiveTab("replied");
      }
    } catch (error) {
      toast.error("Failed to send reply");
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const unreadMessages = messages.filter(
    (msg: any) => msg.status === "new" || msg.status === "read"
  );
  const repliedMessages = messages.filter((msg: any) => msg.status === "replied");

  const displayedMessages = activeTab === "unread" ? unreadMessages : repliedMessages;

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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Messages</h1>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
          <button
            onClick={() => setActiveTab("unread")}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${activeTab === "unread"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-900 border border-slate-200 hover:border-slate-300"
              }`}
          >
            <Mail size={20} />
            Unread Messages ({unreadMessages.length})
          </button>
          <button
            onClick={() => setActiveTab("replied")}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${activeTab === "replied"
              ? "bg-green-600 text-white"
              : "bg-white text-slate-900 border border-slate-200 hover:border-slate-300"
              }`}
          >
            <CheckCircle2 size={20} />
            Replied Messages ({repliedMessages.length})
          </button>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List - hidden on mobile when a message is selected */}
          <div className={`lg:col-span-1 ${selectedMessage ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className={`text-white px-6 py-3 font-semibold ${activeTab === "unread" ? "bg-blue-600" : "bg-green-600"
                }`}>
                {activeTab === "unread" ? "Unread" : "Replied"} Messages ({displayedMessages.length})
              </div>
              <div className="max-h-[300px] lg:max-h-[calc(100vh-350px)] overflow-y-auto no-scrollbar">
                {loading ? (
                  <p className="p-4 text-center text-slate-600">Loading...</p>
                ) : displayedMessages.length === 0 ? (
                  <p className="p-4 text-center text-slate-600">No messages</p>
                ) : (
                  displayedMessages.map((msg: any) => (
                    <button
                      key={msg._id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full text-left px-4 py-3 border-b border-slate-200 hover:bg-slate-50 transition-all ${selectedMessage?._id === msg._id
                        ? activeTab === "unread"
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : "bg-green-50 border-l-4 border-l-green-500"
                        : ""
                        }`}
                    >
                      <p className="font-semibold text-sm text-slate-900">
                        {msg.name}
                      </p>
                      <p className="text-xs text-slate-600 truncate">
                        {msg.subject}
                      </p>
                      <span
                        className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-semibold ${getStatusBadge(
                          msg.status
                        )}`}
                      >
                        {msg.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Details */}
          {selectedMessage ? (
            <div className="lg:col-span-2">
              {/* Back button for mobile when message is selected */}
              <button
                onClick={() => setSelectedMessage(null)}
                className="lg:hidden flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest mb-4 bg-white px-4 py-2 rounded-lg border border-slate-100"
              >
                <ArrowLeft size={16} /> Back to List
              </button>
              <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {selectedMessage.subject}
                </h3>

                <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-slate-600">From</p>
                      <p className="font-semibold">{selectedMessage.name}</p>
                      <p className="text-sm text-slate-600">{selectedMessage.email}</p>
                      {selectedMessage.phone && (
                        <p className="text-sm text-slate-600">{selectedMessage.phone}</p>
                      )}
                    </div>
                    <span
                      className={`h-fit text-sm px-3 py-1 rounded-full font-semibold ${getStatusBadge(
                        selectedMessage.status
                      )}`}
                    >
                      {selectedMessage.status}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-600 mb-2">Message</p>
                    <p className="text-slate-900 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {selectedMessage.repliedMessage && (
                    <div className="border-t border-slate-200 pt-4 bg-green-50 p-4 rounded">
                      <p className="text-sm text-green-800 font-semibold mb-2">
                        ✓ Your Reply
                      </p>
                      <p className="text-green-900 whitespace-pre-wrap">
                        {selectedMessage.repliedMessage}
                      </p>
                    </div>
                  )}
                </div>

                {selectedMessage.status !== "replied" && (
                  <div className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Type your reply..."
                      rows={5}
                    />
                    <button
                      onClick={sendReply}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <Send size={18} />
                      Send Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex lg:col-span-2 bg-white rounded-xl border border-dashed border-slate-200 items-center justify-center p-12 text-center text-slate-400">
              <div className="max-w-xs mx-auto">
                <Mail size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium">Select a message to view details</p>
                <p className="text-xs mt-1">Select from the list on the left to read and reply.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;