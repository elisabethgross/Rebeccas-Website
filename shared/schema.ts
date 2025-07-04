import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
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
  howDidYouHear: text("how_did_you_hear"),
  activities: text("activities"),
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type GoogleReview = typeof googleReviews.$inferSelect;
export type InsertGoogleReview = z.infer<typeof insertGoogleReviewSchema>;
