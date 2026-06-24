import { useEffect, useState } from "react";
import { userApi } from "../api/user.api";
import { useAuthStore } from "../stores/auth.store";
import type { User } from "../types/user.types";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Alert } from "../components/ui/Alert";
import { Skeleton } from "../components/ui/Skeleton";
import { Avatar } from "../components/ui/Avatar";
import { ShieldCheck, ShieldAlert, Trash2, Mail, Phone, MapPin } from "lucide-react";

export default function AdminUsers() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status Action States
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Delete State
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getAll();
      setUsers(res.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (user: User) => {
    if (user._id === currentUser?._id) {
      alert("Security restriction: You cannot revoke your own administrator privileges.");
      return;
    }
    setUpdatingUserId(user._id);
    try {
      await userApi.update(user._id, { isAdmin: !user.isAdmin });
      // Reload users
      const res = await userApi.getAll();
      setUsers(res.data.data);
    } catch (err: any) {
      alert(err.message || "Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    if (deletingUser._id === currentUser?._id) {
      alert("Security restriction: You cannot delete your own active session account.");
      return;
    }
    try {
      await userApi.delete(deletingUser._id);
      setDeletingUser(null);
      // Reload users
      const res = await userApi.getAll();
      setUsers(res.data.data);
    } catch (err: any) {
      alert(err.message || "Failed to delete user account");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Users & Roles</h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Monitor registration directories, assign admin privileges, or delete accounts.
        </p>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-14 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Alert type="error">{error}</Alert>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-semibold bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          No registered user profiles found.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="py-4 px-6">User Account</th>
                <th className="py-4 px-6">Email Contact</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Phone Number</th>
                <th className="py-4 px-6">Platform Role</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar username={user.username} size="sm" />
                      <span className="font-bold text-gray-900">{user.username}</span>
                      {user._id === currentUser?._id && (
                        <span className="bg-primary-light text-primary px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold uppercase tracking-wide">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{user.email}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-medium">
                    {user.city || user.country ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {[user.city, user.country].filter(Boolean).join(", ")}
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-300 italic font-semibold text-xs">Not specified</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-medium">
                    {user.phone ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{user.phone}</span>
                      </span>
                    ) : (
                      <span className="text-gray-300 italic font-semibold text-xs">Not specified</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {user.isAdmin ? (
                      <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Administrator</span>
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        <span>Standard Guest</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleToggleAdmin(user)}
                        disabled={user._id === currentUser?._id || updatingUserId === user._id}
                        className={`h-[28px] px-2 text-[10px] uppercase font-bold inline-flex items-center gap-1 ${
                          user.isAdmin
                            ? "text-amber-600 border-amber-200 hover:bg-amber-50"
                            : "text-primary border-primary/20 hover:bg-primary-light"
                        }`}
                        title={user.isAdmin ? "Revoke Admin Status" : "Grant Admin Status"}
                      >
                        {user.isAdmin ? (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Demote</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Promote</span>
                          </>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => setDeletingUser(user)}
                        disabled={user._id === currentUser?._id}
                        className="h-[32px] w-[32px] p-0 flex items-center justify-center hover:bg-rose-50 rounded-md text-rose-600 disabled:opacity-30"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Delete User Account?"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setDeletingUser(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          Are you absolutely sure you want to delete the user account for{" "}
          <strong className="text-gray-900">{deletingUser?.username}</strong>? This will permanently
          remove their registration data and profile from the system. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
