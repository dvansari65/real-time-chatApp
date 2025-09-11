"use client";

import React from "react";

type MessageSkeletonProps = {
  messageCount?: number;
};

export default function MessageSkeleton({ messageCount = 6 }: MessageSkeletonProps) {
  const items = Array.from({ length: messageCount }).map((_, i) => i);

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
      {items.map((idx) => {
        const isLeft = idx % 2 === 0;
        return (
          <div
            key={idx}
            className={`flex items-start gap-3 ${isLeft ? "justify-start" : "justify-end"}`}
          >
            {isLeft && (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
            )}

            <div className={`max-w-[80%] flex flex-col ${isLeft ? "items-start" : "items-end"}`}>
              <div className={`rounded-2xl p-3 ${isLeft ? "rounded-tl-none" : "rounded-tr-none"} bg-gray-200 dark:bg-gray-700 animate-pulse`} style={{ minWidth: 120 }}>
                <div className="h-3 w-36 rounded-md bg-gray-300 dark:bg-gray-600 mb-2" />
                <div className="h-3 w-24 rounded-md bg-gray-300 dark:bg-gray-600" />
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <div className="h-3 w-12 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
                <div className="h-3 w-8 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
              </div>
            </div>

            {!isLeft && (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
