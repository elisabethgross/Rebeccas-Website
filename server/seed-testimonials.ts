import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { testimonials } from "@shared/schema";
import { storage } from "./storage";

const LAUNCH_TESTIMONIALS = [
  {
    firstName: "Priya",
    lastInitial: "S",
    activityRole: "Triathlete in Training",
    quote:
      "After two years of nagging hip pain that three other PTs couldn't pin down, Dr. Kleiner found the root cause in our very first session. I'm back to long Sunday runs and just PR'd in my last half-marathon.",
    rating: 5,
  },
  {
    firstName: "Marcus",
    lastInitial: "T",
    activityRole: "Dad of Three & Weekend Cyclist",
    quote:
      "Rebecca made me feel like a person, not a chart. She actually explained what was happening in my back and gave me homework I could fit into my real life. I can pick up my kids again without bracing for the worst.",
    rating: 5,
  },
  {
    firstName: "Eleanor",
    lastInitial: "K",
    activityRole: "Retired Educator & Avid Gardener",
    quote:
      "I was honestly ready to stop hiking after my knee replacement. Rebecca's program brought me back stronger than I was before surgery. Last month I finished a 10-mile loop in the Catskills.",
    rating: 5,
  },
  {
    firstName: "Anita",
    lastInitial: "R",
    activityRole: "Modern Dance Instructor",
    quote:
      "The 60-minute one-on-one format makes all the difference. We had time to actually work, not just check boxes. My shoulder mobility is the best it's been in a decade and my students notice.",
    rating: 5,
  },
];

// Activity roles previously used by the launch seed that overlapped with the
// example placeholders in the patient submission form. We migrate these in
// place to the refreshed values in LAUNCH_TESTIMONIALS so existing databases
// don't get stuck with the old wording.
const LEGACY_ROLE_MAP: Array<{
  firstName: string;
  lastInitial: string;
  oldRole: string;
}> = [
  { firstName: "Priya", lastInitial: "S", oldRole: "Marathon Runner" },
  { firstName: "Marcus", lastInitial: "T", oldRole: "Father of Three" },
  { firstName: "Eleanor", lastInitial: "K", oldRole: "Retired Teacher, Hiker" },
  { firstName: "Anita", lastInitial: "R", oldRole: "Yoga Teacher" },
];

async function migrateLegacySeedActivityRoles() {
  for (const legacy of LEGACY_ROLE_MAP) {
    const target = LAUNCH_TESTIMONIALS.find(
      (t) =>
        t.firstName === legacy.firstName && t.lastInitial === legacy.lastInitial
    );
    if (!target) continue;
    try {
      const result = await db
        .update(testimonials)
        .set({ activityRole: target.activityRole })
        .where(
          and(
            eq(testimonials.firstName, legacy.firstName),
            eq(testimonials.lastInitial, legacy.lastInitial),
            eq(testimonials.activityRole, legacy.oldRole),
            eq(testimonials.source, "manual")
          )
        )
        .returning({ id: testimonials.id });
      if (result.length > 0) {
        console.log(
          `[seed] Migrated activity role for ${legacy.firstName} ${legacy.lastInitial}.: "${legacy.oldRole}" → "${target.activityRole}"`
        );
      }
    } catch (err) {
      console.error(
        `[seed] Failed to migrate legacy activity role for ${legacy.firstName}:`,
        err
      );
    }
  }
}

export async function seedLaunchTestimonialsIfEmpty() {
  try {
    // First, refresh any rows still using the original placeholder-style roles.
    await migrateLegacySeedActivityRoles();

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
