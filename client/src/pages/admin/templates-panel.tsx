import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { adminFetch, AdminUnauthorizedError } from "@/lib/admin-auth";
import {
  ALLOWED_TEMPLATE_PLACEHOLDERS,
  findUnknownTemplatePlaceholders,
  insertReplyTemplateSchema,
  type ReplyTemplate,
} from "@shared/schema";

interface Props {
  authPassword: string;
  onUnauthorized: () => void;
}

type TemplateFormValues = z.infer<typeof insertReplyTemplateSchema>;

const TEMPLATES_QUERY_KEY = ["/api/admin/reply-templates"] as const;

const formSchema = insertReplyTemplateSchema.omit({ sortOrder: true });

const EMPTY_FORM: TemplateFormValues = {
  label: "",
  subject: "",
  body: "",
};

export function TemplatesPanel({ authPassword, onUnauthorized }: Props) {
  const { toast } = useToast();
  const [editing, setEditing] = useState<ReplyTemplate | null>(null);
  const [creating, setCreating] = useState(false);

  const wrap = async <T,>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) {
        onUnauthorized();
        throw new Error("Session expired. Please sign in again.");
      }
      throw err;
    }
  };

  const listQuery = useQuery<ReplyTemplate[]>({
    queryKey: TEMPLATES_QUERY_KEY,
    enabled: !!authPassword,
    queryFn: () =>
      wrap(() => adminFetch(authPassword, "/api/admin/reply-templates")),
  });

  const invalidateTemplates = () => {
    queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
  };

  const createMutation = useMutation({
    mutationFn: (data: TemplateFormValues) =>
      wrap(() =>
        adminFetch(authPassword, "/api/admin/reply-templates", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ),
    onSuccess: () => {
      toast({ title: "Template added" });
      invalidateTemplates();
      setCreating(false);
    },
    onError: (err: Error) => {
      toast({
        title: "Could not add template",
        description: err.message || "Try again",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (args: { id: number; data: TemplateFormValues }) =>
      wrap(() =>
        adminFetch(authPassword, `/api/admin/reply-templates/${args.id}`, {
          method: "PATCH",
          body: JSON.stringify(args.data),
        })
      ),
    onSuccess: () => {
      toast({ title: "Template saved" });
      invalidateTemplates();
      setEditing(null);
    },
    onError: (err: Error) => {
      toast({
        title: "Could not save template",
        description: err.message || "Try again",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      wrap(() =>
        adminFetch(authPassword, `/api/admin/reply-templates/${id}`, {
          method: "DELETE",
        })
      ),
    onSuccess: () => {
      toast({ title: "Template deleted" });
      invalidateTemplates();
    },
    onError: (err: Error) => {
      toast({
        title: "Could not delete template",
        description: err.message || "Try again",
        variant: "destructive",
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: number[]) =>
      wrap(() =>
        adminFetch(authPassword, "/api/admin/reply-templates/reorder", {
          method: "POST",
          body: JSON.stringify({ ids }),
        })
      ),
    onSuccess: () => {
      invalidateTemplates();
    },
    onError: (err: Error) => {
      toast({
        title: "Could not reorder",
        description: err.message || "Try again",
        variant: "destructive",
      });
    },
  });

  const move = (index: number, direction: -1 | 1) => {
    const list = listQuery.data ?? [];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    const [picked] = next.splice(index, 1);
    next.splice(target, 0, picked);
    // Optimistic update so the arrows feel snappy; the eventual refetch will
    // reconcile if the server disagrees.
    queryClient.setQueryData<ReplyTemplate[]>(TEMPLATES_QUERY_KEY, next);
    reorderMutation.mutate(next.map((t) => t.id));
  };

  const templates = listQuery.data ?? [];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-charcoal-light">
            These quick-reply pills show up in the email composer when you
            reply to an inquiry. Edits take effect the next time you open the
            composer.
          </p>
          <Button
            onClick={() => setCreating(true)}
            data-testid="button-add-template"
          >
            <Plus className="mr-1 h-4 w-4" /> Add template
          </Button>
        </div>

        <PlaceholdersHelp />

        {listQuery.isLoading ? (
          <div className="text-center py-10 text-charcoal-light">Loading…</div>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-charcoal-light">
              No templates yet. Add one to give yourself a quick-reply pill in
              the composer.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {templates.map((template, index) => {
              const unknown = findUnknownTemplatePlaceholders(
                template.subject,
                template.body
              );
              return (
                <Card
                  key={template.id}
                  data-testid={`row-template-${template.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">
                          {template.label}
                        </CardTitle>
                        <p className="mt-1 text-sm text-charcoal-light">
                          Subject: {template.subject}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Move up"
                          disabled={
                            index === 0 || reorderMutation.isPending
                          }
                          onClick={() => move(index, -1)}
                          data-testid={`button-template-up-${template.id}`}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Move down"
                          disabled={
                            index === templates.length - 1 ||
                            reorderMutation.isPending
                          }
                          onClick={() => move(index, 1)}
                          data-testid={`button-template-down-${template.id}`}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(template)}
                          data-testid={`button-template-edit-${template.id}`}
                        >
                          <Pencil className="mr-1 h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => {
                            if (
                              confirm(
                                `Delete the "${template.label}" template? This cannot be undone.`
                              )
                            ) {
                              deleteMutation.mutate(template.id);
                            }
                          }}
                          data-testid={`button-template-delete-${template.id}`}
                        >
                          <Trash2 className="mr-1 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm text-charcoal-light font-sans">
                      {template.body}
                    </pre>
                    {unknown.length > 0 && (
                      <div
                        className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
                        data-testid={`warning-template-${template.id}`}
                      >
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          <p className="font-medium">
                            Unknown placeholder
                            {unknown.length > 1 ? "s" : ""}:{" "}
                            {unknown.map((u) => `{{${u}}}`).join(", ")}
                          </p>
                          <p>
                            These won't be filled in — check for typos or use
                            one of the supported placeholders below.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <TemplateDialog
        open={creating}
        title="Add template"
        submitLabel="Add template"
        initial={EMPTY_FORM}
        isPending={createMutation.isPending}
        onClose={() => setCreating(false)}
        onSubmit={(data) => createMutation.mutate(data)}
      />

      <TemplateDialog
        open={!!editing}
        title="Edit template"
        submitLabel="Save changes"
        initial={
          editing
            ? {
                label: editing.label,
                subject: editing.subject,
                body: editing.body,
              }
            : EMPTY_FORM
        }
        isPending={updateMutation.isPending}
        onClose={() => setEditing(null)}
        onSubmit={(data) => {
          if (!editing) return;
          updateMutation.mutate({ id: editing.id, data });
        }}
      />
    </>
  );
}

function PlaceholdersHelp() {
  return (
    <Card className="bg-sage/5 border-sage/30">
      <CardContent className="py-4 text-sm text-charcoal-light">
        <p className="font-medium text-charcoal mb-1">
          Supported placeholders
        </p>
        <p>
          Use any of these in your subject or body and they'll be replaced
          with the patient's info when you open the composer:
        </p>
        <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
          {ALLOWED_TEMPLATE_PLACEHOLDERS.map((p) => (
            <li key={p} className="font-mono text-xs">
              {`{{${p}}}`}
            </li>
          ))}
        </ul>
        <p className="mt-2">
          Wrap a sentence in{" "}
          <span className="font-mono text-xs">{`{{#field}}…{{/field}}`}</span>{" "}
          to drop it entirely when the patient didn't fill that field in.
        </p>
      </CardContent>
    </Card>
  );
}

interface TemplateDialogProps {
  open: boolean;
  title: string;
  submitLabel: string;
  initial: TemplateFormValues;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: TemplateFormValues) => void;
}

function TemplateDialog({
  open,
  title,
  submitLabel,
  initial,
  isPending,
  onClose,
  onSubmit,
}: TemplateDialogProps) {
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initial,
  });

  // Reset whenever the dialog opens with a different starting template (e.g.
  // switching between editing two templates back-to-back, or toggling
  // between create and edit).
  useEffect(() => {
    if (open) form.reset(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial.label, initial.subject, initial.body]);

  const subject = form.watch("subject");
  const body = form.watch("body");
  const unknownPlaceholders = useMemo(
    () => findUnknownTemplatePlaceholders(subject ?? "", body ?? ""),
    [subject, body]
  );

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit({
      label: data.label.trim(),
      subject: data.subject.trim(),
      body: data.body,
    });
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        if (!next) onClose();
      }}
    >
      <DialogContent
        className="flex max-h-[90dvh] w-[calc(100vw-1rem)] flex-col gap-0 p-0 sm:max-w-2xl"
        data-testid="dialog-template-editor"
      >
        <DialogHeader className="border-b px-5 py-4 text-left">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pill label</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={60}
                        placeholder="e.g. First reply"
                        data-testid="input-template-label"
                      />
                    </FormControl>
                    <FormDescription>
                      Shown on the quick-reply button in the composer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={200}
                        placeholder="Following up from Dr. Kleiner, {{firstName}}"
                        data-testid="input-template-subject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={12}
                        className="min-h-[260px] font-mono text-sm"
                        placeholder={
                          "Hi {{firstName}},\n\nThanks for reaching out…"
                        }
                        data-testid="textarea-template-body"
                      />
                    </FormControl>
                    <FormDescription>
                      Use{" "}
                      {ALLOWED_TEMPLATE_PLACEHOLDERS.map((p, i) => (
                        <span key={p}>
                          <span className="font-mono">{`{{${p}}}`}</span>
                          {i < ALLOWED_TEMPLATE_PLACEHOLDERS.length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}{" "}
                      to insert patient info.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {unknownPlaceholders.length > 0 && (
                <div
                  className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
                  data-testid="warning-unknown-placeholders"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-medium">
                      Unknown placeholder
                      {unknownPlaceholders.length > 1 ? "s" : ""}:{" "}
                      {unknownPlaceholders
                        .map((u) => `{{${u}}}`)
                        .join(", ")}
                    </p>
                    <p>
                      Double-check the spelling — these will be left blank in
                      the email. You can still save if this is intentional.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="sticky bottom-0 gap-2 border-t bg-background px-5 py-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                data-testid="button-template-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                data-testid="button-template-submit"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
