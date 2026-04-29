export interface ReplyTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

export interface InterpolationContext {
  firstName?: string | null;
  lastName?: string | null;
}

const FIRST_NAME_FALLBACK = "there";

export function interpolateTemplate(
  template: string,
  context: InterpolationContext,
): string {
  const firstNameRaw = (context.firstName ?? "").trim();
  const lastNameRaw = (context.lastName ?? "").trim();
  const firstName = firstNameRaw || FIRST_NAME_FALLBACK;
  const lastName = lastNameRaw;
  const fullName = [firstNameRaw, lastNameRaw].filter(Boolean).join(" ");

  return template.replace(/\{\{\s*(firstName|lastName|fullName)\s*\}\}/g, (_, key) => {
    if (key === "firstName") return firstName;
    if (key === "lastName") return lastName;
    if (key === "fullName") return fullName;
    return "";
  });
}

export const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    id: "first-reply",
    label: "First reply",
    subject: "Following up from Dr. Kleiner, {{firstName}}",
    body: `Hi {{firstName}},

Thank you for reaching out. I'd love to learn more about what you're working through and how I can help.

Would a brief 15-minute call sometime this week work for you? If so, send me a couple of times that fit your schedule and I'll lock one in.

Warmly,
Dr. Rebecca Kleiner`,
  },
  {
    id: "need-more-info",
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
    id: "schedule-confirmation",
    label: "Schedule confirmation",
    subject: "You're all set, {{firstName}}",
    body: `Hi {{firstName}},

Confirming our visit, looking forward to meeting you. I'll send a brief intake form ahead of time so we can hit the ground running.

If anything comes up and you need to reschedule, just reply to this email and we'll find a new time.

Warmly,
Dr. Rebecca Kleiner`,
  },
  {
    id: "follow-up",
    label: "Follow-up",
    subject: "Checking in, {{firstName}}",
    body: `Hi {{firstName}},

Just circling back on your inquiry. I know life gets busy. If you'd still like to set something up, reply with a couple of times that work for you and we'll take it from there.

No pressure either way!

Warmly,
Dr. Rebecca Kleiner`,
  },
];

if (import.meta.env.DEV) {
  const assertions: boolean[] = [
    interpolateTemplate("Hi {{firstName}},", { firstName: "Sarah" }) ===
      "Hi Sarah,",
    interpolateTemplate("Hi {{firstName}},", { firstName: "" }) ===
      "Hi there,",
    interpolateTemplate("Hi {{firstName}},", { firstName: undefined }) ===
      "Hi there,",
    interpolateTemplate("Hi {{firstName}},", { firstName: "  " }) ===
      "Hi there,",
    interpolateTemplate("Hi {{firstName}} {{lastName}}", {
      firstName: "Mary",
      lastName: "O'Neil",
    }) === "Hi Mary O'Neil",
    interpolateTemplate("Hi {{fullName}}", {
      firstName: "Jean",
      lastName: "",
    }) === "Hi Jean",
    interpolateTemplate("Hi {{ firstName }}!", { firstName: "Sam" }) ===
      "Hi Sam!",
    interpolateTemplate("{{lastName}}", { firstName: "X" }) === "",
  ];
  assertions.forEach((result, idx) => {
    if (!result) {
      // eslint-disable-next-line no-console
      console.error(
        `reply-templates: interpolation assertion #${idx + 1} failed`,
      );
    }
  });
}
