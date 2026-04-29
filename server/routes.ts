import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertContactSubmissionSchema,
  submitTestimonialSchema,
  adminCreateTestimonialSchema,
  adminUpdateTestimonialSchema,
  insertReplyTemplateSchema,
  updateReplyTemplateSchema,
  reorderReplyTemplatesSchema,
} from "@shared/schema";
import { z } from "zod";
import { sendEmail } from "./lib/email";
import { googleReviewsService } from "./google-reviews";

const ADMIN_FROM_ADDRESS = '"Dr. Rebecca Kleiner" <kleinerdpt@gmail.com>';

const adminSendEmailSchema = z.object({
  to: z.string().trim().email("A valid recipient email is required"),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject must be 200 characters or fewer"),
  body: z
    .string()
    .min(1, "Body is required")
    .max(10000, "Body must be 10,000 characters or fewer"),
});

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
        const fromAddress = `"Rebecca Kleiner" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`;

        await sendEmail({
          from: fromAddress,
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
        });

        // Send confirmation email to client
        await sendEmail({
          from: fromAddress,
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
        });

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

  // Admin: send a custom email to a patient from kleinerdpt@gmail.com.
  // Used by the in-admin email composer so messages always come from
  // Rebecca's clinical inbox regardless of which device the admin is on.
  app.post(
    "/api/admin/send-inquiry-email",
    requireAdminAuth,
    async (req, res) => {
      let payload: z.infer<typeof adminSendEmailSchema>;
      try {
        payload = adminSendEmailSchema.parse(req.body);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            message: "Invalid email request",
            errors: error.errors,
          });
        }
        throw error;
      }

      try {
        await sendEmail({
          from: ADMIN_FROM_ADDRESS,
          to: payload.to,
          subject: payload.subject,
          text: payload.body,
        });
        return res.json({ success: true });
      } catch (error) {
        console.error("[admin] send-inquiry-email failed:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to send email. Please try again.",
        });
      }
    }
  );

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

      // Notify Rebecca that a new testimonial is awaiting review.
      try {
        const fullName = created.lastInitial
          ? `${created.firstName} ${created.lastInitial.toUpperCase()}.`
          : created.firstName;
        const adminUrl = `${req.protocol}://${req.get("host")}/admin/testimonials`;
        await sendEmail({
          from: `"Rebecca Kleiner Website" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
          to: "kleinerDPT@gmail.com",
          subject: `New testimonial pending review — ${fullName}`,
          html: `
            <h2>New testimonial awaiting your review</h2>
            <p><strong>From:</strong> ${fullName}${
              created.activityRole ? ` (${created.activityRole})` : ""
            }</p>
            ${created.rating ? `<p><strong>Rating:</strong> ${created.rating} / 5</p>` : ""}
            <p><strong>Quote:</strong></p>
            <blockquote style="border-left:3px solid #ccc;padding-left:12px;margin:8px 0;color:#444;">
              ${created.quote.replace(/\n/g, "<br>")}
            </blockquote>
            <p><strong>Consent given:</strong> ${created.consentGiven ? "Yes" : "No"}</p>
            <p><strong>Submitted:</strong> ${new Date(created.submittedAt).toLocaleString()}</p>
            <p>
              <a href="${adminUrl}" style="background:#5a8a78;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;display:inline-block;">
                Review in admin panel
              </a>
            </p>
            <p style="color:#888;font-size:12px;">
              This testimonial is currently <strong>pending</strong> and will not appear on the
              public site until you approve it.
            </p>
          `,
        });
      } catch (emailError) {
        // Don't fail the submission if email fails; log it for follow-up.
        console.error(
          "[testimonials] Notification email failed:",
          emailError
        );
      }

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

  // ===== Reply templates (admin-managed quick replies) =====

  // Public-but-admin-only: list templates in display order. Used by both
  // the /admin/templates editor and the email composer's pill row.
  app.get(
    "/api/admin/reply-templates",
    requireAdminAuth,
    async (_req, res) => {
      try {
        const templates = await storage.listReplyTemplates();
        res.json(templates);
      } catch (error) {
        console.error("[admin] list reply templates failed:", error);
        res.status(500).json({
          success: false,
          message: "Failed to load reply templates",
        });
      }
    }
  );

  app.post(
    "/api/admin/reply-templates",
    requireAdminAuth,
    async (req, res) => {
      try {
        const data = insertReplyTemplateSchema.parse(req.body);
        const created = await storage.createReplyTemplate(data);
        res.json({ success: true, template: created });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            message: "Invalid template",
            errors: error.errors,
          });
        }
        console.error("[admin] create reply template failed:", error);
        res.status(500).json({
          success: false,
          message: "Failed to create reply template",
        });
      }
    }
  );

  app.patch(
    "/api/admin/reply-templates/:id",
    requireAdminAuth,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid id" });
        }
        const data = updateReplyTemplateSchema.parse(req.body);
        const updated = await storage.updateReplyTemplate(id, data);
        if (!updated) {
          return res
            .status(404)
            .json({ success: false, message: "Template not found" });
        }
        res.json({ success: true, template: updated });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            message: "Invalid update",
            errors: error.errors,
          });
        }
        console.error("[admin] update reply template failed:", error);
        res.status(500).json({
          success: false,
          message: "Failed to update reply template",
        });
      }
    }
  );

  app.delete(
    "/api/admin/reply-templates/:id",
    requireAdminAuth,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid id" });
        }
        const ok = await storage.deleteReplyTemplate(id);
        if (!ok) {
          return res
            .status(404)
            .json({ success: false, message: "Template not found" });
        }
        res.json({ success: true });
      } catch (error) {
        console.error("[admin] delete reply template failed:", error);
        res.status(500).json({
          success: false,
          message: "Failed to delete reply template",
        });
      }
    }
  );

  app.post(
    "/api/admin/reply-templates/reorder",
    requireAdminAuth,
    async (req, res) => {
      try {
        const { ids } = reorderReplyTemplatesSchema.parse(req.body);
        const templates = await storage.reorderReplyTemplates(ids);
        res.json({ success: true, templates });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            message: "Invalid reorder request",
            errors: error.errors,
          });
        }
        console.error("[admin] reorder reply templates failed:", error);
        res.status(500).json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to reorder reply templates",
        });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
