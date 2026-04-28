import type { Testimonial } from "@shared/schema";

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: -1,
    firstName: "Priya",
    lastInitial: "S",
    activityRole: "Marathon Runner",
    quote:
      "After two years of nagging hip pain that three other PTs couldn't pin down, Dr. Kleiner found the root cause in our very first session. I'm back to long Sunday runs and just PR'd in my last half-marathon.",
    rating: 5,
    consentGiven: true,
    status: "approved",
    source: "manual",
    submittedAt: new Date(now - 6 * day),
    approvedAt: new Date(now - 5 * day),
  },
  {
    id: -2,
    firstName: "Marcus",
    lastInitial: "T",
    activityRole: "Father of Three",
    quote:
      "Rebecca made me feel like a person, not a chart. She actually explained what was happening in my back and gave me homework I could fit into my real life. I can pick up my kids again without bracing for the worst.",
    rating: 5,
    consentGiven: true,
    status: "approved",
    source: "website",
    submittedAt: new Date(now - 18 * day),
    approvedAt: new Date(now - 17 * day),
  },
  {
    id: -3,
    firstName: "Eleanor",
    lastInitial: "K",
    activityRole: "Retired Teacher, Hiker",
    quote:
      "I was honestly ready to stop hiking after my knee replacement. Rebecca's program brought me back stronger than I was before surgery. Last month I finished a 10-mile loop in the Catskills.",
    rating: 5,
    consentGiven: true,
    status: "approved",
    source: "manual",
    submittedAt: new Date(now - 42 * day),
    approvedAt: new Date(now - 40 * day),
  },
  {
    id: -4,
    firstName: "Jordan",
    lastInitial: null,
    activityRole: "CrossFit Athlete",
    quote:
      "What I appreciate most is that Rebecca treats causes, not symptoms. Every session ended with me understanding my body a little better. Six weeks in, I was lifting heavier than I had in a year — pain free.",
    rating: 5,
    consentGiven: true,
    status: "approved",
    source: "website",
    submittedAt: new Date(now - 60 * day),
    approvedAt: new Date(now - 58 * day),
  },
  {
    id: -5,
    firstName: "Anita",
    lastInitial: "R",
    activityRole: "Yoga Teacher",
    quote:
      "The 60-minute one-on-one format makes all the difference. We had time to actually work, not just check boxes. My shoulder mobility is the best it's been in a decade and my students notice.",
    rating: 5,
    consentGiven: true,
    status: "approved",
    source: "website",
    submittedAt: new Date(now - 90 * day),
    approvedAt: new Date(now - 88 * day),
  },
  {
    id: -6,
    firstName: "Tomás",
    lastInitial: "V",
    activityRole: "Software Engineer",
    quote:
      "I've sat at a desk for fifteen years. Rebecca redesigned how I sit, stand, and move between meetings. The chronic neck tension I thought was permanent is just… gone.",
    rating: 5,
    consentGiven: true,
    status: "approved",
    source: "manual",
    submittedAt: new Date(now - 120 * day),
    approvedAt: new Date(now - 115 * day),
  },
];
