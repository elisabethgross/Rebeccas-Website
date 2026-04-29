import {
  users,
  contactSubmissions,
  googleReviews,
  testimonials,
  type User,
  type InsertUser,
  type ContactSubmission,
  type InsertContactSubmission,
  type GoogleReview,
  type InsertGoogleReview,
  type Testimonial,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export type CreateTestimonialInput = {
  firstName: string;
  lastInitial?: string | null;
  activityRole?: string | null;
  quote: string;
  rating?: number | null;
  consentGiven: boolean;
  status?: string;
  source?: string;
};

export type UpdateTestimonialInput = {
  firstName?: string;
  lastInitial?: string | null;
  activityRole?: string | null;
  quote?: string;
  rating?: number | null;
  status?: string;
  submittedAt?: Date;
  approvedAt?: Date | null;
};

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createGoogleReview(review: InsertGoogleReview): Promise<GoogleReview>;
  getApprovedGoogleReviews(): Promise<GoogleReview[]>;
  getAllGoogleReviews(): Promise<GoogleReview[]>;
  updateGoogleReviewApproval(reviewId: string, status: string): Promise<GoogleReview | undefined>;
  createTestimonial(input: CreateTestimonialInput): Promise<Testimonial>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  getAllTestimonials(): Promise<Testimonial[]>;
  updateTestimonial(id: number, input: UpdateTestimonialInput): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
}

export class MemStorage {
  private users: Map<number, User>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private currentUserId: number;
  private currentSubmissionId: number;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.currentUserId = 1;
    this.currentSubmissionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentSubmissionId++;
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id,
      createdAt: new Date()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    const submissions = await db.select().from(contactSubmissions);
    return submissions;
  }

  async createGoogleReview(insertReview: InsertGoogleReview): Promise<GoogleReview> {
    const [review] = await db
      .insert(googleReviews)
      .values(insertReview)
      .returning();
    return review;
  }

  async getApprovedGoogleReviews(): Promise<GoogleReview[]> {
    const reviews = await db
      .select()
      .from(googleReviews)
      .where(eq(googleReviews.isApproved, "approved"))
      .orderBy(desc(googleReviews.createTime));
    return reviews;
  }

  async getAllGoogleReviews(): Promise<GoogleReview[]> {
    const reviews = await db
      .select()
      .from(googleReviews)
      .orderBy(desc(googleReviews.syncedAt));
    return reviews;
  }

  async updateGoogleReviewApproval(reviewId: string, status: string): Promise<GoogleReview | undefined> {
    const [review] = await db
      .update(googleReviews)
      .set({ isApproved: status })
      .where(eq(googleReviews.reviewId, reviewId))
      .returning();
    return review || undefined;
  }

  async createTestimonial(input: CreateTestimonialInput): Promise<Testimonial> {
    const status = input.status ?? "pending";
    const [t] = await db
      .insert(testimonials)
      .values({
        firstName: input.firstName,
        lastInitial: input.lastInitial ?? null,
        activityRole: input.activityRole ?? null,
        quote: input.quote,
        rating: input.rating ?? null,
        consentGiven: input.consentGiven,
        status,
        source: input.source ?? "website",
        approvedAt: status === "approved" ? new Date() : null,
      })
      .returning();
    return t;
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return db
      .select()
      .from(testimonials)
      .where(eq(testimonials.status, "approved"))
      .orderBy(desc(testimonials.approvedAt));
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.submittedAt));
  }

  async updateTestimonial(
    id: number,
    input: UpdateTestimonialInput
  ): Promise<Testimonial | undefined> {
    const update: Record<string, unknown> = {};
    if (input.firstName !== undefined) update.firstName = input.firstName;
    if (input.lastInitial !== undefined) update.lastInitial = input.lastInitial;
    if (input.activityRole !== undefined) update.activityRole = input.activityRole;
    if (input.quote !== undefined) update.quote = input.quote;
    if (input.rating !== undefined) update.rating = input.rating;
    if (input.submittedAt !== undefined) update.submittedAt = input.submittedAt;
    if (input.approvedAt !== undefined) update.approvedAt = input.approvedAt;
    if (input.status !== undefined) {
      update.status = input.status;
      // Only auto-stamp approvedAt on approval if the caller didn't already
      // set it explicitly in this same request.
      if (input.status === "approved" && input.approvedAt === undefined) {
        update.approvedAt = new Date();
      }
    }
    if (Object.keys(update).length === 0) {
      const [existing] = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.id, id));
      return existing || undefined;
    }
    const [t] = await db
      .update(testimonials)
      .set(update)
      .where(eq(testimonials.id, id))
      .returning();
    return t || undefined;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
