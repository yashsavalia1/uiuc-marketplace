import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: "accurate" | "normal"
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
    }`
}

export const tagInputStyles = {
  inlineTagsContainer: "flex flex-row flex-wrap items-center gap-2 w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm outline-1 focus-within:outline p-1 min-h-11",
  input: "shadow-none placeholder:text-slate-500 h-9",
  tag: {
    body: "transition-all border inline-flex items-center pl-2 bg-slate-100 text-secondary-foreground hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:opacity-50 text-sm h-8 rounded-sm border-solid cursor-default animate-fadeIn font-normal"
  }
}
