import { useState } from "react";
import { useAuth } from "../src/customHooks/useAuth";
import { auth } from "../src/firebase/firebase";
import {
  BriefcaseBusiness,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
} from "lucide-react";

export default function Profile() {
  const { user, refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    headline: "",
    experience: "",
    skills: "",
  });
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [viewingResume, setViewingResume] = useState(false);

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      location: user?.location || "",
      headline: user?.headline || "",
      experience: user?.experience || "",
      skills: user?.skills?.join(", ") || "",
    });

    setError("");
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Authentication required.");
      }

      const token = await firebaseUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            location: formData.location.trim(),
            headline: formData.headline.trim(),
            experience: formData.experience,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      await refreshUser();

      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);

      setError(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setResumeError("Please upload a PDF, DOC, or DOCX file.");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size >= maxSize) {
      setResumeError("Resume must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploadingResume(true);
      setResumeError("");

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Authentication required.");
      }

      const token = await firebaseUser.getIdToken();

      const formData = new FormData();

      formData.append("resume", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload resume.");
      }

      await refreshUser();
    } catch (error) {
      console.error("Resume upload error:", error);

      setResumeError(error.message || "Failed to upload resume.");
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleViewResume = async () => {
    const resumeWindow = window.open("", "_blank");

    try {
      setViewingResume(true);
      setResumeError("");

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Authentication required.");
      }

      const token = await firebaseUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/resume`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.message || "Failed to fetch resume.");
      }

      const blob = await response.blob();

      const resumeUrl = URL.createObjectURL(blob);

      if (resumeWindow) {
        resumeWindow.location.href = resumeUrl;
      } else {
        throw new Error("Unable to open resume. Please allow pop-ups.");
      }

      setTimeout(() => {
        URL.revokeObjectURL(resumeUrl);
      }, 60000);
    } catch (error) {
      if (resumeWindow) {
        resumeWindow.close();
      }

      console.error("View resume error:", error);

      setResumeError(error.message || "Failed to view resume.");
    } finally {
      setViewingResume(false);
    }
  };

  return (
    <main className="bg-[#F8F9FA] pb-16">
      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Manage your personal information and career details.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#08C8B7]/10">
                <User className="h-9 w-9 text-[#08C8B7]" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {user?.name || "Candidate"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {user?.headline || "Job Seeker"}
              </p>
            </div>

            <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
              <ProfileInfo
                icon={Mail}
                label="Email"
                value={user?.email || "Not provided"}
              />

              <ProfileInfo
                icon={Phone}
                label="Phone"
                value={user?.phone || "Not provided"}
              />

              <ProfileInfo
                icon={MapPin}
                label="Location"
                value={user?.location || "Not provided"}
              />
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Basic information associated with your account.
                  </p>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#08C8B7] hover:text-[#08C8B7]"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <ProfileInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <div>
                    <label
                      htmlFor="email"
                      className="text-xs font-medium uppercase tracking-wide text-slate-400"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
                    />
                  </div>

                  <ProfileInput
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <ProfileInput
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <DetailItem
                    label="Full Name"
                    value={user?.name || "Not provided"}
                  />

                  <DetailItem
                    label="Email Address"
                    value={user?.email || "Not provided"}
                  />

                  <DetailItem
                    label="Phone Number"
                    value={user?.phone || "Not provided"}
                  />

                  <DetailItem
                    label="Location"
                    value={user?.location || "Not provided"}
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-[#08C8B7]" />

                <h2 className="text-lg font-semibold text-slate-900">
                  Career Information
                </h2>
              </div>

              {isEditing ? (
                <>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <ProfileInput
                      label="Professional Headline"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                    />

                    <div>
                      <label
                        htmlFor="experience"
                        className="text-xs font-medium uppercase tracking-wide text-slate-400"
                      >
                        Experience Level
                      </label>

                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
                      >
                        <option value="">Select experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <ProfileInput
                      label="Skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      Separate skills with commas.
                    </p>
                  </div>

                  {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-xl bg-[#08C8B7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#07B6A7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <DetailItem
                      label="Professional Headline"
                      value={user?.headline || "Not provided"}
                    />

                    <DetailItem
                      label="Experience Level"
                      value={user?.experience || "Not provided"}
                    />
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Skills
                    </p>

                    {user?.skills?.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {user.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-[#08C8B7]/10 px-3 py-1.5 text-xs font-medium text-[#059F92]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        No skills added yet.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Resume
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload your latest resume to use when applying for jobs.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  className="hidden"
                />

                <label
                  htmlFor="resume"
                  className={`inline-flex cursor-pointer items-center rounded-xl bg-[#08C8B7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#07B6A7] ${
                    uploadingResume
                      ? "pointer-events-none cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                >
                  {uploadingResume ? "Uploading..." : "Upload Resume"}
                </label>

                <p className="mt-3 text-xs text-slate-400">PDF, DOC or DOCX</p>
                {resumeError && (
                  <p className="mt-3 text-sm text-red-600">{resumeError}</p>
                )}
                {user?.resumeFileId && (
                  <button
                    type="button"
                    onClick={handleViewResume}
                    disabled={viewingResume}
                    className="mt-4 inline-block text-sm font-semibold text-[#08C8B7] transition hover:text-[#07B6A7] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {viewingResume
                      ? "Opening Resume..."
                      : "View Current Resume"}
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="mt-0.5 break-words text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

function ProfileInput({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-xs font-medium uppercase tracking-wide text-slate-400"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
      />
    </div>
  );
}
