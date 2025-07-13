import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Package, Settings } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editData, setEditData] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:4001/api/profile/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data.data);
        setEditData({
          username: res.data.data.username,
          email: res.data.data.email,
        });
      } catch (err) {
        console.error("Profile fetch failed", err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        "http://localhost:4001/api/profile/update",
        {
          userId: profile._id,
          username: editData.username,
          email: editData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res.data.message || "Profile updated successfully!");
      setProfile({ ...profile, ...editData });
      setEditModalOpen(false);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  
  if (loading) {
    return <div className="text-center mt-10 text-gray-500 text-lg">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-10 text-red-500">Profile not found.</div>;
  }

  return (
    <div className="h-[600px] bg-gradient-to-br from-[#eef2f3] to-[#8e9eab] flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-4xl transition-all">
        <button
          onClick={() => setSettingsModalOpen(true)}
          className="absolute top-6 right-6 text-gray-400 hover:text-blue-500"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-5xl font-bold shadow-xl ring-4 ring-indigo-300 transition-transform hover:scale-105 duration-300">
              {profile.username?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="text-center md:text-left w-full">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-1">{profile.username}</h2>
            <p className="text-lg text-gray-600 mb-4">{profile.email}</p>

            <div className="flex flex-wrap gap-4">
              {profile.isAccountVerified ? (
                <span className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-1.5 rounded-full text-sm font-medium shadow">
                  <CheckCircle className="w-4 h-4" /> Verified Account
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-700 bg-red-100 px-4 py-1.5 rounded-full text-sm font-medium shadow">
                  <XCircle className="w-4 h-4" /> Not Verified
                </span>
              )}

              <span className="flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full text-sm text-gray-800 font-medium shadow">
                <Package className="w-4 h-4 text-blue-500" />
                {profile.orderCount} Order{profile.orderCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs text-center space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Settings</h3>

            {!profile.isAccountVerified && (
              <button
                onClick={async () => {
                  try {
                    const { data } = await axios.post(
                      "http://localhost:4001/api/auth/send-verify-otp",
                      {},
                      {
                        withCredentials: true,
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      }
                    );
                    if (data.success) {
                      toast.success(data.message);
                      window.location.href = "/email-verify";
                    } else {
                      toast.error(data.message);
                    }
                  } catch (error) {
                    toast.error(error.message);
                  }
                }}
                className="w-full px-4 py-2 rounded-lg bg-yellow-700 text-white hover:bg-yellow-600 transition"
              >
                Verify Email
              </button>
            )}

            <button
              onClick={() => {
                setEditModalOpen(true);
                setSettingsModalOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>

            

            <button
              onClick={() => setSettingsModalOpen(false)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transition-all">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
