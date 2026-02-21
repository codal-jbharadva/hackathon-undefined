import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Key, Mail, FolderKanban } from "lucide-react";

export default function Setup() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [testing, setTesting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTest = () => {
    setTesting(true);
    setSuccess(false);
    setTimeout(() => {
      setTesting(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Configuration
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your Jira instance to start bridging meetings to tickets.
          </p>
        </div>

        <div className="glass-card p-6 space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Jira Email
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm input-dark border outline-none"
            />
          </div>

          {/* Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Key className="h-3.5 w-3.5 text-muted-foreground" />
              API Token
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm input-dark border outline-none"
            />
          </div>

          {/* Project Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FolderKanban className="h-3.5 w-3.5 text-muted-foreground" />
              Project Key
            </label>
            <input
              type="text"
              placeholder="DEV"
              value={projectKey}
              onChange={(e) => setProjectKey(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm input-dark border outline-none"
            />
          </div>

          {/* Test Connection */}
          <div className="pt-2">
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testing…
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Connected
                </>
              ) : (
                "Test Connection"
              )}
            </button>
            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-success mt-2"
              >
                Successfully connected to Jira.
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
