import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, User, MessageSquare, Search, X } from "lucide-react";
import { format } from "date-fns";
import { adminFetch, AdminUnauthorizedError } from "@/lib/admin-auth";

type SortKey = "newest" | "oldest" | "name";
type ContactFilter = "all" | "email" | "phone";
type DateFilter = "all" | "7d" | "30d";

interface ContactSubmission {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  howDidYouHear: string | null;
  activities: string | null;
  contactMethod: string;
  createdAt: string;
}

interface Props {
  authPassword: string;
  onUnauthorized: () => void;
}

const ADMIN_GMAIL_ACCOUNT = "kleinerdpt@gmail.com";

function gmailComposeUrl(toEmail: string): string {
  const params = new URLSearchParams({
    authuser: ADMIN_GMAIL_ACCOUNT,
    view: "cm",
    fs: "1",
    to: toEmail,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function googleVoiceCallUrl(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  let e164 = "";
  if (digits.length === 11 && digits.startsWith("1")) {
    e164 = `+${digits}`;
  } else if (digits.length === 10) {
    e164 = `+1${digits}`;
  } else if (digits.length > 0) {
    e164 = `+${digits}`;
  }
  if (!e164) return "https://voice.google.com/u/0/calls";
  return `https://voice.google.com/u/0/calls?a=nc,${encodeURIComponent(e164)}`;
}

export function InquiriesPanel({ authPassword, onUnauthorized }: Props) {
  const [search, setSearch] = useState("");
  const [contactFilter, setContactFilter] = useState<ContactFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const { data: submissions, isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact-submissions"],
    enabled: !!authPassword,
    queryFn: async () => {
      try {
        return await adminFetch(authPassword, "/api/contact-submissions");
      } catch (err) {
        if (err instanceof AdminUnauthorizedError) {
          onUnauthorized();
          throw new Error("Session expired. Please sign in again.");
        }
        throw err;
      }
    },
  });

  const visible = useMemo(() => {
    if (!submissions) return [] as ContactSubmission[];
    const q = search.trim().toLowerCase();
    const now = Date.now();
    const cutoff =
      dateFilter === "7d"
        ? now - 7 * 24 * 60 * 60 * 1000
        : dateFilter === "30d"
          ? now - 30 * 24 * 60 * 60 * 1000
          : 0;

    const filtered = submissions.filter((s) => {
      if (contactFilter !== "all") {
        const method = (s.contactMethod || "").toLowerCase();
        if (!method.includes(contactFilter)) return false;
      }
      if (cutoff && new Date(s.createdAt).getTime() < cutoff) return false;
      if (!q) return true;
      const haystack = [
        s.firstName,
        s.lastName,
        s.email,
        s.phone,
        s.activities ?? "",
        s.howDidYouHear ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "name") {
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      }
      const at = new Date(a.createdAt).getTime();
      const bt = new Date(b.createdAt).getTime();
      return sort === "oldest" ? at - bt : bt - at;
    });
    return sorted;
  }, [submissions, search, contactFilter, dateFilter, sort]);

  if (isLoading) {
    return <div className="text-center py-8 text-charcoal-light">Loading…</div>;
  }

  if (!submissions || submissions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-10 text-charcoal-light">
          No client requests yet.
        </CardContent>
      </Card>
    );
  }

  const filtersActive =
    !!search.trim() ||
    contactFilter !== "all" ||
    dateFilter !== "all" ||
    sort !== "newest";

  const clearFilters = () => {
    setSearch("");
    setContactFilter("all");
    setDateFilter("all");
    setSort("newest");
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light pointer-events-none" />
            <Input
              type="search"
              placeholder="Search name, email, phone, activities…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-inquiry-search"
            />
          </div>
          <Select
            value={contactFilter}
            onValueChange={(v) => setContactFilter(v as ContactFilter)}
          >
            <SelectTrigger
              className="w-full md:w-[170px]"
              data-testid="select-contact-method"
            >
              <SelectValue placeholder="Contact method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All contact methods</SelectItem>
              <SelectItem value="email">Email only</SelectItem>
              <SelectItem value="phone">Phone only</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={dateFilter}
            onValueChange={(v) => setDateFilter(v as DateFilter)}
          >
            <SelectTrigger
              className="w-full md:w-[160px]"
              data-testid="select-date-range"
            >
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger
              className="w-full md:w-[170px]"
              data-testid="select-sort"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-charcoal-light">
            Showing{" "}
            <span className="font-semibold text-charcoal">
              {visible.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-charcoal">
              {submissions.length}
            </span>{" "}
            {submissions.length === 1 ? "submission" : "submissions"}
          </p>
          {filtersActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-charcoal-light hover:text-charcoal"
              data-testid="button-clear-filters"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10 text-charcoal-light">
            No submissions match your filters.
          </CardContent>
        </Card>
      ) : null}

      {visible.map((submission) => (
        <Card key={submission.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {submission.firstName} {submission.lastName}
              </CardTitle>
              <Badge variant="outline">
                {format(
                  new Date(submission.createdAt),
                  "MMM d, yyyy 'at' h:mm a"
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <a
                  href={gmailComposeUrl(submission.email)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {submission.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <a
                  href={googleVoiceCallUrl(submission.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {submission.phone}
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">
                  Preferred contact method:
                </span>
                <Badge variant="secondary">{submission.contactMethod}</Badge>
              </div>

              {submission.howDidYouHear && (
                <div className="text-sm">
                  <span className="font-medium">How they heard about us:</span>
                  <span className="ml-2 text-charcoal-light">
                    {submission.howDidYouHear}
                  </span>
                </div>
              )}

              {submission.activities && (
                <div className="text-sm">
                  <span className="font-medium">
                    Activities they want to return to:
                  </span>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-charcoal-light">
                      {submission.activities}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() =>
                  window.open(
                    gmailComposeUrl(submission.email),
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                Send Email
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open(
                    googleVoiceCallUrl(submission.phone),
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                Call
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
