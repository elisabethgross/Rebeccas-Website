import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  adminCreateTestimonialSchema,
  adminUpdateTestimonialSchema,
  type AdminCreateTestimonialInput,
  type AdminUpdateTestimonialInput,
  type Testimonial,
} from "@shared/schema";
import {
  CheckCircle,
  XCircle,
  EyeOff,
  Trash2,
  Star,
  Eye,
  Plus,
  Lock,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";
import {
  adminFetch,
  AdminUnauthorizedError,
  clearAdminPassword,
  getStoredAdminPassword,
  storeAdminPassword,
} from "@/lib/admin-auth";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    approved: "bg-green-100 text-green-800 hover:bg-green-100",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100",
    hidden: "bg-gray-200 text-gray-700 hover:bg-gray-200",
  };
  return (
    <Badge className={`${map[status] || ""} capitalize`} variant="secondary">
      {status}
    </Badge>
  );
}

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [password, setPassword] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [editing, setEditing] = useState<Testimonial | null>(null);

  useEffect(() => {
    const stored = getStoredAdminPassword();
    if (stored) setAuthPassword(stored);
  }, []);

  const isAuthed = !!authPassword;

  const listQuery = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
    enabled: isAuthed,
    queryFn: async () => {
      try {
        return await adminFetch(authPassword, "/api/admin/testimonials");
      } catch (err: any) {
        if (err instanceof AdminUnauthorizedError) {
          clearAdminPassword();
          setAuthPassword("");
          throw new Error("Session expired. Please sign in again.");
        }
        throw err;
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (args: { id: number; status: string }) =>
      adminFetch(authPassword, `/api/admin/testimonials/${args.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: args.status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Updated" });
    },
    onError: (err: any) => {
      toast({
        title: "Update failed",
        description: err?.message || "Try again",
        variant: "destructive",
      });
    },
  });

  const editForm = useForm<AdminUpdateTestimonialInput>({
    resolver: zodResolver(adminUpdateTestimonialSchema),
    defaultValues: {
      firstName: "",
      lastInitial: "",
      activityRole: "",
      quote: "",
      rating: undefined,
    },
  });

  useEffect(() => {
    if (editing) {
      editForm.reset({
        firstName: editing.firstName,
        lastInitial: editing.lastInitial ?? "",
        activityRole: editing.activityRole ?? "",
        quote: editing.quote,
        rating: editing.rating ?? undefined,
      });
    }
  }, [editing, editForm]);

  const editMutation = useMutation({
    mutationFn: async (args: {
      id: number;
      data: AdminUpdateTestimonialInput;
    }) =>
      adminFetch(authPassword, `/api/admin/testimonials/${args.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...args.data,
          lastInitial:
            args.data.lastInitial && args.data.lastInitial.trim() !== ""
              ? args.data.lastInitial.trim()
              : null,
          activityRole:
            args.data.activityRole && args.data.activityRole.trim() !== ""
              ? args.data.activityRole.trim()
              : null,
          rating: args.data.rating ?? null,
        }),
      }),
    onSuccess: () => {
      toast({ title: "Saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setEditing(null);
    },
    onError: (err: any) => {
      toast({
        title: "Save failed",
        description: err?.message || "Try again",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) =>
      adminFetch(authPassword, `/api/admin/testimonials/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Deleted" });
    },
    onError: (err: any) => {
      toast({
        title: "Delete failed",
        description: err?.message || "Try again",
        variant: "destructive",
      });
    },
  });

  const createForm = useForm<AdminCreateTestimonialInput>({
    resolver: zodResolver(adminCreateTestimonialSchema),
    defaultValues: {
      firstName: "",
      lastInitial: "",
      activityRole: "",
      quote: "",
      rating: undefined,
      consentGiven: true,
      status: "approved",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AdminCreateTestimonialInput) =>
      adminFetch(authPassword, "/api/admin/testimonials", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          lastInitial: data.lastInitial?.trim() || undefined,
          activityRole: data.activityRole?.trim() || undefined,
          rating: data.rating ?? undefined,
        }),
      }),
    onSuccess: () => {
      toast({ title: "Testimonial added" });
      createForm.reset({
        firstName: "",
        lastInitial: "",
        activityRole: "",
        quote: "",
        rating: undefined,
        consentGiven: true,
        status: "approved",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
    onError: (err: any) => {
      toast({
        title: "Could not add",
        description: err?.message || "Try again",
        variant: "destructive",
      });
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      await adminFetch(password, "/api/admin/testimonials");
      storeAdminPassword(password);
      setAuthPassword(password);
      setPassword("");
    } catch (err: any) {
      setAuthError(
        err instanceof AdminUnauthorizedError
          ? "Incorrect password"
          : err?.message || "Sign in failed"
      );
    }
  };

  const handleLogout = () => {
    clearAdminPassword();
    setAuthPassword("");
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-4 h-4" /> Testimonials Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-admin-password"
              />
              {authError && (
                <p className="text-red-600 text-sm">{authError}</p>
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

  const all = listQuery.data ?? [];
  const pending = all.filter((t) => t.status === "pending");
  const approved = all.filter((t) => t.status === "approved");
  const other = all.filter(
    (t) => t.status !== "pending" && t.status !== "approved"
  );

  const renderRow = (t: Testimonial) => (
    <Card key={t.id} className="border" data-testid={`row-testimonial-${t.id}`}>
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div>
            <div className="font-semibold text-charcoal">
              {t.firstName}
              {t.lastInitial ? ` ${t.lastInitial.toUpperCase()}.` : ""}
              {t.activityRole && (
                <span className="text-charcoal-light font-normal">
                  {" — "}
                  {t.activityRole}
                </span>
              )}
            </div>
            <div className="text-xs text-charcoal-light mt-1">
              Submitted {format(new Date(t.submittedAt), "PP")} • source{" "}
              {t.source}
            </div>
          </div>
          <StatusBadge status={t.status} />
        </div>

        {t.rating ? (
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (t.rating ?? 0)
                    ? "fill-coral text-coral"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        ) : null}

        <p className="text-charcoal-light text-sm whitespace-pre-wrap">
          {t.quote}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditing(t)}
            data-testid={`button-edit-${t.id}`}
          >
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </Button>
          {t.status !== "approved" && (
            <Button
              size="sm"
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() =>
                updateMutation.mutate({ id: t.id, status: "approved" })
              }
              data-testid={`button-approve-${t.id}`}
            >
              <CheckCircle className="w-4 h-4 mr-1" /> Approve
            </Button>
          )}
          {t.status !== "rejected" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateMutation.mutate({ id: t.id, status: "rejected" })
              }
              data-testid={`button-reject-${t.id}`}
            >
              <XCircle className="w-4 h-4 mr-1" /> Reject
            </Button>
          )}
          {t.status !== "hidden" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateMutation.mutate({ id: t.id, status: "hidden" })
              }
              data-testid={`button-hide-${t.id}`}
            >
              <EyeOff className="w-4 h-4 mr-1" /> Hide
            </Button>
          )}
          {t.status === "hidden" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateMutation.mutate({ id: t.id, status: "approved" })
              }
            >
              <Eye className="w-4 h-4 mr-1" /> Unhide
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
            onClick={() => {
              if (
                confirm(
                  `Permanently delete this testimonial from ${t.firstName}? This cannot be undone.`
                )
              ) {
                deleteMutation.mutate(t.id);
              }
            }}
            data-testid={`button-delete-${t.id}`}
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal">
              Testimonials Admin
            </h1>
            <p className="text-sm text-charcoal-light">
              Approve patient submissions or add ones you collected privately.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" data-testid="tab-pending">
              Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="approved" data-testid="tab-approved">
              Approved ({approved.length})
            </TabsTrigger>
            <TabsTrigger value="other" data-testid="tab-other">
              Rejected/Hidden ({other.length})
            </TabsTrigger>
            <TabsTrigger value="add" data-testid="tab-add">
              <Plus className="w-4 h-4 mr-1" /> Add Manually
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3 mt-4">
            {listQuery.isLoading ? (
              <div className="text-center py-10 text-charcoal-light">
                Loading…
              </div>
            ) : pending.length === 0 ? (
              <div className="text-center py-10 text-charcoal-light bg-white rounded-md border">
                No pending submissions.
              </div>
            ) : (
              pending.map(renderRow)
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-3 mt-4">
            {approved.length === 0 ? (
              <div className="text-center py-10 text-charcoal-light bg-white rounded-md border">
                Nothing approved yet.
              </div>
            ) : (
              approved.map(renderRow)
            )}
          </TabsContent>

          <TabsContent value="other" className="space-y-3 mt-4">
            {other.length === 0 ? (
              <div className="text-center py-10 text-charcoal-light bg-white rounded-md border">
                Nothing rejected or hidden.
              </div>
            ) : (
              other.map(renderRow)
            )}
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Add a testimonial manually</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...createForm}>
                  <form
                    onSubmit={createForm.handleSubmit((d) =>
                      createMutation.mutate(d)
                    )}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-3 gap-3">
                      <FormField
                        control={createForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="lastInitial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last initial</FormLabel>
                            <FormControl>
                              <Input
                                maxLength={2}
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={createForm.control}
                      name="activityRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity / role</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="quote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Testimonial</FormLabel>
                          <FormControl>
                            <Textarea rows={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (optional)</FormLabel>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => {
                              const active = (field.value ?? 0) >= s;
                              return (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() =>
                                    field.onChange(
                                      field.value === s ? undefined : s
                                    )
                                  }
                                  className="p-1"
                                  aria-label={`${s} stars`}
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      active
                                        ? "fill-coral text-coral"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="consentGiven"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start gap-3 rounded-md border p-3">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(c) =>
                                field.onChange(c === true)
                              }
                            />
                          </FormControl>
                          <div className="text-sm text-charcoal">
                            I have written or verbal permission from this
                            patient to publish their testimonial.
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="bg-sage text-white hover:bg-sage-dark"
                    >
                      {createMutation.isPending
                        ? "Adding…"
                        : "Add and publish"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog
          open={!!editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        >
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit testimonial</DialogTitle>
            </DialogHeader>
            {editing && (
              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit((data) =>
                    editMutation.mutate({ id: editing.id, data })
                  )}
                  className="space-y-4"
                  data-testid="form-edit-testimonial"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      control={editForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              data-testid="input-edit-first-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="lastInitial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last initial</FormLabel>
                          <FormControl>
                            <Input
                              maxLength={2}
                              {...field}
                              value={field.value ?? ""}
                              data-testid="input-edit-last-initial"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={editForm.control}
                    name="activityRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity / role</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            data-testid="input-edit-activity-role"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="quote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonial</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            {...field}
                            value={field.value ?? ""}
                            data-testid="input-edit-quote"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => {
                            const active = (field.value ?? 0) >= s;
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() =>
                                  field.onChange(
                                    field.value === s ? undefined : s
                                  )
                                }
                                className="p-1"
                                aria-label={`${s} stars`}
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    active
                                      ? "fill-coral text-coral"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            );
                          })}
                          {field.value ? (
                            <button
                              type="button"
                              onClick={() => field.onChange(undefined)}
                              className="ml-2 text-xs text-charcoal-light underline"
                            >
                              clear
                            </button>
                          ) : null}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setEditing(null)}
                      disabled={editMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={editMutation.isPending}
                      className="bg-sage text-white hover:bg-sage-dark"
                      data-testid="button-save-edit"
                    >
                      {editMutation.isPending ? "Saving…" : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
