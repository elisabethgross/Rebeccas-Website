import { storage } from "./storage";

// The four starter templates that used to live in
// `client/src/lib/reply-templates.ts`. They get inserted only when the
// `reply_templates` table is completely empty, so any edits the admin makes
// after the first deploy aren't clobbered on restart.
const STARTER_TEMPLATES = [
  {
    label: "First reply",
    subject: "Following up from Dr. Kleiner, {{firstName}}",
    body: `Hi {{firstName}},

Thank you for reaching out.{{#referral}} I appreciate you finding me through {{referral}}.{{/referral}}{{#activities}} I noticed you mentioned wanting to get back to {{activities}}, and that's exactly the kind of goal I love helping with.{{/activities}} I'd love to learn more about what you're working through and how I can help.

Would a brief 15-minute call sometime this week work for you? If so, send me a couple of times that fit your schedule and I'll lock one in.

Warmly,
Dr. Rebecca Kleiner`,
  },
  {
    label: "Need more info",
    subject: "A couple of quick questions, {{firstName}}",
    body: `Hi {{firstName}},

Thanks for getting in touch! Before we set up a time to talk, would you mind sharing a bit more about:

• What's been bothering you, and how long it's been going on
• Any activities you've had to step back from
• Whether you've seen anyone else for it

A few sentences is plenty, it just helps me make the most of our first call.

Warmly,
Dr. Rebecca Kleiner`,
  },
  {
    label: "Schedule confirmation",
    subject: "You're all set, {{firstName}}",
    body: `Hi {{firstName}},

Confirming our visit, looking forward to meeting you. I'll send a brief intake form ahead of time so we can hit the ground running.

If anything comes up and you need to reschedule, just reply to this email and we'll find a new time.

Warmly,
Dr. Rebecca Kleiner`,
  },
  {
    label: "Follow-up",
    subject: "Checking in, {{firstName}}",
    body: `Hi {{firstName}},

Just circling back on your inquiry. I know life gets busy. If you'd still like to set something up, reply with a couple of times that work for you and we'll take it from there.

No pressure either way!

Warmly,
Dr. Rebecca Kleiner`,
  },
];

export async function seedReplyTemplatesIfEmpty() {
  try {
    const existing = await storage.listReplyTemplates();
    if (existing.length > 0) return;
    for (let i = 0; i < STARTER_TEMPLATES.length; i++) {
      const t = STARTER_TEMPLATES[i];
      await storage.createReplyTemplate({ ...t, sortOrder: i });
    }
    console.log(
      `[seed] Inserted ${STARTER_TEMPLATES.length} starter reply templates.`
    );
  } catch (err) {
    console.error("[seed] Failed to seed reply templates:", err);
  }
}
