import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { FormInputProps } from "./form-types";

export type FormSelectInputProps = FormInputProps & {
  optionLabelKey: string;
  // The strins that indexes the object's label and value
  optionValueKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Array<any>;
  selectProps?: Record<string, unknown>;
};

export function FormSelect(props: FormSelectInputProps) {
  const {
    form,
    name,
    label,
    placeholder,
    options,
    optionLabelKey,
    optionValueKey,
    selectProps,
  } = props;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              value={field.value ? field.value.toString() : undefined}
              onValueChange={(e) => {
                field.onChange(e);
              }}
              {...selectProps}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options
                  ? options.map((option) => {
                      const optionLabel = option[optionLabelKey];
                      const optionValue = option[optionValueKey].toString();

                      return (
                        <SelectItem key={optionValue} value={optionValue}>
                          {optionLabel}
                        </SelectItem>
                      );
                    })
                  : []}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
