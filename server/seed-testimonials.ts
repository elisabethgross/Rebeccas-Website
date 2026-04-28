import { storage } from "./storage";

const LAUNCH_TESTIMONIALS = [
  {
    firstName: "Priya",
    lastInitial: "S",
    activityRole: "Marathon Runner",
    quote:
      "After two years of nagging hip pain that three other PTs couldn't pin down, Dr. Kleiner found the root cause in our very first session. I'm back to long Sunday runs and just PR'd in my last half-marathon.",
    rating: 5,
  },
  {
    firstName: "Marcus",
    lastInitial: "T",
    activityRole: "Father of Three",
    quote:
      "Rebecca made me feel like a person, not a chart. She actually explained what was happening in my back and gave me homework I could fit into my real life. I can pick up my kids again without bracing for the worst.",
    rating: 5,
  },
  {
    firstName: "Eleanor",
    lastInitial: "K",
    activityRole: "Retired Teacher, Hiker",
    quote:
      "I was honestly ready to stop hiking after my knee replacement. Rebecca's program brought me back stronger than I was before surgery. Last month I finished a 10-mile loop in the Catskills.",
    rating: 5,
  },
  {
    firstName: "Anita",
    lastInitial: "R",
    activityRole: "Yoga Teacher",
    quote:
      "The 60-minute one-on-one format makes all the difference. We had time to actually work, not just check boxes. My shoulder mobility is the best it's been in a decade and my students notice.",
    rating: 5,
  },
];

export async function seedLaunchTestimonialsIfEmpty() {
  try {
    // Only seed when nothing is currently published. We intentionally check
    // approved (not all) so leftover pending/rejected rows don't block seeding,
    // and once any real testimonial is approved the seeder stays dormant.
    const approved = await storage.getApprovedTestimonials();
    if (approved.length > 0) {
      return;
    }
    for (const t of LAUNCH_TESTIMONIALS) {
      await storage.createTestimonial({
        ...t,
        consentGiven: true,
        status: "approved",
        source: "manual",
      });
    }
    console.log(
      `[seed] Inserted ${LAUNCH_TESTIMONIALS.length} launch testimonials.`
    );
  } catch (err) {
    console.error("[seed] Failed to seed launch testimonials:", err);
  }
}
