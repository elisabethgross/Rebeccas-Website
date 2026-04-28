import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToSectionId(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const navHeight = 80; // Fixed nav bar height
  // Land the top of the section in the top quarter of the viewport.
  // Ensure the offset still clears the fixed nav bar with some breathing room.
  const topQuarterOffset = Math.max(window.innerHeight / 4, navHeight + 16);

  const elementTop =
    element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const target = Math.min(
    Math.max(0, elementTop - topQuarterOffset),
    maxScroll
  );

  window.scrollTo({ top: target, behavior: "smooth" });
}
