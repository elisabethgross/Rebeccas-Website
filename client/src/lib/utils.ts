import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToSectionId(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const navHeight = 80; // Fixed nav bar height
  const breathingRoom = 20; // Land the section a little below the nav for visual comfort

  const elementTop =
    element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const target = Math.min(
    Math.max(0, elementTop - navHeight - breathingRoom),
    maxScroll
  );

  window.scrollTo({ top: target, behavior: "smooth" });
}
