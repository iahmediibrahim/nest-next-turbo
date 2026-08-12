"use client";
import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

interface LogoutButtonProps {
  label?: string;
}

export default function LogoutButton({ label = "Log out" }: LogoutButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" size="sm" aria-disabled={pending}>
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">
        {pending ? "Logging out…" : label}
      </span>
    </Button>
  );
}
