import { ValidationError } from "@/types";
import { useCallback, useState } from "react";

interface UseFormState {
  values: Record<string, any>;
  errors: ValidationError;
  touched: Record<string, boolean>;
}

export const useForm = (
  initialValues: Record<string, any>,
  onSubmit: (values: Record<string, any>) => Promise<void> | void,
) => {
  const [state, setState] = useState<UseFormState>({
    values: initialValues,
    errors: {},
    touched: {},
  });
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((field: string, value: any) => {
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value,
      },
    }));
  }, []);

  const handleBlur = useCallback((field: string) => {
    setState((prev) => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));
  }, []);

  const setError = useCallback((field: string, message: string) => {
    setState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: message,
      },
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errors: {},
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      clearErrors();
      await onSubmit(state.values);
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
      if (error instanceof Error) {
        setError("submit", error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [state.values, onSubmit, clearErrors, setError]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    loading,
    handleChange,
    handleBlur,
    setError,
    clearErrors,
    handleSubmit,
  };
};
