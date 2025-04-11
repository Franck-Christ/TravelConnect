// import React, { useState, useEffect } from 'react';
// import { Navigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';
// import { useAdminAuth } from '../../context/AdminAuthContext';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import toast from 'react-hot-toast';

// interface User {
//   id: string;
//   email: string;
//   created_at: string;
//   last_sign_in_at: string;
// }

// const AdminUsersPage: React.FC = () => {
//   const { isAdmin } = useAdminAuth();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchUsers();
//   }, [page]);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       // Fetch total users count
//       const { count } = await supabase
//         .from('users')
//         .select('*', { count: 'exact' });
//       setTotalUsers(count || 0);

//       // Fetch paginated users
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setUsers(data || []);
//     } catch (error: any) {
//       toast.error('Failed to fetch users');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteUser = async (userId: string) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;

//     try {
//       const { error } = await supabase.auth.admin.deleteUser(userId);
      
//       if (error) throw error;
      
//       // Remove user from users table
//       await supabase.from('users').delete().eq('id', userId);
      
//       toast.success('User deleted successfully');
//       fetchUsers();
//     } catch (error: any) {
//       toast.error('Failed to delete user');
//       console.error(error);
//     }
//   };

//   if (!isAdmin) {
//     //return <Navigate to="/login" />;
  

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <AdminSidebar />
//       <main className="flex-grow p-6 ml-64">
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h1 className="text-2xl font-bold mb-6">User Management</h1>
          
//           {loading ? (
//             <div className="text-center py-4">Loading users...</div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full bg-white">
//                   <thead>
//                     <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//                       <th className="py-3 px-6 text-left">ID</th>
//                       <th className="py-3 px-6 text-left">Email</th>
//                       <th className="py-3 px-6 text-left">Created At</th>
//                       <th className="py-3 px-6 text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-gray-600 text-sm font-light">
//                     {users.map((user) => (
//                       <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
//                         <td className="py-3 px-6 text-left whitespace-nowrap">
//                           <div className="flex items-center">
//                             {user.id.slice(0, 8)}...
//                           </div>
//                         </td>
//                         <td className="py-3 px-6 text-left">
//                           {user.email}
//                         </td>
//                         <td className="py-3 px-6 text-left">
//                           {new Date(user.created_at).toLocaleDateString()}
//                         </td>
//                         <td className="py-3 px-6 text-center">
//                           <div className="flex item-center justify-center">
//                             <button 
//                               onClick={() => handleDeleteUser(user.id)}
//                               className="w-4 mr-2 transform text-red-500 hover:text-red-700 hover:scale-110"
//                             >
//                               🗑️
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
              
//               {/* Pagination */}
//               <div className="flex justify-between items-center mt-4">
//                 <span>Total Users: {totalUsers}</span>
//                 <div className="flex space-x-2">
//                   <button 
//                     onClick={() => setPage(page - 1)} 
//                     disabled={page === 1}
//                     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   <span className="px-4 py-2">{page}</span>
//                   <button 
//                     onClick={() => setPage(page + 1)} 
//                     disabled={users.length < itemsPerPage}
//                     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };
// }
// export default AdminUsersPage;