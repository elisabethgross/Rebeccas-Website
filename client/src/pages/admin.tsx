import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Mail, Phone, Calendar, User, MessageSquare } from "lucide-react";
import { format } from "date-fns";

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

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // Simple password check (in production, use proper authentication)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password - in production, use proper authentication
    if (password === "admin123") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password");
    }
  };

  const { data: submissions, isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact-submissions"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Client Requests</h1>
          <Button
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {submissions && submissions.length > 0 ? (
              <>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">
                    Total submissions: <span className="font-semibold">{submissions.length}</span>
                  </p>
                </div>
                {submissions.map((submission) => (
                  <Card key={submission.id} className="w-full">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {submission.firstName} {submission.lastName}
                        </CardTitle>
                        <Badge variant="outline">
                          {format(new Date(submission.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                              {submission.email}
                            </a>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
                              {submission.phone}
                            </a>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Preferred contact method:</span>
                          <Badge variant="secondary">{submission.contactMethod}</Badge>
                        </div>

                        {submission.howDidYouHear && (
                          <div className="text-sm">
                            <span className="font-medium">How they heard about us:</span>
                            <span className="ml-2 text-gray-600">{submission.howDidYouHear}</span>
                          </div>
                        )}

                        {submission.activities && (
                          <div className="text-sm">
                            <span className="font-medium">Activities they want to return to:</span>
                            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-700">{submission.activities}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => window.open(`mailto:${submission.email}`, '_blank')}
                        >
                          Send Email
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${submission.phone}`, '_blank')}
                        >
                          Call
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No client requests yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}