// Re-export the canonical type so consumers in the client can keep importing
// `ReplyTemplate` from this module while it stays in sync with the database
// schema in `@shared/schema`.
export type { ReplyTemplate } from "@shared/schema";

export interface InterpolationContext {
  firstName?: string | null;
  lastName?: string | null;
  activities?: string | null;
  referral?: string | null;
}

const FIRST_NAME_FALLBACK = "there";

const norm = (value: string | null | undefined): string =>
  (value ?? "").trim();

// Activities are written by the patient in a freeform textarea, often on a
// phone where the first letter gets auto-capitalized. Templates substitute
// them mid-sentence (e.g. "wanting to get back to {{activities}}"), so we
// lowercase the first character, but only when the first word looks like
// an everyday sentence-cased word (one leading capital followed by all
// lowercase letters). Brand names with internal capitals like "TikTok",
// "CrossFit", or already-lowercase starts like "iPhone" are preserved.
// We also trim trailing sentence-ending punctuation so the template's own
// punctuation doesn't double up.
export function normalizeActivitiesForInline(raw: string): string {
  let s = raw.trim();
  if (!s) return s;
  s = s.replace(/[\s.!?,;:]+$/, "");
  const firstWord = s.match(/^(\S+)/)?.[1] ?? "";
  if (/^[A-Z][a-z]+$/.test(firstWord)) {
    s = s.charAt(0).toLowerCase() + s.slice(1);
  }
  return s;
}

// "How did you hear about us?" is a select whose raw values are short codes
// ("google", "referral", "social", "doctor", "other"). Dropping those codes
// straight into a sentence produces awkward output like "finding me through
// other". We map each known code to a friendly inline phrase. "Other" is
// intentionally absent (and explicitly handled below) so the conditional
// section is dropped, since there's no graceful way to say "found me
// through other" mid-sentence. Unknown future values fall through unchanged.
const REFERRAL_INLINE_PHRASES: Record<string, string> = {
  referral: "a referral from a friend or family member",
  google: "a Google search",
  social: "social media",
  doctor: "a doctor's referral",
};

export function normalizeReferralForInline(raw: string): string {
  const key = raw.trim().toLowerCase();
  if (!key || key === "other") return "";
  return REFERRAL_INLINE_PHRASES[key] ?? raw.trim();
}

export function interpolateTemplate(
  template: string,
  context: InterpolationContext,
): string {
  const firstNameRaw = norm(context.firstName);
  const lastNameRaw = norm(context.lastName);
  const activities = normalizeActivitiesForInline(norm(context.activities));
  const referral = normalizeReferralForInline(norm(context.referral));

  const firstName = firstNameRaw || FIRST_NAME_FALLBACK;
  const lastName = lastNameRaw;
  const fullName = [firstNameRaw, lastNameRaw].filter(Boolean).join(" ");

  const fields: Record<string, { value: string; present: boolean }> = {
    firstName: { value: firstName, present: Boolean(firstNameRaw) },
    lastName: { value: lastName, present: Boolean(lastNameRaw) },
    fullName: { value: fullName, present: Boolean(fullName) },
    activities: { value: activities, present: Boolean(activities) },
    referral: { value: referral, present: Boolean(referral) },
  };

  // Phase 1: handle conditional sections {{#field}}...{{/field}}.
  // When the field is empty, the section AND any single trailing newline
  // are dropped so authors can place a sentence on its own line without
  // leaving a blank gap. When the field is present, the wrapping tags are
  // removed but the inner content (including any {{field}} placeholders)
  // is preserved for phase 2.
  const sectionRegex =
    /\{\{#\s*(\w+)\s*\}\}([\s\S]*?)\{\{\/\s*(\w+)\s*\}\}(\n?)/g;
  let result = template.replace(
    sectionRegex,
    (full, openKey: string, content: string, closeKey: string, trailingNewline: string) => {
      if (openKey !== closeKey) return full;
      const field = fields[openKey];
      if (field && field.present) {
        return content + trailingNewline;
      }
      return "";
    },
  );

  // Phase 2: replace bare {{field}} placeholders. Unknown or empty fields
  // render as an empty string (use a conditional section to omit the
  // surrounding sentence cleanly).
  result = result.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const field = fields[key];
    if (!field) return "";
    return field.value;
  });

  return result;
}

if (import.meta.env.DEV) {
  const longActivities =
    "hiking long alpine trails, trail running, lifting heavy, paddleboarding, " +
    "and chasing after my two kids on the playground without my knee giving out";
  const multiLineActivities = "running\nyoga\ncycling";

  const assertions: { name: string; pass: boolean }[] = [
    {
      name: "firstName basic",
      pass:
        interpolateTemplate("Hi {{firstName}},", { firstName: "Sarah" }) ===
        "Hi Sarah,",
    },
    {
      name: "firstName empty fallback",
      pass:
        interpolateTemplate("Hi {{firstName}},", { firstName: "" }) ===
        "Hi there,",
    },
    {
      name: "firstName undefined fallback",
      pass:
        interpolateTemplate("Hi {{firstName}},", { firstName: undefined }) ===
        "Hi there,",
    },
    {
      name: "firstName whitespace fallback",
      pass:
        interpolateTemplate("Hi {{firstName}},", { firstName: "  " }) ===
        "Hi there,",
    },
    {
      name: "firstName + lastName",
      pass:
        interpolateTemplate("Hi {{firstName}} {{lastName}}", {
          firstName: "Mary",
          lastName: "O'Neil",
        }) === "Hi Mary O'Neil",
    },
    {
      name: "fullName drops empty lastName",
      pass:
        interpolateTemplate("Hi {{fullName}}", {
          firstName: "Jean",
          lastName: "",
        }) === "Hi Jean",
    },
    {
      name: "tolerates internal whitespace in tag",
      pass:
        interpolateTemplate("Hi {{ firstName }}!", { firstName: "Sam" }) ===
        "Hi Sam!",
    },
    {
      name: "missing lastName renders empty",
      pass: interpolateTemplate("{{lastName}}", { firstName: "X" }) === "",
    },
    {
      name: "activities placeholder",
      pass:
        interpolateTemplate("getting back to {{activities}}", {
          activities: "hiking",
        }) === "getting back to hiking",
    },
    {
      name: "referral placeholder maps known code to inline phrase",
      pass:
        interpolateTemplate("found me through {{referral}}", {
          referral: "google",
        }) === "found me through a Google search",
    },
    {
      name: "missing activities renders empty",
      pass: interpolateTemplate("{{activities}}", {}) === "",
    },
    {
      name: "section kept when field present",
      pass:
        interpolateTemplate(
          "Hello.{{#activities}} You mentioned {{activities}}.{{/activities}} Bye.",
          { activities: "running" },
        ) === "Hello. You mentioned running. Bye.",
    },
    {
      name: "section kept when referral maps to phrase",
      pass:
        interpolateTemplate(
          "Hello.{{#referral}} I appreciate finding me through {{referral}}.{{/referral}} Bye.",
          { referral: "doctor" },
        ) ===
        "Hello. I appreciate finding me through a doctor's referral. Bye.",
    },
    {
      name: "section dropped when referral is 'other'",
      pass:
        interpolateTemplate(
          "Hello.{{#referral}} via {{referral}}.{{/referral}} Bye.",
          { referral: "other" },
        ) === "Hello. Bye.",
    },
    {
      name: "referral 'social' maps to social media",
      pass:
        interpolateTemplate("through {{referral}}", { referral: "social" }) ===
        "through social media",
    },
    {
      name: "referral 'referral' maps to friend/family phrase",
      pass:
        interpolateTemplate("through {{referral}}", {
          referral: "referral",
        }) === "through a referral from a friend or family member",
    },
    {
      name: "referral unknown future code falls through unchanged",
      pass:
        interpolateTemplate("through {{referral}}", {
          referral: "podcast",
        }) === "through podcast",
    },
    {
      name: "activities lowercases auto-capitalized first letter",
      pass:
        interpolateTemplate("back to {{activities}}", {
          activities: "Tying bows",
        }) === "back to tying bows",
    },
    {
      name: "activities preserves brand-name internal caps (TikTok)",
      pass:
        interpolateTemplate("back to {{activities}}", {
          activities: "TikTok dance routines",
        }) === "back to TikTok dance routines",
    },
    {
      name: "activities preserves brand-name internal caps (CrossFit)",
      pass:
        interpolateTemplate("back to {{activities}}", {
          activities: "CrossFit and yoga",
        }) === "back to CrossFit and yoga",
    },
    {
      name: "activities preserves leading-lowercase brands (iPhone)",
      pass:
        interpolateTemplate("back to {{activities}}", {
          activities: "iPhone repair as a hobby",
        }) === "back to iPhone repair as a hobby",
    },
    {
      name: "activities trims trailing period",
      pass:
        interpolateTemplate("back to {{activities}}.", {
          activities: "running.",
        }) === "back to running.",
    },
    {
      name: "activities trims multiple trailing punctuation",
      pass:
        interpolateTemplate("back to {{activities}}.", {
          activities: "running!!! ",
        }) === "back to running.",
    },
    {
      name: "section dropped when field empty",
      pass:
        interpolateTemplate(
          "Hello.{{#activities}} You mentioned {{activities}}.{{/activities}} Bye.",
          { activities: "" },
        ) === "Hello. Bye.",
    },
    {
      name: "section dropped when field missing",
      pass:
        interpolateTemplate(
          "Hello.{{#referral}} via {{referral}}.{{/referral}} Bye.",
          {},
        ) === "Hello. Bye.",
    },
    {
      name: "empty section on its own line consumes trailing newline",
      pass:
        interpolateTemplate(
          "Hi.\n{{#activities}}A: {{activities}}.{{/activities}}\nBye.",
          { activities: "" },
        ) === "Hi.\nBye.",
    },
    {
      name: "present section preserves trailing newline",
      pass:
        interpolateTemplate(
          "Hi.\n{{#activities}}A: {{activities}}.{{/activities}}\nBye.",
          { activities: "running" },
        ) === "Hi.\nA: running.\nBye.",
    },
    {
      name: "very long activities text inlined as-is",
      pass:
        interpolateTemplate("back to {{activities}}", {
          activities: longActivities,
        }) === `back to ${longActivities}`,
    },
    {
      name: "multi-line activities preserved",
      pass:
        interpolateTemplate("activities: {{activities}}", {
          activities: multiLineActivities,
        }) === `activities: ${multiLineActivities}`,
    },
    {
      name: "special characters in activities preserved",
      pass:
        interpolateTemplate("doing {{activities}}", {
          activities: "rock-climbing & yoga (5x/week) <3",
        }) === "doing rock-climbing & yoga (5x/week) <3",
    },
    {
      name: "special characters in referral preserved",
      pass:
        interpolateTemplate("via {{referral}}", {
          referral: 'a friend\'s "highly recommended" referral',
        }) === 'via a friend\'s "highly recommended" referral',
    },
    {
      name: "activities trimmed for presence + value",
      pass:
        interpolateTemplate(
          "{{#activities}}got: {{activities}}{{/activities}}",
          { activities: "  running  " },
        ) === "got: running",
    },
    {
      name: "whitespace-only activities treated as empty",
      pass:
        interpolateTemplate(
          "Hi.{{#activities}} A: {{activities}}.{{/activities}} Bye.",
          { activities: "   " },
        ) === "Hi. Bye.",
    },
    {
      name: "both sections present",
      pass:
        interpolateTemplate(
          "Hi.{{#referral}} via {{referral}}.{{/referral}}{{#activities}} A: {{activities}}.{{/activities}} Bye.",
          { referral: "google", activities: "running" },
        ) === "Hi. via a Google search. A: running. Bye.",
    },
    {
      name: "only one of two sections present",
      pass:
        interpolateTemplate(
          "Hi.{{#referral}} via {{referral}}.{{/referral}}{{#activities}} A: {{activities}}.{{/activities}} Bye.",
          { activities: "running" },
        ) === "Hi. A: running. Bye.",
    },
    {
      name: "unknown section name removes block",
      pass:
        interpolateTemplate("Hi{{#unknown}} x {{/unknown}}.", {}) === "Hi.",
    },
  ];

  assertions.forEach(({ name, pass }, idx) => {
    if (!pass) {
      // eslint-disable-next-line no-console
      console.error(
        `reply-templates: interpolation assertion #${idx + 1} (${name}) failed`,
      );
    }
  });
}
