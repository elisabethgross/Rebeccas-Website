import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToSectionId(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const navHeight = 80; // Fixed nav bar height
  const isMobile = window.innerWidth < 768;
  // Push section down a bit so it sits closer to middle of screen.
  // Use a smaller offset on mobile so taps land predictably and never overshoot.
  const verticalCenterOffset = isMobile
    ? Math.min(window.innerHeight * 0.1, 80)
    : Math.min(window.innerHeight * 0.18, 180);

  const elementTop =
    element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const target = Math.min(
    Math.max(0, elementTop - navHeight - verticalCenterOffset),
    maxScroll
  );

  window.scrollTo({ top: target, behavior: "smooth" });
}
