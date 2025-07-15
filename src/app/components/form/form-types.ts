import type { ReactNode } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormInputProps = {
  form: any;
  inputProps?: Record<string, any>;
  isDisabled?: boolean;
  label: ReactNode;
  name: string;
  placeholder?: string;
};
