import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToSectionId(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const navHeight = 64; // Fixed nav bar height (h-14 mobile / h-16 desktop)
  const breathingRoom = 8; // Land the section just under the nav for visual comfort

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
