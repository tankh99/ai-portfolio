import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { FormInputProps } from "./form-types";

export type FormRadioButtonsProps = FormInputProps & {
  optionLabelKey: string;
  // The string that indexes the object's label and value
  optionValueKey: string;
  options: Array<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export function FormRadioButtons(props: FormRadioButtonsProps) {
  const { form, name, label, options, optionLabelKey, optionValueKey } = props;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value = field.value ? field.value.toString() : field.value;

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <RadioGroup
              className="space-y-2"
              onValueChange={(e) => field.onChange(e)}
            >
              {options ?
                options.map((option, index) => {
                  const optionLabel = option[optionLabelKey];
                  const optionValue = option[optionValueKey].toString();

                  return (
                    <div
                      key={optionLabel}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        key={optionValue}
                        checked={optionValue === value}
                        id={optionLabel}
                        value={optionValue}
                      />
                      <Label htmlFor={optionLabel}>{optionLabel}</Label>
                    </div>
                  );
                }): []}
            </RadioGroup>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
