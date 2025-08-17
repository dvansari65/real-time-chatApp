"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "./Button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
    >
      <ArrowLeft size={18} />
      Back
    </Button>
  );
}
