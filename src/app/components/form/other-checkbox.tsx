import type { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";

import { Checkbox } from "../ui/checkbox";
import { FormField, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

import type { CheckboxOption } from "@/types/types";

type P = {
  field: ControllerRenderProps<FieldValues, string>;
  form: UseFormReturn<FieldValues>;
  name: string;
};

const OTHERS_KEY = "Other";

/**
 * An Other textbox that allows for custom user input when clicking on the Others checkbox
 * This component works by inserting at most one Other option into the array of options, and marks this option as !isOption
 * 
 * @param name The name of a field array property. The OtherCheckbox inserts itself into the array
 * @returns 
 */
export default function OtherCheckbox({ form, field, name }: P) {
  const checkedOptions: Array<CheckboxOption> = field.value;

  const isOthersChecked = checkedOptions?.some((opt) => !opt.isOption);

  const otherOption = checkedOptions.find((opt) => !opt.isOption);
  const otherOptionIndex = checkedOptions.findIndex((opt) => !opt.isOption);

  return (
    <div key={OTHERS_KEY} className="flex items-center space-x-2 w-full">
      <Checkbox
        // Checks the list of available options. If it doesn't exist inside this array,
        // then it is classified as "others"
        checked={isOthersChecked}
        id={`${name}-${OTHERS_KEY}`}
        onCheckedChange={(checked) => {
          if (checked) {
            // if checked, add it to the value array
            field.onChange(
              checkedOptions.concat({
                id: undefined,
                isOption: false,
                name: "",
              }),
            );
          } else {
            // if unchecked, remove it from the value array

            // FIXME: Currently, there is a known issue where the other text is not immediately reset
            // upon unchecking of the Other checkbox, and only taking effect AFTER the user checks again
            // Leaving this issue to be fixed later on
            field.value[otherOptionIndex].name = "";

            const filteredOptions = field.value?.filter(
              (opt: CheckboxOption) => opt.isOption,
            );

            field.onChange(filteredOptions);
          }
        }}
      />
      <FormLabel htmlFor={`${name}-${OTHERS_KEY}`}>Other</FormLabel>
      <FormField
        control={form.control}
        name={`${name}.${otherOptionIndex}.name`}
        // We ignore the field in render because we only instantiate the FormField here to get the appropriate
        // FormMessage. Updating via the text field directly doesn't seem to work
        render={() => (
          <div className="flex flex-col gap-y-2">
            <Input
              // className='bg-slate-600'
              disabled={!isOthersChecked}
              value={otherOption?.name}
              onChange={(e) =>
                field.onChange(
                  field.value.map((opt: CheckboxOption) => {
                    // Update the text of the Other option directly.
                    // Doing a simple Input with name of `${name}.${otherOptionIndex}.name` doesn't work
                    if (!opt.isOption) {
                      opt.name = e.target.value;
                    }

                    return opt;
                  }),
                )
              }
            />
            <FormMessage />
          </div>
        )}
      />
    </div>
  );
}
