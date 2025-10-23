"use client";

import { FileUpload } from "@ark-ui/react/file-upload";
import { FileText, X } from "lucide-react";

interface PdfUploadProps {
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

export default function PdfUpload({ onFilesChange, disabled }: PdfUploadProps) {
  return (
    <FileUpload.Root
      maxFiles={1}
      maxFileSize={5 * 1024 * 1024} // 5MB
      accept="application/pdf"
      className="w-full space-y-4"
      onFileChange={(details) => {
        onFilesChange(details.acceptedFiles);
      }}
      disabled={disabled}
    >
      <FileUpload.Context>
        {({ acceptedFiles }) => (
          <>
            {/* Dropzone */}
            <FileUpload.Dropzone className="w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center py-12 px-6 hover:bg-gray-100 transition-colors cursor-pointer">
              {/* File Icon */}
              <div className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>

              {/* Text */}
              <div className="text-center space-y-2">
                <h3 className="text-sm font-medium text-gray-900">
                  Upload PDF Document
                </h3>
                <p className="text-sm text-gray-600">
                  Drag & drop or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  PDF only • Max 5MB • Supports scanned documents
                </p>
              </div>
            </FileUpload.Dropzone>

            {/* Files List */}
            {acceptedFiles.length > 0 && (
              <div className="space-y-3">
                <FileUpload.ItemGroup>
                  {acceptedFiles.map((file) => (
                    <FileUpload.Item key={file.name} file={file}>
                      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                        {/* File Icon */}
                        <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-gray-600" />
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <FileUpload.ItemName className="text-sm font-medium text-gray-900 truncate" />
                          <FileUpload.ItemSizeText className="text-xs text-gray-500" />
                        </div>

                        {/* Delete Button */}
                        <FileUpload.ItemDeleteTrigger className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0">
                          <X className="w-4 h-4" />
                        </FileUpload.ItemDeleteTrigger>
                      </div>
                    </FileUpload.Item>
                  ))}
                </FileUpload.ItemGroup>
              </div>
            )}
          </>
        )}
      </FileUpload.Context>

      <FileUpload.HiddenInput />
    </FileUpload.Root>
  );
}
