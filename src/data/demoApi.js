const dayMs = 86400000;

const nowIso = () => new Date().toISOString();

const createInitialState = () => ({
  drafts: [
    {
      id: "demo-draft-1",
      title: "Product Intro",
      subject: "Quick intro from Mail Tracker demo",
      htmlBody:
        "<p>Hi {{firstName}},</p><p>I noticed your team is scaling outreach and thought this might help.</p><p>Would you be open to a quick 15-minute chat next week?</p><p>Best,<br/>Demo User</p>",
      bodyPreview:
        "Hi {{firstName}}, I noticed your team is scaling outreach and thought this might help.",
      attachments: [],
    },
  ],
  sentThreads: [
    {
      threadId: "demo-thread-1",
      lastActivityAt: new Date(Date.now() - 8 * dayMs).toISOString(),
      totalClicks: 3,
      replies: 0,
      messages: [
        {
          id: "demo-msg-1",
          type: "initial",
          direction: "outgoing",
          to: ["maya@zenli.io"],
          subject: "Partnership idea for Zenli",
          preview:
            "Hi Maya, sharing a partnership idea that can improve reply rates for your outbound team.",
          htmlBody:
            "<p>Hi Maya,</p><p>I wanted to share a quick partnership idea that can improve reply rates for your outbound team.</p><p>If useful, I can share a short walkthrough.</p>",
          sentAt: new Date(Date.now() - 8 * dayMs).toISOString(),
          opensCount: 4,
          clicksCount: 3,
          attachmentsMeta: [],
        },
      ],
    },
    {
      threadId: "demo-thread-2",
      lastActivityAt: new Date(Date.now() - 3 * dayMs).toISOString(),
      totalClicks: 1,
      replies: 1,
      messages: [
        {
          id: "demo-msg-2",
          type: "initial",
          direction: "outgoing",
          to: ["elena@vaulthr.io"],
          subject: "Intro + case study",
          preview:
            "Hi Elena, sharing a relevant case study from another HR team.",
          htmlBody:
            "<p>Hi Elena,</p><p>Sharing a relevant HR case study and would love your thoughts.</p>",
          sentAt: new Date(Date.now() - 6 * dayMs).toISOString(),
          opensCount: 2,
          clicksCount: 1,
          attachmentsMeta: [],
        },
        {
          id: "demo-msg-2-reply",
          type: "reply",
          direction: "incoming",
          from: "Elena Rossi",
          subject: "Re: Intro + case study",
          message: "Thanks! This is helpful. Can we talk next week?",
          htmlBody:
            "<p>Thanks! This is helpful. Can we talk next week?</p>",
          sentAt: new Date(Date.now() - 3 * dayMs).toISOString(),
        },
      ],
    },
  ],
  followups: [
    {
      followUpId: "demo-followup-1",
      threadId: "demo-thread-1",
      messageId: "demo-msg-1",
      to: ["maya@zenli.io"],
      email: "maya@zenli.io",
      name: "Maya",
      subject: "Partnership idea for Zenli",
      htmlBody:
        "<p>Hi Maya,</p><p>I wanted to share a quick partnership idea that can improve reply rates for your outbound team.</p>",
      sentAt: new Date(Date.now() - 8 * dayMs).toISOString(),
      daysSince: 8,
      opens: 4,
      status: "Pending",
      stoppedReason: null,
      isReplied: false,
    },
  ],
});

let state = createInitialState();

const clone = (value) => JSON.parse(JSON.stringify(value));

const findThreadForFollowup = (messageId, toEmail) =>
  state.sentThreads.find(
    (thread) =>
      thread.messages.some((message) => message.id === messageId) ||
      thread.messages.some((message) => (message.to || []).includes(toEmail)),
  );

const buildKpi = () => {
  const totalSent = state.sentThreads.length;
  const totalReplied = state.sentThreads.filter((thread) =>
    thread.messages.some((message) => message.type === "reply"),
  ).length;
  const totalClicked = state.sentThreads.filter(
    (thread) => (thread.totalClicks || 0) > 0,
  ).length;

  return {
    totalSent,
    totalReplied,
    replyRate: totalSent ? Math.round((totalReplied / totalSent) * 100) : 0,
    totalClicked,
    clickRate: totalSent ? Math.round((totalClicked / totalSent) * 100) : 0,
    interestedLeads: totalClicked,
    noResponse: Math.max(totalSent - totalReplied, 0),
    uniqueFollowedUp: state.sentThreads.filter((thread) =>
      thread.messages.some((message) => message.type === "followup"),
    ).length,
    followupNeeded: state.followups.filter((x) => x.status === "Pending").length,
    totalDrafts: state.drafts.length,
  };
};

export const demoApi = {
  getGmailAccounts() {
    return {
      data: [
        {
          _id: "demo-gmail-account",
          userId: "demo-user-id",
          email: "demo.user@mailtracker.dev",
          createdAt: nowIso(),
          isPrimary: true,
          user: { name: "Demo User" },
        },
      ],
    };
  },

  deleteGmailAccount() {
    return { success: true, message: "Demo account cannot be disconnected." };
  },

  sendEmail() {
    throw "Demo mode: real email sending is disabled. Sign in with Gmail to send real emails.";
  },

  getSentEmails() {
    return { data: clone(state.sentThreads) };
  },

  createDraft(formData) {
    const subject = formData.get("subject") || "";
    const body = formData.get("body") || "";
    const title = formData.get("title") || "General";
    state.drafts.unshift({
      id: `demo-draft-${Date.now()}`,
      title,
      subject,
      htmlBody: body,
      bodyPreview: subject || "Demo draft message",
      attachments: [],
    });
    return { success: true };
  },

  getDrafts() {
    return { data: clone(state.drafts) };
  },

  updateDraft(draftId, formData) {
    state.drafts = state.drafts.map((draft) =>
      draft.id === draftId
        ? {
            ...draft,
            title: formData.get("title") || draft.title,
            subject: formData.get("subject") || draft.subject,
            htmlBody: formData.get("body") || draft.htmlBody,
            bodyPreview: formData.get("subject") || draft.subject,
          }
        : draft,
    );
    return { success: true };
  },

  deleteDraft(draftId) {
    state.drafts = state.drafts.filter((draft) => draft.id !== draftId);
    return { success: true };
  },

  getDashboardKpi() {
    return { data: { data: buildKpi() } };
  },

  getFollowups() {
    state.followups = state.followups.map((item) => ({
      ...item,
      daysSince: Math.max(
        1,
        Math.floor((Date.now() - new Date(item.sentAt).getTime()) / dayMs),
      ),
    }));
    return { data: { data: clone(state.followups) } };
  },

  checkReplies() {
    return { success: true };
  },

  updateFollowupStatus(followUpId, action) {
    const statusMap = {
      snooze: "Stopped",
      dismiss: "Stopped",
      complete: "Completed",
      resume: "Pending",
    };

    if (action === "dismiss") {
      state.followups = state.followups.filter((item) => item.followUpId !== followUpId);
      return { success: true };
    }

    state.followups = state.followups.map((item) =>
      item.followUpId === followUpId
        ? {
            ...item,
            status: statusMap[action] || item.status,
            stoppedReason: action === "snooze" ? "MANUAL" : item.stoppedReason,
          }
        : item,
    );

    return { success: true };
  },

  sendFollowup(formData) {
    const messageId = formData.get("messageId");
    const subject = formData.get("subject") || "Follow-up";
    const body = formData.get("body") || "";
    const to = JSON.parse(formData.get("to") || "[]");
    const toEmail = to[0] || "";

    const thread = findThreadForFollowup(messageId, toEmail);
    if (thread) {
      thread.messages.push({
        id: `demo-followup-msg-${Date.now()}`,
        type: "followup",
        direction: "outgoing",
        to: [toEmail],
        subject,
        preview: subject,
        htmlBody: body,
        sentAt: nowIso(),
        opensCount: 0,
        clicksCount: 0,
      });
      thread.lastActivityAt = nowIso();
    }

    const existing = state.followups.find(
      (item) => item.messageId === messageId || item.threadId === thread?.threadId,
    );

    if (existing) {
      existing.status = "Completed";
    } else if (thread) {
      state.followups.unshift({
        followUpId: `demo-followup-${Date.now()}`,
        threadId: thread.threadId,
        messageId: thread.messages[0]?.id,
        to: [toEmail],
        email: toEmail,
        name: toEmail.split("@")[0],
        subject,
        htmlBody: body,
        sentAt: nowIso(),
        daysSince: 0,
        opens: 0,
        status: "Completed",
        stoppedReason: null,
        isReplied: false,
      });
    }

    return { success: true };
  },

  generateAiReply(payload) {
    const subject = payload?.type === "reply" ? "Thanks for your response" : "Quick follow-up";
    return {
      data: {
        success: true,
        data: {
          subject,
          reply:
            "<p>Hi there,</p><p>Just following up on my previous email. Happy to share more details if useful.</p><p>Best,<br/>Demo User</p>",
        },
      },
    };
  },

  reset() {
    state = createInitialState();
  },
};
