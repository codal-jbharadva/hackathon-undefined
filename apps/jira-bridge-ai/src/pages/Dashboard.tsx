import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, MessageSquare, User, AlertCircle, Loader2 } from "lucide-react";
import { draftComments, type DraftComment } from "@/data/mockData";

export interface ApiComment {
  ticket_id: string;
  commenter: string;
  tag_person: string;
  comment: string;
  jira_url: string;
  created_at: string;
}

function CommentCard({
  item,
  index,
  onMarkDone,
}: {
  item: DraftComment;
  index: number;
  onMarkDone: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.commentDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="glass-card-hover p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <a
            href={item.jiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="badge-ticket hover:bg-primary/20 transition-colors"
          >
            {item.ticketId}
          </a>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{item.responsible}</span>
          </div>
        </div>
      </div>

      {/* Draft Comment */}
      <div className="flex-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <MessageSquare className="h-3 w-3" />
          <span>Draft Comment</span>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">
          {item.commentDraft}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
        <a
          href={item.jiraUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Open Ticket</span>
        </a>
        <button
          onClick={() => onMarkDone(item.id)}
          className="ml-auto flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Mark Done</span>
        </button>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [comments, setComments] = useState(
    draftComments.filter((c) => c.status === "pending")
  );
  const [apiComments, setApiComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApiComments();
  }, []);

  const fetchApiComments = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch from the comments endpoint with CORS mode
      const response = await fetch(
        "https://d73b-111-93-81-198.ngrok-free.app/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setApiComments(Array.isArray(data) ? data : []);
      setError(""); // Clear error if successful
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch comments from API";
      
      // Log the specific error for debugging
      console.error("Error fetching API comments:", err);
      
      // Check if it's a CORS error
      if (errorMessage.includes("CORS") || errorMessage.includes("network") || errorMessage.includes("Failed to fetch")) {
        setError("CORS Issue: Make sure your API server has CORS enabled. Contact your API administrator.");
      } else {
        setError(errorMessage);
      }
      
      // Use sample data on error for demonstration
      setApiComments([
        {
          ticket_id: "SCRUM-1",
          commenter: "Jayesh",
          tag_person: "Ben",
          comment: "Can you confirm the priority?",
          jira_url: "https://bshah2.atlassian.net/browse/SCRUM-1?focusedCommentId=10001",
          created_at: "2026-02-21T10:22:11",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Action Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and post AI-generated draft comments to Jira tickets.
        </p>
      </div>

      {/* API Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 glass-card p-4 flex items-start gap-3 border-l-2 border-yellow-500 bg-yellow-50"
        >
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Note:</p>
            <p className="text-sm text-yellow-800 mt-1">{error}. Showing sample data.</p>
          </div>
        </motion.div>
      )}

      {/* API Comments Section */}
      {loading ? (
        <div className="glass-card p-8 text-center mb-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-foreground font-medium">Loading comments...</p>
        </div>
      ) : apiComments.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Recent Comments from Summary
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {apiComments.map((apiComment, index) => (
              <motion.div
                key={`${apiComment.ticket_id}-${index}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="glass-card-hover p-5 flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <a
                      href={apiComment.jira_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge-ticket hover:bg-primary/20 transition-colors"
                    >
                      {apiComment.ticket_id}
                    </a>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>{apiComment.commenter}</span>
                    </div>
                  </div>
                </div>

                {/* Comment Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                    <MessageSquare className="h-3 w-3" />
                    <span>Comment for: {apiComment.tag_person}</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {apiComment.comment}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(apiComment.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <a
                    href={apiComment.jira_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open Ticket</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Stats bar */}
      {/* <div className="flex gap-4 mb-6">
        <div className="glass-card px-4 py-2.5 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{comments.length}</span>{" "}
            pending
          </span>
        </div>
      </div> */}

      {/* Draft Comments Section */}
      {/* <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        Draft Comments to Review
      </h2> */}

      {/* {comments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <Check className="h-10 w-10 text-success mx-auto mb-3" />
          <p className="text-foreground font-medium">All caught up!</p>
          <p className="text-sm text-muted-foreground mt-1">
            No pending draft comments to review.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {comments.map((item, i) => (
            <CommentCard
              key={item.id}
              item={item}
              index={i}
              onMarkDone={handleMarkDone}
            />
          ))}
        </div>
      )} */}
    </div>
  );
}
