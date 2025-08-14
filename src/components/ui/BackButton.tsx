"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}
