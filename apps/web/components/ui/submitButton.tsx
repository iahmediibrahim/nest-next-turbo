"use client";
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

const SubmitButton = ({ children }: { children: ReactNode }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} className="w-full mt-2">
      {pending ? "Submitting..." : children}
    </Button>
  );
};
export default SubmitButton;
