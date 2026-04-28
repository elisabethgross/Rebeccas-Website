import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import { googleReviewsService } from "./google-reviews";

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
  app.get("/api/contact-submissions", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
