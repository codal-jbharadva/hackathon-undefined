import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Key, Mail, FolderKanban, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Summary() {
  const [summary, setSummary] = useState("");
  const [testing, setTesting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSendSummary = async () => {
    if (!summary.trim()) {
      setError("Please enter a summary");
      return;
    }

    setTesting(true);
    setSuccess(false);
    setError("");

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      
      if (!apiBaseUrl) {
        throw new Error("API base URL not configured in environment variables");
      }

      const response = await fetch(
        `${apiBaseUrl}/process-summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: summary,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setTesting(false);
      setSuccess(true);
      setSummary(""); // Clear the input after successful submission
      console.log("API Response:", data);
    } catch (err) {
      setTesting(false);
      setError(
        err instanceof Error ? err.message : "Failed to send summary. Please try again."
      );
      console.error("Error:", err);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Meeting Summary
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add your meeting summary and send it for processing.
          </p>
        </div>

        <div className="glass-card p-6 space-y-5">
          {/* Summary Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Summary
            </label>
            <textarea
              placeholder="Enter your meeting summary here... (e.g., SCRUM-1 – Draft Comment Request. Kristen Colaco will add a draft comment and tag Ben Shah to confirm priority.)"
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                if (error) setError(""); // Clear error when user starts typing
              }}
              rows={6}
              className="w-full rounded-md px-3 py-2 text-sm input-dark border outline-none resize-none"
            />
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Send Summary Button */}
          <div className="pt-2">
            <button
              onClick={handleSendSummary}
              disabled={testing || !summary.trim()}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Sent Successfully
                </>
              ) : (
                "Send Summary"
              )}
            </button>
            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-600 mt-2"
              >
                Summary sent successfully to the API.
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
