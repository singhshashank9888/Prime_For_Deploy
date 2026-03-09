import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    { icon: Phone, title: "Phone", content: "021-517777" },
    { icon: Mail, title: "Email", content: "info@primehospital.com.np" },
    { icon: Clock, title: "Availability", content: "Emergency 24/7 | OPD 8AM-5PM" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent successfully! We'll reply soon.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white font-sans antialiased text-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight">
            <span className="font-light">Contact</span> <span className="font-bold">Us</span>
          </h1>
          <p className="text-white/80 text-lg mt-4">
            Get in touch with Prime Hospital
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">
                  Get In Touch
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                        <info.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {info.title}
                        </h4>
                        <p className="text-slate-600">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden h-64 lg:h-96">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.9159683127996!2d87.28438539999999!3d26.458437500000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef75003345daa1%3A0x8422f63b3b5f5a87!2sPrime%20hospital!5e0!3m2!1sne!2snp!4v1773027514614!5m2!1sne!2snp"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-50 rounded-2xl p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Send us a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="+977-1-XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-semibold py-2.5 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;