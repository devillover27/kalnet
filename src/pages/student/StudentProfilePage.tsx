import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { User, Mail, Save, Loader2, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentProfilePage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      toast.success("Profile updated! ✅");
      setSaving(false);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
      </div>

      <div className="card p-6 sm:p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 pb-6 mb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 6px 20px rgba(99, 102, 241, 0.3)" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">{user?.name}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-sm text-gray-400 capitalize">{user?.role} Account</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="form-label flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="form-input"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary cursor-pointer"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
