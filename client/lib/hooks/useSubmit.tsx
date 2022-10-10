import { useState } from "react";

interface useSubmitProps {
  onSubmit: () => void | Promise<void>;
  onError?: (error?: unknown) => void;
  onSuccess?: (data?: any) => void;
}

const useSubmit = ({ onSubmit, onError, onSuccess }: useSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const data = await onSubmit();
      onSuccess && onSuccess(data);
    } catch (e: unknown) {
      onError && onError(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};

export default useSubmit;
