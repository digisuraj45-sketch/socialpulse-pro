import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';

export const PublicContactView: React.FC = () => {
  const { addToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('error', 'Missing Information', 'Please complete all required fields.');
      return;
    }

    setSubmitted(true);
    addToast('success', 'Message Dispatched', 'Thank you! Our operations support desk has logged your inquiry.');
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Get In Touch</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Contact Operations & Support</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Have questions about custom API throughput, child panels, or enterprise billing? We are here 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Column */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Direct Email</h3>
              <p className="text-xs text-slate-400">support@socialpulsepro.com</p>
              <p className="text-[11px] text-slate-400">Average response: &lt; 2 hours</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Fulfillment Operations</h3>
              <p className="text-xs text-slate-400">24 Hours / 7 Days a Week</p>
              <p className="text-[11px] text-slate-400">Automated queue processing</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Live Support Tickets</h3>
              <p className="text-xs text-slate-400">Available inside Customer Dashboard for registered accounts.</p>
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Inquiry Received</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your message has been assigned an internal dispatch token. We will email you at <strong className="text-slate-200">{email}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Suraj Sharma"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="suraj@example.com"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="API Quota / Child Panel Inquiry"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry in detail..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
