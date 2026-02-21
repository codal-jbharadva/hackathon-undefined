import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, MessageSquare, User } from "lucide-react";
import { draftComments, type DraftComment } from "@/data/mockData";

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

      {/* Stats bar */}
      <div className="flex gap-4 mb-6">
        <div className="glass-card px-4 py-2.5 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{comments.length}</span>{" "}
            pending
          </span>
        </div>
      </div>

      {comments.length === 0 ? (
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
      )}
    </div>
  );
}
