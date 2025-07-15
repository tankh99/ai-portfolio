import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

import type { FormInputProps } from "./form-types";
import { FormTextInput, FormTextInputProps } from "./form-text-input";

// textInputProps make it so that when the checkbox is checked, a text input appears
export type FormCheckboxProps = FormInputProps 
& {
  textInputProps?: Omit<FormTextInputProps, "form">;
};

export function FormCheckbox(props: FormCheckboxProps) {
  const { form, name, label, textInputProps } = props;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="">
          <FormControl>
            <div>
              <div className="flex space-x-2 items-center">
                <Checkbox
                  checked={field.value}
                  id={name}
                  onCheckedChange={field.onChange}
                />
                {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
              </div>
              {textInputProps && field.value
                ? <FormTextInput form={form} {...textInputProps} />
                : null
              }
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
