import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { adminFetch, AdminUnauthorizedError } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";

const composerSchema = z.object({
  to: z.string().email(),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject must be 200 characters or fewer"),
  body: z
    .string()
    .min(1, "Message body is required")
    .max(10000, "Body must be 10,000 characters or fewer"),
});

type ComposerValues = z.infer<typeof composerSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authPassword: string;
  onUnauthorized: () => void;
  toEmail: string;
  defaultSubject: string;
  recipientName: string;
}

export function EmailComposerDialog({
  open,
  onOpenChange,
  authPassword,
  onUnauthorized,
  toEmail,
  defaultSubject,
  recipientName,
}: Props) {
  const { toast } = useToast();

  const form = useForm<ComposerValues>({
    resolver: zodResolver(composerSchema),
    defaultValues: {
      to: toEmail,
      subject: defaultSubject,
      body: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        to: toEmail,
        subject: defaultSubject,
        body: "",
      });
    }
  }, [open, toEmail, defaultSubject, form]);

  const sendMutation = useMutation({
    mutationFn: async (values: ComposerValues) => {
      try {
        return await adminFetch(authPassword, "/api/admin/send-inquiry-email", {
          method: "POST",
          body: JSON.stringify(values),
        });
      } catch (err) {
        if (err instanceof AdminUnauthorizedError) {
          onUnauthorized();
          throw new Error("Session expired. Please sign in again.");
        }
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: "Email sent",
        description: `Email sent to ${toEmail}`,
        className: "bg-green-600 text-white border-green-700",
      });
      form.reset({ to: toEmail, subject: defaultSubject, body: "" });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to send email",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    sendMutation.mutate(values);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (sendMutation.isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="flex max-h-[90dvh] w-[calc(100vw-1rem)] flex-col gap-0 p-0 sm:max-w-lg"
        data-testid="dialog-email-composer"
      >
        <DialogHeader className="border-b px-5 py-4 text-left">
          <DialogTitle>Send email</DialogTitle>
          <DialogDescription>
            Sending from Dr. Rebecca Kleiner &lt;kleinerdpt@gmail.com&gt;
            {recipientName ? ` to ${recipientName}.` : "."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        type="email"
                        className="bg-gray-50 text-charcoal"
                        data-testid="input-compose-to"
                      />
                    </FormControl>
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
                        type="text"
                        inputMode="text"
                        autoCapitalize="sentences"
                        autoCorrect="on"
                        spellCheck
                        enterKeyHint="next"
                        autoComplete="off"
                        data-testid="input-compose-subject"
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
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={8}
                        inputMode="text"
                        autoCapitalize="sentences"
                        autoCorrect="on"
                        spellCheck
                        enterKeyHint="enter"
                        className="min-h-[200px] resize-y"
                        placeholder="Write your reply…"
                        data-testid="textarea-compose-body"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="sticky bottom-0 gap-2 border-t bg-background px-5 py-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={sendMutation.isPending}
                data-testid="button-compose-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sendMutation.isPending}
                data-testid="button-compose-send"
              >
                {sendMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send email"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
