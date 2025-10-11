"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

export interface AnimatedTabsProps {
  tabs: { label: string; icon?: React.ReactNode }[];
  onTabChange?: (label: string) => void;
}

export function AnimatedTabs({ tabs, onTabChange }: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  const handleTabChange = (label: string) => {
    setActiveTab(label);
    onTabChange?.(label);
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container && activeTab) {
      const activeTabElement = activeTabRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;

        const clipLeft = offsetLeft + 16;
        const clipRight = offsetLeft + offsetWidth + 16;

        container.style.clipPath = `inset(0 ${Number(
          100 - (clipRight / container.offsetWidth) * 100,
        ).toFixed()}% 0 ${Number(
          (clipLeft / container.offsetWidth) * 100,
        ).toFixed()}% round 17px)`;
      }
    }
  }, [activeTab]);

  return (
    <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 mx-auto flex w-fit flex-col items-center rounded-full py-2 px-4 shadow-sm">
      <div
        ref={containerRef}
        className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
      >
        <div className="relative flex w-full justify-center bg-[#2C3E50]">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(tab.label)}
              className="flex h-8 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white"
              tabIndex={-1}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex w-full justify-center">
        {tabs.map(({ label, icon }, index) => {
          const isActive = activeTab === label;

          return (
            <button
              key={index}
              ref={isActive ? activeTabRef : null}
              onClick={() => handleTabChange(label)}
              className="flex h-8 items-center gap-2 cursor-pointer rounded-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {icon && <span className="flex-shrink-0">{icon}</span>}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
