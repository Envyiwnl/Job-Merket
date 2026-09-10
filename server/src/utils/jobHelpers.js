export const allowedJobTypes = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
];

export const allowedExperience = [
  "Fresher",
  "Entry Level",
  "Mid Level",
  "Senior Level",
];

export const allowedModes = ["Remote", "On-site", "Hybrid"];

export function toArray(value) {
  if (!value) return [];

  return Array.isArray(value) ? value : [value];
}

export function cleanArray(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.map((value) => value.trim()).filter(Boolean);
}

export function parseSalary(salary) {
  const min =
    salary?.min !== undefined && salary?.min !== null && salary?.min !== ""
      ? Number(salary.min)
      : null;

  const max =
    salary?.max !== undefined && salary?.max !== null && salary?.max !== ""
      ? Number(salary.max)
      : null;

  return {
    min,
    max,
    currency: salary?.currency || "INR",
    period: salary?.period || "year",
  };
}

export function validateSalary(salary) {
  const { min, max, period } = salary;

  if (
    (min !== null && Number.isNaN(min)) ||
    (max !== null && Number.isNaN(max))
  ) {
    return "Salary must be a valid number.";
  }

  if ((min !== null && min < 0) || (max !== null && max < 0)) {
    return "Salary cannot be negative.";
  }

  if (min !== null && max !== null && min > max) {
    return "Minimum salary cannot exceed maximum salary.";
  }

  if (!["year", "month"].includes(period)) {
    return "Invalid salary period.";
  }

  return null;
}
