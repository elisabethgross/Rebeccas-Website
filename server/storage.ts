import {
  users,
  contactSubmissions,
  googleReviews,
  testimonials,
  replyTemplates,
  type User,
  type InsertUser,
  type ContactSubmission,
  type InsertContactSubmission,
  type GoogleReview,
  type InsertGoogleReview,
  type Testimonial,
  type ReplyTemplate,
  type InsertReplyTemplate,
  type UpdateReplyTemplate,
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc, and, inArray } from "drizzle-orm";

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
  listReplyTemplates(): Promise<ReplyTemplate[]>;
  createReplyTemplate(input: InsertReplyTemplate): Promise<ReplyTemplate>;
  updateReplyTemplate(
    id: number,
    input: UpdateReplyTemplate
  ): Promise<ReplyTemplate | undefined>;
  deleteReplyTemplate(id: number): Promise<boolean>;
  reorderReplyTemplates(ids: number[]): Promise<ReplyTemplate[]>;
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

  async listReplyTemplates(): Promise<ReplyTemplate[]> {
    return db
      .select()
      .from(replyTemplates)
      .orderBy(asc(replyTemplates.sortOrder), asc(replyTemplates.id));
  }

  async createReplyTemplate(
    input: InsertReplyTemplate
  ): Promise<ReplyTemplate> {
    // If no sortOrder is supplied, append to the end so newly created
    // templates show up after existing ones rather than randomly mixed in.
    let sortOrder = input.sortOrder;
    if (sortOrder === undefined) {
      const last = await db
        .select({ sortOrder: replyTemplates.sortOrder })
        .from(replyTemplates)
        .orderBy(desc(replyTemplates.sortOrder))
        .limit(1);
      sortOrder = (last[0]?.sortOrder ?? -1) + 1;
    }
    const [row] = await db
      .insert(replyTemplates)
      .values({
        label: input.label,
        subject: input.subject,
        body: input.body,
        sortOrder,
      })
      .returning();
    return row;
  }

  async updateReplyTemplate(
    id: number,
    input: UpdateReplyTemplate
  ): Promise<ReplyTemplate | undefined> {
    const update: Record<string, unknown> = {};
    if (input.label !== undefined) update.label = input.label;
    if (input.subject !== undefined) update.subject = input.subject;
    if (input.body !== undefined) update.body = input.body;
    if (input.sortOrder !== undefined) update.sortOrder = input.sortOrder;
    if (Object.keys(update).length === 0) {
      const [existing] = await db
        .select()
        .from(replyTemplates)
        .where(eq(replyTemplates.id, id));
      return existing || undefined;
    }
    const [row] = await db
      .update(replyTemplates)
      .set(update)
      .where(eq(replyTemplates.id, id))
      .returning();
    return row || undefined;
  }

  async deleteReplyTemplate(id: number): Promise<boolean> {
    const result = await db
      .delete(replyTemplates)
      .where(eq(replyTemplates.id, id))
      .returning();
    return result.length > 0;
  }

  async reorderReplyTemplates(ids: number[]): Promise<ReplyTemplate[]> {
    // Validate that every id in the requested order actually exists, so we
    // don't leave the table in a half-renumbered state if a stale client
    // passes in a deleted id.
    const existing = await db
      .select({ id: replyTemplates.id })
      .from(replyTemplates)
      .where(inArray(replyTemplates.id, ids));
    const existingIds = new Set(existing.map((row) => row.id));
    const missing = ids.filter((id) => !existingIds.has(id));
    if (missing.length > 0) {
      throw new Error(
        `Unknown reply template id(s): ${missing.join(", ")}`
      );
    }
    // Renumber sortOrder by index in the supplied list. Other rows (if any
    // weren't included) keep their existing sortOrder; in practice the UI
    // always sends the full ordered list.
    for (let i = 0; i < ids.length; i++) {
      await db
        .update(replyTemplates)
        .set({ sortOrder: i })
        .where(eq(replyTemplates.id, ids[i]));
    }
    return this.listReplyTemplates();
  }
}

export const storage = new DatabaseStorage();
