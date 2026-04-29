import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Eye, EyeOff, Lock, Inbox, MessageSquareQuote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  adminFetch,
  AdminUnauthorizedError,
  clearAdminPassword,
  getAdminSessionExpiry,
  getStoredAdminPassword,
  storeAdminPassword,
} from "@/lib/admin-auth";
import { InquiriesPanel } from "@/pages/admin/inquiries-panel";
import { TestimonialsPanel } from "@/pages/admin/testimonials-panel";

type TabValue = "inquiries" | "testimonials";

function tabFromPath(path: string): TabValue {
  return path.startsWith("/admin/testimonials") ? "testimonials" : "inquiries";
}

export default function Admin() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>(tabFromPath(location));

  useEffect(() => {
    const stored = getStoredAdminPassword();
    if (stored) setAuthPassword(stored);
  }, []);

  // Keep the active tab in sync with URL changes (back/forward buttons,
  // direct deep-links from email notifications, etc.).
  useEffect(() => {
    setActiveTab(tabFromPath(location));
  }, [location]);

  // Auto-logout when the 24-hour session expires while the page stays open.
  // Uses the absolute expiry stored alongside the password so reloads don't
  // reset the clock.
  useEffect(() => {
    if (!authPassword) return;
    const expiry = getAdminSessionExpiry();
    if (!expiry) {
      clearAdminPassword();
      setAuthPassword("");
      return;
    }
    const ms = expiry - Date.now();
    if (ms <= 0) {
      clearAdminPassword();
      setAuthPassword("");
      return;
    }
    const timer = window.setTimeout(() => {
      clearAdminPassword();
      setAuthPassword("");
      toast({
        title: "Session expired",
        description: "Please sign in again to continue.",
      });
    }, ms);
    return () => window.clearTimeout(timer);
  }, [authPassword, toast]);

  const isAuthenticated = !!authPassword;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      // Validate the password against any admin endpoint.
      await adminFetch(password, "/api/contact-submissions");
      storeAdminPassword(password);
      setAuthPassword(password);
      setPassword("");
    } catch (err) {
      setAuthError(
        err instanceof AdminUnauthorizedError
          ? "Incorrect password"
          : err instanceof Error
            ? err.message
            : "Sign in failed"
      );
    }
  };

  const handleLogout = () => {
    clearAdminPassword();
    setAuthPassword("");
  };

  const handleUnauthorized = () => {
    clearAdminPassword();
    setAuthPassword("");
  };

  const handleTabChange = (value: string) => {
    const v = value as TabValue;
    setActiveTab(v);
    const target = v === "testimonials" ? "/admin/testimonials" : "/admin";
    if (location !== target) setLocation(target);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Admin Access
            </CardTitle>
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
                  data-testid="input-admin-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {authError && (
                <p className="text-red-500 text-sm">{authError}</p>
              )}
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal">
              Admin Dashboard
            </h1>
            <p className="text-sm text-charcoal-light">
              Patient inquiries and testimonial moderation, in one place.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-2">
            <TabsTrigger value="inquiries" data-testid="tab-inquiries">
              <Inbox className="w-4 h-4 mr-1.5" /> Inquiries
            </TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="tab-testimonials">
              <MessageSquareQuote className="w-4 h-4 mr-1.5" /> Testimonials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries" className="mt-4">
            <InquiriesPanel
              authPassword={authPassword}
              onUnauthorized={handleUnauthorized}
            />
          </TabsContent>

          <TabsContent value="testimonials" className="mt-4">
            <TestimonialsPanel
              authPassword={authPassword}
              onUnauthorized={handleUnauthorized}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
