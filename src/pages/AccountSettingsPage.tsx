import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getSupabase } from "../utils/supabase.init";
import "../styles/accountsettings.css";

interface ProfileData {
  full_name: string;
  email: string;
  company: string;
  position_title: string;
  logo_url: string;
}

const AccountSettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    email: "",
    company: "",
    position_title: "",
    logo_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const supabase = getSupabase();
        if (!supabase || !user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data) {
          setProfile({
            full_name: data.full_name || "",
            email: data.email || "",
            company: data.company || "",
            position_title: data.position_title || "",
            logo_url: data.logo_url || "",
          });
        }
      } catch (err) {
        setError("Failed to load profile data");
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile({
        full_name: profile.full_name,
        company: profile.company,
        position_title: profile.position_title,
        logo_url: profile.logo_url,
      });
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase not initialized");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("logos").getPublicUrl(filePath);

      setProfile((prev) => ({ ...prev, logo_url: publicUrl }));
    } catch (err) {
      setError("Failed to upload logo");
    }
  };

  return (
    <div className="account-settings-container">
      <div className="account-settings-card">
        <h1>Account Settings</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={profile.full_name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, full_name: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="disabled"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              value={profile.company}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, company: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position Title</label>
            <input
              id="position"
              type="text"
              value={profile.position_title}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  position_title: e.target.value,
                }))
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="logo">Company Logo</label>
            <div className="logo-upload">
              {profile.logo_url && (
                <img
                  src={profile.logo_url}
                  alt="Company logo"
                  className="logo-preview"
                />
              )}
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="logo-input"
              />
            </div>
          </div>

          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="settings-section">
          <h2>Password</h2>
          <button className="change-password-button">Change Password</button>
        </div>

        <div className="settings-section">
          <h2>Form Preferences</h2>
          <p className="disabled-message">Module customization coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
