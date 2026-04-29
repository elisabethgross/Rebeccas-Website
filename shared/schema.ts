import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  howDidYouHear: text("how_did_you_hear").notNull(),
  activities: text("activities").notNull(),
  contactMethod: text("contact_method").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const googleReviews = pgTable("google_reviews", {
  id: serial("id").primaryKey(),
  reviewId: text("review_id").notNull().unique(),
  reviewerName: text("reviewer_name").notNull(),
  reviewerProfilePhotoUrl: text("reviewer_profile_photo_url"),
  starRating: text("star_rating").notNull(),
  comment: text("comment"),
  createTime: timestamp("create_time").notNull(),
  updateTime: timestamp("update_time").notNull(),
  isApproved: text("is_approved").notNull().default("pending"), // pending, approved, rejected
  syncedAt: timestamp("synced_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  howDidYouHear: true,
  activities: true,
  contactMethod: true,
}).extend({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  howDidYouHear: z.string().min(1, "Please select how you heard about us"),
  activities: z.string().min(10, "Please tell us more about your goals (at least 10 characters)"),
  contactMethod: z.string().min(1, "Please select your preferred contact method"),
});

export const insertGoogleReviewSchema = createInsertSchema(googleReviews).pick({
  reviewId: true,
  reviewerName: true,
  reviewerProfilePhotoUrl: true,
  starRating: true,
  comment: true,
  createTime: true,
  updateTime: true,
  isApproved: true,
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastInitial: text("last_initial"),
  activityRole: text("activity_role"),
  quote: text("quote").notNull(),
  rating: integer("rating"),
  consentGiven: boolean("consent_given").notNull().default(false),
  status: text("status").notNull().default("pending"),
  source: text("source").notNull().default("website"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
});

export const submitTestimonialSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(40, "First name is too long"),
  lastInitial: z
    .string()
    .max(2, "Just a single letter please")
    .optional()
    .or(z.literal("")),
  activityRole: z
    .string()
    .max(80, "Please keep this under 80 characters")
    .optional()
    .or(z.literal("")),
  quote: z
    .string()
    .min(20, "Please share at least a sentence (20+ characters)")
    .max(1500, "Please keep your testimonial under 1500 characters"),
  rating: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .nullable(),
  consentGiven: z
    .boolean()
    .refine((v) => v === true, {
      message:
        "Please confirm you authorize Dr. Kleiner to publish this on her website.",
    }),
});

export const adminCreateTestimonialSchema = submitTestimonialSchema
  .omit({ consentGiven: true })
  .extend({
    consentGiven: z.boolean(),
    status: z
      .enum(["pending", "approved", "rejected", "hidden"])
      .optional()
      .default("approved"),
  });

// Admin can edit every field on a testimonial directly from the dashboard.
// Status changes also flow through the dedicated approve/reject/hide actions.
export const adminUpdateTestimonialSchema = z.object({
  firstName: z.string().min(1).max(40).optional(),
  lastInitial: z.string().max(2).optional().nullable(),
  activityRole: z.string().max(80).optional().nullable(),
  quote: z
    .string()
    .min(20, "Please share at least a sentence (20+ characters)")
    .max(1500, "Please keep this under 1500 characters")
    .optional(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  status: z.enum(["pending", "approved", "rejected", "hidden"]).optional(),
  submittedAt: z.coerce.date().optional(),
  approvedAt: z.coerce.date().optional().nullable(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type GoogleReview = typeof googleReviews.$inferSelect;
export type InsertGoogleReview = z.infer<typeof insertGoogleReviewSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type SubmitTestimonialInput = z.infer<typeof submitTestimonialSchema>;
export type AdminCreateTestimonialInput = z.infer<typeof adminCreateTestimonialSchema>;
export type AdminUpdateTestimonialInput = z.infer<typeof adminUpdateTestimonialSchema>;
