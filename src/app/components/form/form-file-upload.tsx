'use client';

import { useState } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { clientPatch } from "@/api/base";

import type { FormInputProps } from "./form-types";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import Image from "next/image";

type FormFileUploadProps = FormInputProps & {
  acceptedFileTypes: string;
  fileUploadEndpoint: string;
  isImage: boolean;
};

export function FormFileUpload(props: FormFileUploadProps) {
  const { form, name, label, fileUploadEndpoint, acceptedFileTypes, isImage } =
    props;

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);

    const file = e.target.files![0];
    const formData = new FormData();

    formData.append("file", file);

    const res = await clientPatch(fileUploadEndpoint, formData);

    const url = res.data
    form.setValue(name, url);

    setIsUploading(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {isImage
              ? (
                <div className="relative">
                  {field.value && (
                    <Image
                      alt="Uploaded image"
                      className={`max-h-96 mx-auto ${isUploading && "blur"
                        }`}
                      src={field.value}
                    />
                  )}
                  <Spinner
                    className="absolute top-1/2 left-1/2"
                    show={isUploading}
                  />
                </div>
              )
              : (
                field.value && (
                  <div className="p-2 mb-4 border-2">
                    <Link
                      href={field.value}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View uploaded file
                    </Link>
                  </div>
                )
              )
            }
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="space-y-2">
                  <Input
                    accept={acceptedFileTypes}
                    id="image"
                    type="file"
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
