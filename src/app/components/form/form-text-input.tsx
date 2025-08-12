import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import TextareaAutosize from 'react-textarea-autosize'
import type { FormInputProps } from "./form-types";

export type FormTextInputProps = FormInputProps & {
  description?: string;
  multiline?: boolean;
  type?: string;
};

export function FormTextInput(props: FormTextInputProps) {
  const {
    form,
    name,
    label,
    inputProps,
    placeholder,
    description,
    multiline,
    type = "text",
  } = props;

  const {containerClassName, className, ...inputPropsRest} = inputProps || {}
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={containerClassName || ""}>
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
            <FormControl>
              {/* Using onInput because onChange doesn't trigger when autofilling information */}
              {multiline ? (
                <TextareaAutosize
                  minRows={1}
                  maxRows={8}
                  placeholder={placeholder}
                  {...field}
                  {...inputPropsRest}
                  className={
                    (className || "")
                  }
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      // If you want to submit the form here, you need to call the submit handler.
                      // You may need to pass a prop for this, or handle it at the parent level.
                    }
                    if (inputProps?.onKeyDown) inputProps.onKeyDown(e);
                  }}
                />
              ) : (
                <Input
                  placeholder={placeholder}
                  {...field}
                  {...inputProps}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
