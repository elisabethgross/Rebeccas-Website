import { users, contactSubmissions, googleReviews, type User, type InsertUser, type ContactSubmission, type InsertContactSubmission, type GoogleReview, type InsertGoogleReview } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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
}

export class MemStorage implements IStorage {
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
}

export const storage = new DatabaseStorage();
