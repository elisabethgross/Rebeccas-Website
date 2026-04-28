import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertContactSubmissionSchema,
  submitTestimonialSchema,
  adminCreateTestimonialSchema,
  adminUpdateTestimonialSchema,
} from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import { googleReviewsService } from "./google-reviews";

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error(
      "[admin] ADMIN_PASSWORD is not set; refusing admin request to",
      req.path
    );
    return res.status(503).json({
      success: false,
      message:
        "Admin actions are disabled because ADMIN_PASSWORD is not configured on the server.",
    });
  }
  const provided = (req.headers["x-admin-password"] as string) || "";
  if (!provided || provided !== expected) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized" });
  }
  next();
}

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      
      // Store submission in memory
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification
      try {
        const transporter = createTransporter();
        
        const mailOptions = {
          from: `"Rebecca Kleiner" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
          to: "kleinerDPT@gmail.com",
          subject: `New Consultation Request from ${validatedData.firstName} ${validatedData.lastName}`,
          html: `
            <h2>New Consultation Request</h2>
            <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone}</p>
            <p><strong>How did they hear about us:</strong> ${validatedData.howDidYouHear || 'Not specified'}</p>
            <p><strong>Activities they want to return to:</strong></p>
            <p>${validatedData.activities || 'Not specified'}</p>
            <p><strong>Preferred contact method:</strong> ${validatedData.contactMethod}</p>
            <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
          `,
        };
        
        await transporter.sendMail(mailOptions);
        
        // Send confirmation email to client
        const clientMailOptions = {
          from: `"Rebecca Kleiner" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
          to: validatedData.email,
          subject: "Thank you for your consultation request - Dr. Rebecca Kleiner PT",
          html: `
            <p>Dear ${validatedData.firstName},</p>
            <p>Thank you for your interest in personalized, compassionate, one-on-one physical therapy. I have received your consultation request and will contact you within 24 hours to schedule your comprehensive evaluation.</p>
            <p>I look forward to helping you get back to the things that matter most to you!</p>
            <p>Best regards,<br>Dr. Rebecca Kleiner, PT, DPT</p>
            <hr>
            <p><small>This is an automated confirmation. Please do not reply to this email.</small></p>
          `,
        };
        
        await transporter.sendMail(clientMailOptions);
        
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the request if email fails - still return success
      }
      
      res.json({ success: true, message: "Contact form submitted successfully" });
      
    } catch (error) {
      console.error("Contact form submission error:", error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get all contact submissions (for admin purposes)
  app.get("/api/contact-submissions", requireAdminAuth, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch contact submissions" 
      });
    }
  });

  // Get approved Google reviews for public display
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getApprovedGoogleReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch reviews" 
      });
    }
  });

  // Admin endpoint to get all Google reviews
  app.get("/api/admin/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllGoogleReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch all reviews" 
      });
    }
  });

  // Admin endpoint to approve/reject reviews
  app.post("/api/admin/reviews/:reviewId/approval", async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { status } = req.body;
      
      if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be 'approved', 'rejected', or 'pending'"
        });
      }

      const updatedReview = await storage.updateGoogleReviewApproval(reviewId, status);
      
      if (!updatedReview) {
        return res.status(404).json({
          success: false,
          message: "Review not found"
        });
      }

      res.json({
        success: true,
        message: `Review ${status} successfully`,
        review: updatedReview
      });
    } catch (error) {
      console.error("Error updating review approval:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to update review approval" 
      });
    }
  });

  // Simple redirect to Google Business Profile for leaving reviews
  app.get("/api/leave-review", (req, res) => {
    const googleBusinessUrl = googleReviewsService.getReviewUrl();
    res.redirect(googleBusinessUrl);
  });

  // Initialize sample reviews on startup
  app.get("/api/admin/seed-reviews", async (req, res) => {
    try {
      await googleReviewsService.seedSampleReviews();
      res.json({ 
        success: true, 
        message: "Sample reviews seeded successfully" 
      });
    } catch (error) {
      console.error("Error seeding reviews:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to seed reviews" 
      });
    }
  });

  // ===== Patient testimonials =====

  // Public: list approved testimonials
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const items = await storage.getApprovedTestimonials();
      res.json(items);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch testimonials" });
    }
  });

  // Public: submit a testimonial (always lands as 'pending')
  app.post("/api/testimonials", async (req, res) => {
    try {
      const data = submitTestimonialSchema.parse(req.body);
      const created = await storage.createTestimonial({
        firstName: data.firstName.trim(),
        lastInitial: data.lastInitial?.trim() || null,
        activityRole: data.activityRole?.trim() || null,
        quote: data.quote.trim(),
        rating: data.rating ?? null,
        consentGiven: data.consentGiven,
        status: "pending",
        source: "website",
      });
      res.json({
        success: true,
        message:
          "Thank you for sharing! Your testimonial will appear once Dr. Kleiner reviews it.",
        id: created.id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid submission",
          errors: error.errors,
        });
      }
      console.error("Error submitting testimonial:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to submit testimonial" });
    }
  });

  // Admin: list all testimonials (any status)
  app.get("/api/admin/testimonials", requireAdminAuth, async (_req, res) => {
    try {
      const items = await storage.getAllTestimonials();
      res.json(items);
    } catch (error) {
      console.error("Error fetching all testimonials:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch testimonials" });
    }
  });

  // Admin: create a testimonial directly (defaults to approved)
  app.post("/api/admin/testimonials", requireAdminAuth, async (req, res) => {
    try {
      const data = adminCreateTestimonialSchema.parse(req.body);
      const created = await storage.createTestimonial({
        firstName: data.firstName.trim(),
        lastInitial: data.lastInitial?.trim() || null,
        activityRole: data.activityRole?.trim() || null,
        quote: data.quote.trim(),
        rating: data.rating ?? null,
        consentGiven: data.consentGiven,
        status: data.status ?? "approved",
        source: "manual",
      });
      res.json({ success: true, testimonial: created });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid testimonial",
          errors: error.errors,
        });
      }
      console.error("Error creating testimonial:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create testimonial" });
    }
  });

  // Admin: update a testimonial (status, fields)
  app.patch("/api/admin/testimonials/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid id" });
      }
      const data = adminUpdateTestimonialSchema.parse(req.body);
      const updated = await storage.updateTestimonial(id, data);
      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Testimonial not found" });
      }
      res.json({ success: true, testimonial: updated });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid update",
          errors: error.errors,
        });
      }
      console.error("Error updating testimonial:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update testimonial" });
    }
  });

  // Admin: delete a testimonial
  app.delete("/api/admin/testimonials/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid id" });
      }
      const ok = await storage.deleteTestimonial(id);
      if (!ok) {
        return res
          .status(404)
          .json({ success: false, message: "Testimonial not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete testimonial" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
