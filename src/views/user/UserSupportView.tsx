import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import {
  LifeBuoy,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  Paperclip,
  ChevronRight,
  User,
  ShieldAlert
} from 'lucide-react';

export const UserSupportView: React.FC = () => {
  const {
    currentUser,
    tickets,
    createSupportTicket,
    replySupportTicket,
    addToast
  } = useApp();

  const userTickets = tickets.filter(t => t.user_id === currentUser?.id);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(userTickets[0]?.id || '');
  const [showNewModal, setShowNewModal] = useState(false);

  // New ticket state
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState<'Orders' | 'Payments' | 'Refill & Cancel' | 'API & Technical' | 'General Inquiry'>('Orders');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [orderId, setOrderId] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  // Reply message
  const [replyText, setReplyText] = useState('');

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || userTickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !initialMessage) {
      addToast('error', 'Incomplete Form', 'Please fill in subject and your inquiry message.');
      return;
    }

    const messageWithOrder = orderId ? `[Related Order: #${orderId}]\n\n${initialMessage}` : initialMessage;
    createSupportTicket(subject, department, priority, messageWithOrder);
    setSubject('');
    setOrderId('');
    setInitialMessage('');
    setShowNewModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    replySupportTicket(activeTicket.id, replyText.trim(), false);
    setReplyText('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Customer Success</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">24/7 Support Desk</h1>
          <p className="text-xs text-slate-400 mt-1">Submit inquiries for order speed-ups, refill warranties, or payment credit assistance.</p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Ticket</span>
        </button>
      </div>

      {/* Main Ticket Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ticket List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Your Inquiries ({userTickets.length})</h3>
          </div>

          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {userTickets.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                No active support tickets found.
              </div>
            ) : (
              userTickets.map(ticket => {
                const isSelected = activeTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-400 font-bold">#{ticket.ticket_number || ticket.id}</span>
                      <StatusBadge status={ticket.status} size="sm" />
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1">{ticket.subject}</h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <span className="capitalize">{ticket.department}</span>
                      <span>{new Date(ticket.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Ticket Thread */}
        <div className="lg:col-span-2">
          {activeTicket ? (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-[650px] overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{activeTicket.subject}</h3>
                    <StatusBadge status={activeTicket.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ticket ID: <span className="font-mono text-slate-300">#{activeTicket.ticket_number || activeTicket.id}</span> • Dept: <span className="text-slate-300">{activeTicket.department}</span>
                  </p>
                </div>
              </div>

              {/* Message Scroll Area */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/30">
                {activeTicket.messages.map(msg => {
                  const isAdmin = msg.is_admin;
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-xl ${isAdmin ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        isAdmin ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {isAdmin ? <ShieldAlert className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                        isAdmin
                          ? 'bg-slate-900 border border-slate-800 text-slate-200'
                          : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      }`}>
                        <div className="flex items-center justify-between gap-4 text-[10px] opacity-80">
                          <span className="font-bold">{msg.user_name} ({isAdmin ? 'Staff Agent' : 'You'})</span>
                          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to support staff..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-12 text-center text-slate-400 text-xs">
              Select or open a ticket to start messaging support.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Submit Support Inquiry</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Orders">Orders & Fulfillment</option>
                    <option value="Payments">Payment & Deposit Credit</option>
                    <option value="Refill & Cancel">Refill / Cancellation</option>
                    <option value="API & Technical">API & Technical Integration</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Subject Line *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Order #1002 speed check or UTR verification"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Related Order ID (Optional)
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ord_1002"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Inquiry Details *
                </label>
                <textarea
                  rows={4}
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Describe your issue with link, current count, or payment transaction UTR details..."
                  required
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
