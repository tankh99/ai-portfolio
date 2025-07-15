"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker";

import type { FormInputProps } from "./form-types";

type FormDateTimePickerProps = FormInputProps;

/** Source: https://time.openstatus.dev/ */
export function FormDateTimePicker({
  form,
  label,
  name,
  isDisabled = false,
}: FormDateTimePickerProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-left">{label}</FormLabel>
          <Popover>
            <FormControl>
              <PopoverTrigger asChild={true}>
                <Button
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  disabled={isDisabled}
                  variant="outline"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "PPP HH:mm")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
            </FormControl>
            <PopoverContent className="w-auto p-0">
              <div className="p-3 border-t border-border">
                <TimePicker date={field.value} setDate={field.onChange} />
              </div>
              <Calendar
                initialFocus={true}
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
