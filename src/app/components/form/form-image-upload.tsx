'use client';

import { useState } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileInput } from "@/components/ui/file-input";

import { clientPatch } from "@/api/base";

import type { FormInputProps } from "./form-types";
import { Spinner } from "../ui/spinner";
import { useToast } from "@/hooks/use-toast";

type FormFileUploadProps = FormInputProps & {
  acceptedFileTypes: string;
  fileUploadEndpoint: string;
  isImage: boolean;
  limit?: number;
};

export function FormImageUpload(props: FormFileUploadProps) {
  const { form, name, label, fileUploadEndpoint, acceptedFileTypes, limit } =
    props;

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const {toast} = useToast();
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const files = e.target.files;
    const currFiles = form.getValues()["images"]
    if (limit && currFiles.length + files.length > limit) {
      toast({
        variant: "destructive",
        title: `You can upload only a maximum of ${limit} images`
      })
      return;
    }

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        const file = files[i];
        formData.append("file", file);
        const res = await clientPatch(fileUploadEndpoint, formData);
        const urls = res.data;
        form.setValue(name, urls);
    }


    setIsUploading(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormControl>
              <div className="relative h-full">
                <div className="space-y-2 h-full">
                  <FileInput
                    multiple
                    loading={isUploading}
                    accept={acceptedFileTypes}
                    id="image"
                    type="file"
                    label={label?.toString() ?? ""}
                    description="Select up to 10 images"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
