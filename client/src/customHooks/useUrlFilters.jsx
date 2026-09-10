import { useSearchParams } from "react-router-dom";

export default function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParam = (paramName, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    params.delete("page");

    setSearchParams(params);
  };

  const toggleParam = (paramName, value) => {
    const params = new URLSearchParams(searchParams);

    const currentValues = params.getAll(paramName);

    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    params.delete(paramName);

    updatedValues.forEach((item) => {
      params.append(paramName, item);
    });

    params.delete("page");

    setSearchParams(params);
  };

  const clearParams = (paramNames) => {
    const params = new URLSearchParams(searchParams);

    paramNames.forEach((paramName) => {
      params.delete(paramName);
    });

    params.delete("page");

    setSearchParams(params);
  };

  const setParams = (values) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(values).forEach(([paramName, value]) => {
      if (value) {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }
    });

    params.delete("page");

    setSearchParams(params);
  };

  return {
    searchParams,
    setSearchParams,
    setParam,
    setParams,
    toggleParam,
    clearParams,
  };
}
