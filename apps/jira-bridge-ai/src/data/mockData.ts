export interface DraftComment {
  id: string;
  ticketId: string;
  jiraUrl: string;
  responsible: string;
  commentDraft: string;
  status: "pending" | "done";
}

export interface UserMapping {
  id: string;
  meetingName: string;
  jiraEmail: string;
}

export const draftComments: DraftComment[] = [
  {
    id: "1",
    ticketId: "DEV-402",
    jiraUrl: "https://your-domain.atlassian.net/browse/DEV-402",
    responsible: "Sarah Miller",
    commentDraft:
      "Based on today's sync, I'm taking ownership of the API refactor. Expecting a PR by Friday.",
    status: "pending",
  },
  {
    id: "2",
    ticketId: "DEV-109",
    jiraUrl: "https://your-domain.atlassian.net/browse/DEV-109",
    responsible: "Jason Statham",
    commentDraft:
      "Deployment is blocked until the DB migration script is approved by the DevOps team.",
    status: "pending",
  },
  {
    id: "3",
    ticketId: "DEV-217",
    jiraUrl: "https://your-domain.atlassian.net/browse/DEV-217",
    responsible: "Priya Sharma",
    commentDraft:
      "Will pair with Alex on the auth flow tomorrow morning. Spike complete — ready for implementation.",
    status: "pending",
  },
  {
    id: "4",
    ticketId: "DEV-330",
    jiraUrl: "https://your-domain.atlassian.net/browse/DEV-330",
    responsible: "Marcus Chen",
    commentDraft:
      "Performance benchmarks look good after the caching layer was added. Closing the investigation.",
    status: "pending",
  },
  {
    id: "5",
    ticketId: "DEV-518",
    jiraUrl: "https://your-domain.atlassian.net/browse/DEV-518",
    responsible: "Emily Rodriguez",
    commentDraft:
      "Design review feedback incorporated. Updated Figma link attached. Moving to QA.",
    status: "pending",
  },
  {
    id: "6",
    ticketId: "DEV-044",
    jiraUrl: "https://your-domain.atlassian.net/browse/DEV-044",
    responsible: "Alex Thompson",
    commentDraft:
      "Hotfix deployed to staging. Monitoring error rates — will promote to prod after 24h window.",
    status: "pending",
  },
];

export const userMappings: UserMapping[] = [
  { id: "1", meetingName: "Sarah", jiraEmail: "sarah.miller@dev.com" },
  { id: "2", meetingName: "Jason", jiraEmail: "jason.statham@dev.com" },
  { id: "3", meetingName: "Priya", jiraEmail: "priya.sharma@dev.com" },
  { id: "4", meetingName: "Marcus", jiraEmail: "marcus.chen@dev.com" },
  { id: "5", meetingName: "Emily", jiraEmail: "emily.rodriguez@dev.com" },
];
