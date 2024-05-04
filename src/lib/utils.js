import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "@/components/ui/use-toast";
import { EntityError } from "@/lib/http";
import jwt from "jsonwebtoken";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({ error, setError, duration }) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

export const normalizePath = (path) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const decodeJWT = (token) => {
  return jwt.decode(token);
};
