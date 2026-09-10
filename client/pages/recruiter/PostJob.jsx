import { useReducer, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../src/customHooks/useFetch";
import { auth } from "../../src/firebase/firebase";

const jobTypes = [
  { label: "Full Time", value: "Full Time" },
  { label: "Part Time", value: "Part Time" },
  { label: "Internship", value: "Internship" },
  { label: "Contract", value: "Contract" },
];

const experienceLevels = [
  { label: "Fresher", value: "Fresher" },
  { label: "Entry Level", value: "Entry Level" },
  { label: "Mid Level", value: "Mid Level" },
  { label: "Senior Level", value: "Senior Level" },
];

const workModes = [
  { label: "Remote", value: "Remote" },
  { label: "On-site", value: "On-site" },
  { label: "Hybrid", value: "Hybrid" },
];

const initialState = {
  title: "",
  category: "",
  type: "",
  experience: "",
  location: "",
  mode: "",
  salaryMin: "",
  salaryMax: "",
  salaryPeriod: "year",
  description: "",
  responsibilities: "",
  requirements: "",
  skills: "",
  benefits: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "SET_JOB":
      return {
        ...state,
        ...action.payload,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export default function PostJob({ isEdit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingJob, setLoadingJob] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !id) {
      return;
    }

    const controller = new AbortController();

    async function fetchJob() {
      try {
        setLoadingJob(true);
        setError("");

        const firebaseUser = auth.currentUser;

        if (!firebaseUser) {
          throw new Error("Authentication required.");
        }

        const token = await firebaseUser.getIdToken();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/recruiter/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job.");
        }

        const job = data.job;

        dispatch({
          type: "SET_JOB",
          payload: {
            title: job.title || "",

            category: job.categoryId?._id || job.categoryId || "",

            type: job.type || "",
            experience: job.experience || "",
            location: job.location || "",
            mode: job.mode || "",

            salaryMin: job.salary?.min ?? "",
            salaryMax: job.salary?.max ?? "",
            salaryPeriod: job.salary?.period || "year",

            description: job.description || "",

            responsibilities: job.responsibilities?.join("\n") || "",

            requirements: job.requirements?.join("\n") || "",

            skills: job.skills?.join(", ") || "",

            benefits: job.benefits?.join("\n") || "",
          },
        });
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Fetch job error:", error);

        setError(error.message || "Failed to fetch job.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingJob(false);
        }
      }
    }

    fetchJob();

    return () => {
      controller.abort();
    };
  }, [isEdit, id]);

  const {
    data: categoriesData,
    loading: categoriesLoading,
  } = useFetch("/api/categories");

  const categories = categoriesData?.categories || [];

  function handleChange(e) {
    const { name, value } = e.target;

    dispatch({
      type: "UPDATE_FIELD",
      field: name,
      value,
    });

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { title, category, type, experience, location, mode, description } =
      formData;

    if (
      !title.trim() ||
      !category ||
      !type ||
      !experience ||
      !location.trim() ||
      !mode ||
      !description.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Authentication required.");
      }

      const token = await firebaseUser.getIdToken();

      const jobData = {
        title: formData.title.trim(),

        categoryId: formData.category,

        type: formData.type,
        experience: formData.experience,
        location: formData.location.trim(),
        mode: formData.mode,

        salary: {
          min: formData.salaryMin === "" ? null : Number(formData.salaryMin),

          max: formData.salaryMax === "" ? null : Number(formData.salaryMax),

          currency: "INR",
          period: formData.salaryPeriod,
        },

        description: formData.description.trim(),

        responsibilities: convertToArray(formData.responsibilities),

        requirements: convertToArray(formData.requirements),

        skills: convertToArray(formData.skills, ","),

        benefits: convertToArray(formData.benefits),
      };

      const endpoint = isEdit ? `/api/jobs/${id}` : "/api/jobs";

      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method,

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(jobData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEdit ? "Failed to update job." : "Failed to publish job."),
        );
      }

      if (!isEdit) {
        dispatch({
          type: "RESET",
        });
      }

      navigate("/recruiter/jobs");
    } catch (error) {
      console.error(isEdit ? "Update job error:" : "Create job error:", error);

      setError(
        error.message ||
          (isEdit ? "Failed to update job." : "Failed to publish job."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isEdit && loadingJob) {
    return (
      <main className="p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <p className="text-sm text-slate-500">Loading job...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {isEdit ? "Edit Job" : "Post a New Job"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {isEdit
              ? "Update the details of your job posting."
              : "Add the details below to publish a new opportunity."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <FormSection
            title="Basic Information"
            description="Provide the main details about this opportunity."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Frontend Developer"
                required
              />

              <SelectField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </SelectField>

              <SelectField
                label="Job Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select job type</option>

                {jobTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </SelectField>

              <SelectField
                label="Experience Level"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="">Select experience level</option>

                {experienceLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </SelectField>
            </div>
          </FormSection>

          <FormSection
            title="Location & Compensation"
            description="Specify where the role is based and the expected compensation."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Bengaluru, India"
                required
              />

              <SelectField
                label="Work Mode"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                required
              >
                <option value="">Select work mode</option>

                {workModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </SelectField>

              <div className="grid gap-5 sm:col-span-2 sm:grid-cols-3">
                <InputField
                  label="Minimum Salary"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="800000"
                  type="number"
                />

                <InputField
                  label="Maximum Salary"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="1200000"
                  type="number"
                />

                <SelectField
                  label="Salary Period"
                  name="salaryPeriod"
                  value={formData.salaryPeriod}
                  onChange={handleChange}
                >
                  <option value="year">Per Year</option>
                  <option value="month">Per Month</option>
                </SelectField>
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Job Details"
            description="Describe the role, responsibilities, requirements, and benefits."
          >
            <div className="space-y-5">
              <TextAreaField
                label="Job Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role and what the candidate will be working on..."
                required
              />

              <TextAreaField
                label="Responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder={`Build reusable React components
                     Collaborate with designers
                      Improve application performance`}
                helperText="Enter one responsibility per line."
              />

              <TextAreaField
                label="Requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder={`Strong JavaScript fundamentals
                     Experience with React Understanding of REST APIs`}
                helperText="Enter one requirement per line."
              />

              <TextAreaField
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Tailwind CSS, Git"
                helperText="Separate skills with commas."
              />

              <TextAreaField
                label="Benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder={`Flexible working hours
                     Health insurance
                      Learning allowance`}
                helperText="Enter one benefit per line."
              />
            </div>
          </FormSection>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#08C8B7] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? isEdit
                  ? "Saving..."
                  : "Publishing..."
                : isEdit
                  ? "Save Changes"
                  : "Publish Job"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function FormSection({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  children,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
      >
        {children}
      </select>
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  helperText,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={5}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
      />

      {helperText && (
        <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

function convertToArray(value, separator = "\n") {
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}
