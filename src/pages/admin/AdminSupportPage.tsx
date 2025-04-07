import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import toast from 'react-hot-toast';

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  user_email?: string;
}

const AdminSupportPage: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchSupportTickets();
  }, [filterStatus]);

  const fetchSupportTickets = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('support_tickets')
        .select(`
          id, 
          user_id, 
          subject, 
          description, 
          status, 
          priority, 
          created_at,
          users(email)
        `)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to include user email
      const transformedData = data?.map(ticket => ({
        ...ticket,
        user_email: ticket.users?.[0]?.email
      })) || [];

      setTickets(transformedData);
    } catch (error: any) {
      toast.error('Failed to fetch support tickets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: SupportTicket['status']) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success(`Ticket status updated to ${newStatus}`);
      fetchSupportTickets();
    } catch (error: any) {
      toast.error('Failed to update ticket status');
      console.error(error);
    }
  };

  const handleViewTicketDetails = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const renderTicketStatusBadge = (status: string) => {
    const statusColors = {
      open: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const renderPriorityBadge = (priority: string) => {
    const priorityColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[priority as keyof typeof priorityColors]}`}>
        {priority}
      </span>
    );
  };

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-grow p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Support Tickets Management</h1>

        {/* Filters */}
        <div className="mb-4 flex space-x-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Tickets Table */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">User Email</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Created At</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{ticket.id}</td>
                    <td className="p-3">{ticket.user_email}</td>
                    <td className="p-3">{ticket.subject}</td>
                    <td className="p-3">
                      {renderTicketStatusBadge(ticket.status)}
                    </td>
                    <td className="p-3">
                      {renderPriorityBadge(ticket.priority)}
                    </td>
                    <td className="p-3">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewTicketDetails(ticket)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <select 
                          value={ticket.status}
                          onChange={(e) => handleUpdateTicketStatus(ticket.id, e.target.value as SupportTicket['status'])}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>
              <div className="space-y-2">
                <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                <p><strong>Description:</strong> {selectedTicket.description}</p>
                <p><strong>User Email:</strong> {selectedTicket.user_email}</p>
                <p><strong>Status:</strong> {renderTicketStatusBadge(selectedTicket.status)}</p>
                <p><strong>Priority:</strong> {renderPriorityBadge(selectedTicket.priority)}</p>
                <p><strong>Created At:</strong> {new Date(selectedTicket.created_at).toLocaleString()}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSupportPage;