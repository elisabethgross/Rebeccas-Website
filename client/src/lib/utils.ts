import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToSectionId(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const navHeight = 80; // Fixed nav bar height
  // Land the top of the section roughly one third of the viewport height
  // from the top of the screen (i.e. in the upper third of the page).
  // Ensure the offset still clears the fixed nav bar.
  const topThirdOffset = Math.max(window.innerHeight / 3, navHeight + 16);

  const elementTop =
    element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const target = Math.min(
    Math.max(0, elementTop - topThirdOffset),
    maxScroll
  );

  window.scrollTo({ top: target, behavior: "smooth" });
}
