import { ValidationErrors } from "@/types";
import { useCallback, useState } from "react";

type Validator<T> = (values: T) => ValidationErrors;

export const useForm = <T extends object>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void,
  validate?: Validator<T>,
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value } as T));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const handleSubmit = useCallback(async () => {
    const nextErrors = validate ? validate(values) : {};

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      setErrors({});
      await onSubmit(values);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao processar formulario.";
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  }, [onSubmit, validate, values]);

  return {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
};
