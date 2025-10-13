import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import { toast } from "@/lib/toast";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

interface FileUploadProps {
  onChange?: (file: File | null) => void;
  selectedFile?: File | null;
  disabled?: boolean;
  maxSize?: number; // en bytes, défaut 10MB
  acceptedTypes?: string[]; // ex: ['.pdf', '.doc', '.docx', '.txt']
  compact?: boolean; // Mode compact pour modal/drawer
}

export const FileUpload = ({
  onChange,
  selectedFile,
  disabled = false,
  maxSize = 10 * 1024 * 1024, // 10MB par défaut
  acceptedTypes = [".pdf", ".doc", ".docx", ".txt"],
  compact = false,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Vérifier la taille
    if (file.size > maxSize) {
      toast({
        variant: "error",
        message: `Le fichier est trop volumineux. Taille maximale : ${(maxSize / (1024 * 1024)).toFixed(0)} MB`,
      });
      return false;
    }

    // Vérifier le type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      toast({
        variant: "error",
        message: `Type de fichier non supporté. Types acceptés : ${acceptedTypes.join(", ").toUpperCase()}`,
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const file = newFiles[0]; // On prend seulement le premier fichier

    if (validateFile(file)) {
      onChange && onChange(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange && onChange(null);
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    disabled,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    onDrop: handleFileChange,
    onDropRejected: () => {
      toast({
        variant: "error",
        message: "Fichier rejeté. Vérifiez le type et la taille du fichier.",
      });
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className={cn(
          "group/file block rounded-lg cursor-pointer w-full relative overflow-hidden",
          compact ? "p-4" : "p-10"
        )}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        {!compact && (
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>
        )}
        <div className="flex flex-col items-center justify-center">
          <p className={cn(
            "relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300",
            compact ? "text-sm" : "text-base"
          )}>
            Upload file
          </p>
          <p className={cn(
            "relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 mt-2",
            compact ? "text-xs" : "text-base"
          )}>
            Drag or drop your files here or click to upload
          </p>
          <div className={cn(
            "relative w-full max-w-xl mx-auto",
            compact ? "mt-4" : "mt-10"
          )}>
            {selectedFile && (
              <motion.div
                layoutId="file-upload"
                className={cn(
                  "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start w-full mx-auto rounded-md shadow-sm",
                  compact ? "p-3 mt-2" : "p-4 mt-4 md:h-24"
                )}
              >
                <div className="flex justify-between w-full items-center gap-4">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                  >
                    {selectedFile.name}
                  </motion.p>
                  <div className="flex items-center gap-2">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                    >
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                    <button
                      onClick={handleRemove}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                      type="button"
                    >
                      <X className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    </button>
                  </div>
                </div>

                <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                  >
                    {selectedFile.type}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                  >
                    modified{" "}
                    {new Date(selectedFile.lastModified).toLocaleDateString()}
                  </motion.p>
                </div>
              </motion.div>
            )}
            {!selectedFile && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center mx-auto rounded-md shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                  compact ? "h-20 mt-2 w-full max-w-[6rem]" : "h-32 mt-4 w-full max-w-[8rem]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!selectedFile && (
              <motion.div
                variants={secondaryVariant}
                className={cn(
                  "absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center mx-auto rounded-md",
                  compact ? "h-20 mt-2 w-full max-w-[6rem]" : "h-32 mt-4 w-full max-w-[8rem]"
                )}
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        }),
      )}
    </div>
  );
}
