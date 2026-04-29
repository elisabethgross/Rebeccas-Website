import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import {
  adminFetch,
  AdminUnauthorizedError,
} from "@/lib/admin-auth";

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

export function InquiriesPanel({ authPassword, onUnauthorized }: Props) {
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

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-charcoal-light">
          Total submissions:{" "}
          <span className="font-semibold text-charcoal">
            {submissions.length}
          </span>
        </p>
      </div>
      {submissions.map((submission) => (
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
                  href={`mailto:${submission.email}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {submission.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <a
                  href={`tel:${submission.phone}`}
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
                  window.open(`mailto:${submission.email}`, "_blank")
                }
              >
                Send Email
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open(`tel:${submission.phone}`, "_blank")
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
