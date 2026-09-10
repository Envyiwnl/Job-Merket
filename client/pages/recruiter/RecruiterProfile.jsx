import { useAuth } from "../../src/customHooks/useAuth";
import { useState } from "react";
import { auth } from "../../src/firebase/firebase";
import {
  Building2,
  Globe,
  Mail,
  Pencil,
  Phone,
  UserRound,
} from "lucide-react";

export default function RecruiterProfile() {
  const { user, refreshUser } = useAuth();
  const [editingSection, setEditingSection] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    position: "",

    companyName: "",
    website: "",
    industry: "",
    size: "",
    location: "",
    description: "",
    workModes: [],
  });
  const company = user?.companyId;
  const companyLogoSrc = company?.logoFileId
    ? `${import.meta.env.VITE_API_URL}/api/companies/${company._id}/logo?v=${
        company.updatedAt || ""
      }`
    : company?.logoUrl || "";

  const handleEditRecruiter = () => {
    setFormData((prev) => ({
      ...prev,
      name: user?.name || "",
      phone: user?.phone || "",
      position: user?.position || "",
    }));

    setError("");
    setEditingSection("recruiter");
  };

  const handleEditCompany = () => {
    setFormData((prev) => ({
      ...prev,
      companyName: company?.name || "",
      website: company?.website || "",
      industry: company?.industry || "",
      size: company?.size || "",
      location: company?.location || "",
      description: company?.description || "",
      workModes: company?.workModes || [],
    }));

    setError("");
    setEditingSection("company");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkModeChange = (mode) => {
    setFormData((prev) => ({
      ...prev,

      workModes: prev.workModes.includes(mode)
        ? prev.workModes.filter((currentMode) => currentMode !== mode)
        : [...prev.workModes, mode],
    }));
  };

  const handleCancel = () => {
    setEditingSection("");
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Authentication required.");
      }

      const token = await firebaseUser.getIdToken();

      const payload =
        editingSection === "recruiter"
          ? {
              name: formData.name,
              phone: formData.phone,
              position: formData.position,
            }
          : {
              companyName: formData.companyName,
              website: formData.website,
              industry: formData.industry,
              size: formData.size,
              location: formData.location,
              description: formData.description,
              workModes: formData.workModes,
            };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/recruiter-profile`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update recruiter profile.");
      }

      await refreshUser();

      setEditingSection("");
    } catch (error) {
      console.error("Recruiter profile update error:", error);

      setError(error.message || "Failed to update recruiter profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setLogoError("Please upload a PNG, JPG, JPEG, or WEBP image.");

      e.target.value = "";
      return;
    }

    if (file.size >= 2 * 1024 * 1024) {
      setLogoError("Company logo must be smaller than 2 MB.");

      e.target.value = "";
      return;
    }

    try {
      setUploadingLogo(true);
      setLogoError("");

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Authentication required.");
      }

      const token = await firebaseUser.getIdToken();

      const formData = new FormData();

      formData.append("logo", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/company-logo`,
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
        throw new Error(data.message || "Failed to upload company logo.");
      }

      await refreshUser();
    } catch (error) {
      console.error("Company logo upload error:", error);

      setLogoError(error.message || "Failed to upload company logo.");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  return (
    <main className="p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Recruiter Profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage your recruiter information and company details.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#08C8B7]/10">
                <UserRound className="h-9 w-9 text-[#08C8B7]" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {user?.name || "Recruiter"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {user?.position || "Recruiter"}
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
                icon={Building2}
                label="Company"
                value={company?.name || "Not provided"}
              />
            </div>
          </aside>

          <section className="space-y-6">
            <ProfileSection
              title="Recruiter Information"
              description="Your personal and professional information."
              onEdit={handleEditRecruiter}
              isEditing={editingSection === "recruiter"}
            >
              {editingSection === "recruiter" ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <ProfileInput
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Email Address
                      </p>

                      <input
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
                      label="Position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                    />
                  </div>

                  {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-xl bg-[#08C8B7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#07B6A7] disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
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
                    label="Position"
                    value={user?.position || "Not provided"}
                  />
                </div>
              )}
            </ProfileSection>

            <ProfileSection
              title="Company Information"
              description="Information candidates will see about your company."
              onEdit={handleEditCompany}
              isEditing={editingSection === "company"}
            >
              <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {companyLogoSrc ? (
                    <img
                      src={companyLogoSrc}
                      alt={`${company?.name || "Company"} logo`}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-slate-400" />
                  )}
                </div>

                <div>
                  <input
                    id="company-logo"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo || !company?._id}
                    className="hidden"
                  />

                  <label
                    htmlFor="company-logo"
                    className={`inline-flex rounded-xl bg-[#08C8B7] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#07B6A7] ${
                      uploadingLogo || !company?._id
                        ? "pointer-events-none opacity-60"
                        : "cursor-pointer"
                    }`}
                  >
                    {uploadingLogo
                      ? "Uploading..."
                      : company?.logoFileId
                        ? "Replace Logo"
                        : "Upload Logo"}
                  </label>

                  {!company?._id && (
                    <p className="mt-2 text-xs text-slate-400">
                      Save your company information before uploading a logo.
                    </p>
                  )}

                  {logoError && (
                    <p className="mt-2 text-sm text-red-600">{logoError}</p>
                  )}
                </div>
              </div>

              {editingSection === "company" ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <ProfileInput
                      label="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                    />

                    <ProfileInput
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                    />

                    <ProfileInput
                      label="Industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                    />

                    <ProfileInput
                      label="Company Size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                    />

                    <ProfileInput
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="description"
                      className="text-xs font-medium uppercase tracking-wide text-slate-400"
                    >
                      Company Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
                    />
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Work Modes
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4">
                      {["Remote", "On-site", "Hybrid"].map((mode) => (
                        <label
                          key={mode}
                          className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={formData.workModes.includes(mode)}
                            onChange={() => handleWorkModeChange(mode)}
                            className="h-4 w-4 accent-[#08C8B7]"
                          />

                          {mode}
                        </label>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-xl bg-[#08C8B7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#07B6A7] disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <DetailItem
                      label="Company Name"
                      value={company?.name || "Not provided"}
                    />

                    <DetailItem
                      label="Industry"
                      value={company?.industry || "Not provided"}
                    />

                    <DetailItem
                      label="Company Size"
                      value={company?.size || "Not provided"}
                    />

                    <DetailItem
                      label="Location"
                      value={company?.location || "Not provided"}
                    />
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Website
                    </p>

                    {company?.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 inline-flex items-center gap-2 text-sm font-medium text-[#08C8B7] hover:text-[#07B6A7]"
                      >
                        <Globe className="h-4 w-4" />
                        {company.website}
                      </a>
                    ) : (
                      <p className="mt-1.5 text-sm font-medium text-slate-700">
                        Not provided
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Work Modes
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-slate-700">
                      {company?.workModes?.length
                        ? company.workModes.join(", ")
                        : "Not provided"}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Company Description
                    </p>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {company?.description || "Not provided"}
                    </p>
                  </div>
                </>
              )}
            </ProfileSection>
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileSection({ title, description, children, onEdit, isEditing }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#08C8B7] hover:text-[#08C8B7]"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        )}
      </div>

      <div className="mt-6">{children}</div>
    </section>
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
