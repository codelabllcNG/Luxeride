"use client";

import { useState, useEffect } from "react";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";
import { UpdateUser, changePassword } from "@/lib/api/user";
import { Loader2, Eye, EyeOff } from "lucide-react"; 

// 1. Imports for secure data fetching and state management
import { useShallow } from 'zustand/react/shallow';
import {  checkAuthSession } from "@/lib/api/auth";
import { fetchUserProfile } from "@/lib/api/user";

export default function AccountSettings() {
  // 2. Updated Store Selector with useShallow
  const { user, updateGlobalUser, clearUser } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      updateGlobalUser: state.updateUser,
      clearUser: state.clearUser,
    }))
  );

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone_number: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const initProfileData = async () => {
      if (!user?.ID) {
        setIsRefreshing(false);
        return;
      }

      try {
        const isValid = await checkAuthSession();
        if (!isValid) {
          clearUser();
          return;
        }

        const response = await fetchUserProfile(user.ID);
        
        if (response.status === 'success' && response.user) {
          if (JSON.stringify(user) !== JSON.stringify(response.user)) {
            updateGlobalUser(response.user);
            
          }
        }
      } catch (error) {
        console.error("Failed to refresh user profile:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    initProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // 4. Existing Effect: Sync Form with Store
  // This runs immediately with cached data, and runs again if the server fetch above finds updates
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        address: user.address || "",
        phone_number: user.phone_number || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // 1. Update Profile Info
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ");

      const userPayload = {
        fullname: formData.fullName, 
        first_name: firstName,       
        last_name: lastName,
        address: formData.address,
        phone_number: formData.phone_number,
      };

      const response = await UpdateUser(userPayload, user.ID);

      if (response.status === "success") {
        updateGlobalUser({
          ...user,
          first_name: firstName,
          last_name: lastName,
          address: formData.address,
          phone_number: formData.phone_number,
        });
        toast.success("Account information updated successfully");
      } else {
        throw new Error(response.message || "Failed to update profile");
      }

      // 2. Update Password
      if (passwords.oldPassword && passwords.newPassword) {
        const passwordResponse = await changePassword(
          passwords.oldPassword,
          passwords.newPassword,
          user.ID
        );

        if (passwordResponse.status === "success") {
          toast.success("Password changed successfully");
          setPasswords({ oldPassword: "", newPassword: "" });
        } else {
          toast.error(passwordResponse.message || "Failed to change password");
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred while updating settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-40 text-grey-medium">
        <p>Please log in to view account settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-grey-pastel">
          Account Settings
        </h2>
        {isRefreshing && (
           <span className="text-xs text-grey-medium flex items-center gap-2">
             <Loader2 className="w-3 h-3 animate-spin" /> Syncing...
           </span>
        )}
      </div>
      
      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-grey-pastel mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                placeholder="Enter your full name"
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-grey-pastel mb-2">
                House Address
              </label>
              <input
                type="text"
                value={formData.address}
                placeholder="Enter your address"
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-grey-pastel mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                placeholder="Enter your Phone Number"
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="pt-6 border-t border-dark-lighter">
            <h3 className="text-lg font-semibold text-grey-pastel mb-4">
              Change Password
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Current Password Field */}
              <div>
                <label className="block text-sm font-medium text-grey-pastel mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwords.oldPassword}
                    placeholder="••••••••"
                    onChange={(e) =>
                      setPasswords({ ...passwords, oldPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-10 rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-muted hover:text-grey-pastel transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-medium text-grey-pastel mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwords.newPassword}
                    placeholder="••••••••"
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-10 rounded-lg bg-dark-lighter border border-grey-muted text-grey-pastel focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-muted hover:text-grey-pastel transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}