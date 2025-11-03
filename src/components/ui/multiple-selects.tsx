"use client";

import {
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type TTag = {
  key: string;
  name: string;
};

type MultipleSelectProps = {
  tags: TTag[];
  customTag?: (item: TTag) => ReactNode | string;
  onChange?: (value: TTag[]) => void;
  defaultValue?: TTag[];
  showLabel?: boolean;
};

export const MultipleSelect = ({
  tags,
  customTag,
  onChange,
  defaultValue,
  showLabel = true,
}: MultipleSelectProps) => {
  const [selected, setSelected] = useState<TTag[]>(defaultValue ?? []);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollBy({
        left: containerRef.current?.scrollWidth,
        behavior: "smooth",
      });
    }
    onValueChange(selected);
  }, [selected]);

  const onValueChange = (value: TTag[]) => {
    onChange?.(value);
  };

  const onSelect = (item: TTag) => {
    setSelected((prev) => [...prev, item]);
  };

  const onDeselect = (item: TTag) => {
    setSelected((prev) => prev.filter((i) => i !== item));
  };

  return (
    <TooltipProvider delayDuration={300}>
      <AnimatePresence mode={"popLayout"}>
        <div className={"flex w-full flex-col gap-2"}>
          {showLabel && <strong>TAGS</strong>}
          <motion.div
            layout
            ref={containerRef}
            className="selected flex w-full min-h-[3rem] max-h-32 overflow-y-auto rounded-md border border-solid border-gray-200 bg-gray-50 p-2"
          >
            <motion.div layout className="flex flex-wrap items-center gap-2 w-full">
              {selected?.map((item) => (
                <Tooltip key={item?.key}>
                  <TooltipTrigger asChild>
                    <Tag
                      name={item?.key}
                      className={"bg-white shadow"}
                    >
                      <div className="flex items-center gap-1 max-w-[200px]">
                        <motion.span layout className="truncate text-sm">
                          {item?.name}
                        </motion.span>
                        <button
                          className="flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeselect(item);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </Tag>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{item?.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </motion.div>
          </motion.div>
          {tags?.length > selected?.length && (
            <div className="flex w-full flex-wrap gap-2 rounded-md border border-solid border-gray-200 p-2 max-h-64 overflow-y-auto">
              {tags
                ?.filter((item) => !selected?.some((i) => i.key === item.key))
                .map((item) => (
                  <Tooltip key={item?.key}>
                    <TooltipTrigger asChild>
                      <Tag
                        name={item?.key}
                        onClick={() => onSelect(item)}
                      >
                        {customTag ? (
                          customTag(item)
                        ) : (
                          <motion.span layout className="truncate max-w-[200px] text-sm block">
                            {item?.name}
                          </motion.span>
                        )}
                      </Tag>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{item?.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          )}
        </div>
      </AnimatePresence>
    </TooltipProvider>
  );
};

type TagProps = PropsWithChildren &
  Pick<HTMLAttributes<HTMLDivElement>, "onClick"> & {
    name?: string;
    className?: string;
  };

export const Tag = ({ children, className, name, onClick }: TagProps) => {
  return (
    <motion.div
      layout
      layoutId={name}
      onClick={onClick}
      className={`cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-sm inline-flex items-center ${className}`}
    >
      {children}
    </motion.div>
  );
};
