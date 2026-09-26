export const DROPDOWN_DEMO_DRAFTS = [
  {
    id: "demo-draft-1",
    title: "Full Stack Developer",
    subject: "Full Stack Developer | React + Node.js | 3 Years Experience",

    body: `Hi,

I’m writing to express my interest in the Full Stack Developer position. I have several years of experience building production-ready applications using React.js, Node.js, Express.js, SQL and cloud technologies.

I would be happy to discuss how my experience could contribute to your team.

Regards,
Alex Morgan`,

    attachments: [
      {
        filename: "alex_morgan_resume.pdf",
        mimeType: "application/pdf",
        size: 140212,
        url: "#",
        _id: "demo-attachment-1",
      },
    ],

    htmlBody: `<p>Hi,</p>
<p>
I’m writing to express my interest in the
<strong>Full Stack Developer</strong> position. I have several years
of experience building production-ready applications using React.js,
Node.js, Express.js, SQL and cloud technologies.
</p>
<p>
I would be happy to discuss how my experience could contribute to your team.
</p>
<p>Regards,<br />Alex Morgan</p>`,
  },

  {
    id: "demo-draft-2",
    title: "Software Engineer",
    subject: "Application for Software Engineer | Full Stack Developer",

    body: `Hi,

I came across the Software Engineer opportunity and wanted to reach out regarding the position.

I have several years of professional experience developing full-stack applications using React.js, Node.js, Express.js and SQL. My experience includes REST APIs, authentication systems, analytics dashboards and cloud integrations.

I have attached my resume and would be happy to discuss the opportunity further.

Best regards,
Alex Morgan`,

    attachments: [
      {
        filename: "alex_morgan_resume.pdf",
        mimeType: "application/pdf",
        size: 140212,
        url: "#",
        _id: "demo-attachment-2",
      },
    ],

    htmlBody: `<p>Hi,</p>
<p>
I came across the <strong>Software Engineer</strong> opportunity and
wanted to reach out regarding the position.
</p>
<p>
I have several years of professional experience developing full-stack
applications using React.js, Node.js, Express.js and SQL.
</p>
<p>
My experience includes REST APIs, authentication systems,
analytics dashboards and cloud integrations.
</p>
<p>
I have attached my resume and would be happy to discuss the
opportunity further.
</p>
<p>Best regards,<br />Alex Morgan</p>`,
  },

  {
    id: "demo-draft-3",
    title: "Frontend Developer",
    subject: "Frontend Developer Application | React.js",

    body: `Hi,

I’m reaching out regarding the Frontend Developer position.

I have experience building responsive and data-driven interfaces using React.js, Redux, Tailwind CSS and Material UI. I have also worked with D3.js and Plotly.js to build interactive dashboards.

I would appreciate the opportunity to discuss the role.

Regards,
Alex Morgan`,

    attachments: [],

    htmlBody: `<p>Hi,</p>
<p>
I’m reaching out regarding the
<strong>Frontend Developer</strong> position.
</p>
<p>
I have experience building responsive and data-driven interfaces
using React.js, Redux, Tailwind CSS and Material UI.
</p>
<p>
I have also worked with D3.js and Plotly.js to build
interactive dashboards.
</p>
<p>
I would appreciate the opportunity to discuss the role.
</p>
<p>Regards,<br />Alex Morgan</p>`,
  },

  {
    id: "demo-draft-4",
    title: "Backend Developer",
    subject: "Backend Developer | Node.js | Express.js",

    body: `Hi,

I’m interested in the Backend Developer opportunity at your organization.

I have several years of experience developing backend systems and RESTful APIs using Node.js, Express.js, SQL and cloud services.

My experience includes authentication, API development, database optimization, WebSocket integrations and cloud services.

Please find my resume attached for your consideration.

Regards,
Alex Morgan`,

    attachments: [
      {
        filename: "alex_morgan_resume.pdf",
        mimeType: "application/pdf",
        size: 140212,
        url: "#",
        _id: "demo-attachment-4",
      },
    ],

    htmlBody: `<p>Hi,</p>
<p>
I’m interested in the <strong>Backend Developer</strong> opportunity
at your organization.
</p>
<p>
I have several years of experience developing backend systems and
RESTful APIs using Node.js, Express.js, SQL and cloud services.
</p>
<p>
My experience includes authentication, API development,
database optimization, WebSocket integrations and cloud services.
</p>
<p>
Please find my resume attached for your consideration.
</p>
<p>Regards,<br />Alex Morgan</p>`,
  },
];

export const DEMO_EMAILS = [
  {
    threadId: "demo-thread-1",
    subject: "Full Stack Developer | React + Node.js",

    participants: ["recruiter@techcompany.com", "alex@demo.mailtracker.app"],

    lastActivityAt: "2026-09-22T10:22:24.723Z",

    totalClicks: 3,
    isReplied: true,
    repliesCount: 1,

    messages: [
      {
        id: "demo-message-1",
        type: "initial",

        from: "alex@demo.mailtracker.app",
        to: ["recruiter@techcompany.com"],
        cc: [],
        bcc: [],

        subject: "Full Stack Developer | React + Node.js",

        preview:
          "Hi, I'm writing to express my interest in the Full Stack Developer position. I have several years of experience building production-ready applications...",

        htmlBody: `
          <p>Hi,</p>

          <p>
            I'm writing to express my interest in the
            <strong>Full Stack Developer</strong> position. I have several
            years of experience building production-ready applications
            using <strong>Node.js, React.js and SQL</strong>.
          </p>

          <p>
            I would be happy to discuss how my experience could contribute
            to your team.
          </p>

          <p>
            Regards,<br />
            Alex Morgan
          </p>
        `,

        trackingId: "demo-tracking-1",

        sentAt: "2026-09-22T10:22:24.723Z",

        direction: "outgoing",
        status: "sent",

        attachmentsMeta: [
          {
            filename: "alex_morgan_resume.pdf",
            mimeType: "application/pdf",
            size: 140212,
            url: "#",
            _id: "demo-attachment-1",
          },
        ],

        messageId: "demo-message-1",

        clicksCount: 3,
        opensCount: 5,

        isReplied: false,
      },

      {
        id: "demo-reply-1",
        type: "reply",

        from: "recruiter@techcompany.com",
        to: ["alex@demo.mailtracker.app"],
        cc: [],
        bcc: [],

        subject: "Re: Full Stack Developer | React + Node.js",

        preview:
          "Thanks for reaching out. Your profile looks interesting. Could we schedule a quick discussion regarding the opportunity?",

        htmlBody: `
          <p>Hi Alex,</p>

          <p>
            Thanks for reaching out. Your profile looks interesting.
          </p>

          <p>
            Could we schedule a quick discussion regarding the
            opportunity?
          </p>

          <p>
            Regards,<br />
            Hiring Team
          </p>
        `,

        sentAt: "2026-09-23T08:15:00.000Z",

        direction: "incoming",
        status: "received",

        attachmentsMeta: [],

        messageId: "demo-reply-1",

        clicksCount: 0,
        opensCount: 0,

        isReplied: true,
      },
    ],
  },

  {
    threadId: "demo-thread-2",
    subject: "Software Engineer Application",

    participants: ["careers@startup.com", "alex@demo.mailtracker.app"],

    lastActivityAt: "2026-09-21T08:30:00.000Z",

    totalClicks: 2,
    isReplied: false,
    repliesCount: 0,

    messages: [
      {
        id: "demo-message-2",
        type: "initial",

        from: "alex@demo.mailtracker.app",
        to: ["careers@startup.com"],
        cc: [],
        bcc: [],

        subject: "Software Engineer Application",

        preview:
          "Hi, I came across the Software Engineer opportunity and wanted to reach out regarding the position. I have several years of experience working on full-stack applications...",

        htmlBody: `
          <p>Hi,</p>

          <p>
            I came across the
            <strong>Software Engineer</strong> opportunity and
            wanted to reach out regarding the position.
          </p>

          <p>
            I have several years of experience working on full-stack
            applications using
            <strong>React.js, Node.js, Express.js and SQL</strong>.
          </p>

          <p>
            I've worked on scalable REST APIs, authentication systems,
            analytics dashboards and cloud integrations.
          </p>

          <p>
            I've attached my resume for your consideration.
          </p>

          <p>
            Best regards,<br />
            Alex Morgan
          </p>
        `,

        trackingId: "demo-tracking-2",

        sentAt: "2026-09-21T08:30:00.000Z",

        direction: "outgoing",
        status: "sent",

        attachmentsMeta: [
          {
            filename: "alex_morgan_resume.pdf",
            mimeType: "application/pdf",
            size: 140212,
            url: "#",
            _id: "demo-attachment-2",
          },
        ],

        messageId: "demo-message-2",

        clicksCount: 2,
        opensCount: 4,

        isReplied: false,
      },
    ],
  },

  {
    threadId: "demo-thread-3",
    subject: "Frontend Developer Application",

    participants: ["hr@productcompany.com", "alex@demo.mailtracker.app"],

    lastActivityAt: "2026-09-20T14:15:00.000Z",

    totalClicks: 0,
    isReplied: false,
    repliesCount: 0,

    messages: [
      {
        id: "demo-message-3",
        type: "initial",

        from: "alex@demo.mailtracker.app",
        to: ["hr@productcompany.com"],
        cc: [],
        bcc: [],

        subject: "Frontend Developer Application",

        preview:
          "Hi, I'm reaching out regarding the Frontend Developer position. My experience includes building responsive and data-driven interfaces using React.js and Tailwind CSS...",

        htmlBody: `
          <p>Hi,</p>

          <p>
            I'm reaching out regarding the
            <strong>Frontend Developer</strong> position.
          </p>

          <p>
            My experience includes building responsive and
            data-driven interfaces using
            <strong>React.js, Redux, Tailwind CSS and Material UI</strong>.
          </p>

          <p>
            I would appreciate the opportunity to discuss the role
            and understand how I could contribute to your team.
          </p>

          <p>
            Regards,<br />
            Alex Morgan
          </p>
        `,

        trackingId: "demo-tracking-3",

        sentAt: "2026-09-20T14:15:00.000Z",

        direction: "outgoing",
        status: "sent",

        attachmentsMeta: [],

        messageId: "demo-message-3",

        clicksCount: 0,
        opensCount: 2,

        isReplied: false,
      },
    ],
  },

  {
    threadId: "demo-thread-4",
    subject: "Backend Developer | Node.js",

    participants: ["recruitment@techcompany.com", "alex@demo.mailtracker.app"],

    lastActivityAt: "2026-09-19T11:45:00.000Z",

    totalClicks: 1,
    isReplied: false,
    repliesCount: 0,

    messages: [
      {
        id: "demo-message-4",
        type: "initial",

        from: "alex@demo.mailtracker.app",
        to: ["recruitment@techcompany.com"],
        cc: [],
        bcc: [],

        subject: "Backend Developer | Node.js",

        preview:
          "Hi, I'm interested in the Backend Developer opportunity. I have experience building REST APIs and scalable backend systems using Node.js and Express.js...",

        htmlBody: `
          <p>Hi,</p>

          <p>
            I'm interested in the
            <strong>Backend Developer</strong> opportunity.
          </p>

          <p>
            I have experience building REST APIs and scalable backend
            systems using <strong>Node.js, Express.js and SQL</strong>.
          </p>

          <p>
            Please find my resume attached for your consideration.
          </p>

          <p>
            Regards,<br />
            Alex Morgan
          </p>
        `,

        trackingId: "demo-tracking-4",

        sentAt: "2026-09-19T11:45:00.000Z",

        direction: "outgoing",
        status: "sent",

        attachmentsMeta: [
          {
            filename: "alex_morgan_resume.pdf",
            mimeType: "application/pdf",
            size: 140212,
            url: "#",
            _id: "demo-attachment-4",
          },
        ],

        messageId: "demo-message-4",

        clicksCount: 1,
        opensCount: 3,

        isReplied: false,
      },
    ],
  },

  {
    threadId: "demo-thread-5",
    subject: "Full Stack Developer | React + Node.js",

    participants: ["jobs@softwarecompany.com", "alex@demo.mailtracker.app"],

    lastActivityAt: "2026-09-18T09:20:00.000Z",

    totalClicks: 0,
    isReplied: false,
    repliesCount: 0,

    messages: [
      {
        id: "demo-message-5",
        type: "initial",

        from: "alex@demo.mailtracker.app",
        to: ["jobs@softwarecompany.com"],
        cc: [],
        bcc: [],

        subject: "Full Stack Developer | React + Node.js",

        preview:
          "Hi, I would like to apply for the Full Stack Developer opportunity. I have several years of experience working with React, Node.js and SQL...",

        htmlBody: `
          <p>Hi,</p>

          <p>
            I would like to apply for the
            <strong>Full Stack Developer</strong> opportunity.
          </p>

          <p>
            I have several years of experience working with
            <strong>React, Node.js and SQL</strong>.
          </p>

          <p>
            I would be happy to discuss the opportunity further.
          </p>

          <p>
            Regards,<br />
            Alex Morgan
          </p>
        `,

        trackingId: "demo-tracking-5",

        sentAt: "2026-09-18T09:20:00.000Z",

        direction: "outgoing",
        status: "sent",

        attachmentsMeta: [],

        messageId: "demo-message-5",

        clicksCount: 0,
        opensCount: 1,

        isReplied: false,
      },
    ],
  },
];

export const DEMO_KPI = {
  totalSent: 28,

  totalReplied: 1,

  replyRate: 4,

  totalClicked: 6,

  clickRate: 21,

  interestedLeads: 1,

  noResponse: 27,

  uniqueFollowedUp: 0,

  followupNeeded: 0,

  totalDrafts: 1,
};

export const DASHBOARD_DEMO_EMAILS = [
  {
    threadId: "demo-thread-1",
    subject: "Full Stack Developer | React + Node.js",

    participants: ["recruiter@techcompany.com", "alex@demo.mailtracker.app"],

    lastActivityAt: "2026-09-22T10:22:24.723Z",

    totalClicks: 3,
    isReplied: true,
    repliesCount: 1,

    messages: [
      {
        id: "demo-message-1",
        type: "initial",

        from: "alex@demo.mailtracker.app",

        to: ["recruiter@techcompany.com"],
        cc: [],
        bcc: [],

        subject: "Full Stack Developer | React + Node.js",

        preview:
          "Hi, I'm writing to express my interest in the Full Stack Developer position. I have several years of experience building production-ready applications...",

        htmlBody: `
          <p>Hi,</p>

          <p>
            I'm writing to express my interest in the
            <strong>Full Stack Developer</strong> position. I have several
            years of experience building production-ready applications
            using <strong>Node.js, React.js and SQL</strong>.
          </p>

          <p>
            <strong>Technical Highlights:</strong>
          </p>

          <p>
            <strong>Frontend:</strong> React.js, Redux, Tailwind CSS,
            Material UI, D3.js and Plotly.js.
          </p>

          <p>
            <strong>Backend:</strong> Node.js, Express.js, RESTful APIs
            and WebSocket integration.
          </p>

          <p>
            <strong>Cloud:</strong> Cloud storage, data pipelines and
            scalable application infrastructure.
          </p>

          <p>
            I would be happy to discuss how my experience could contribute
            to your team.
          </p>

          <p>
            Regards,<br />
            Alex Morgan
          </p>
        `,

        trackingId: "demo-tracking-1",

        sentAt: "2026-09-22T10:22:24.723Z",

        direction: "outgoing",
        status: "sent",

        attachmentsMeta: [
          {
            filename: "alex_morgan_resume.pdf",
            mimeType: "application/pdf",
            size: 140212,
            url: "#",
            _id: "demo-attachment-1",
          },
        ],

        messageId: "demo-message-1",

        clicksCount: 3,
        opensCount: 5,

        isReplied: false,
      },

      {
        id: "demo-reply-1",
        type: "reply",

        from: "recruiter@techcompany.com",

        to: ["alex@demo.mailtracker.app"],
        cc: [],
        bcc: [],

        subject: "Re: Full Stack Developer | React + Node.js",

        preview:
          "Hi Alex, thanks for reaching out. Your profile looks interesting. Could we schedule a quick discussion regarding the opportunity?",

        htmlBody: `
          <p>Hi Alex,</p>

          <p>
            Thanks for reaching out. Your profile looks interesting.
          </p>

          <p>
            Could we schedule a quick discussion regarding the
            opportunity?
          </p>

          <p>
            Regards,<br />
            Hiring Team
          </p>
        `,

        sentAt: "2026-09-23T08:15:00.000Z",

        direction: "incoming",
        status: "received",

        attachmentsMeta: [],

        messageId: "demo-reply-1",

        clicksCount: 0,
        opensCount: 0,

        isReplied: true,
      },
    ],
  },

  {
    threadId: "demo-thread-2",
    subject: "Software Engineer Application",

    participants: ["careers@startup.com", "alex@demo.mailtracker.app"],

    lastActivityAt: "2026-09-21T08:30:00.000Z",

    totalClicks: 2,
    isReplied: false,
    repliesCount: 0,

    messages: [
      {
        id: "demo-message-2",
        type: "initial",

        from: "alex@demo.mailtracker.app",

        to: ["careers@startup.com"],
        cc: [],
        bcc: [],

        subject: "Software Engineer Application",

        preview:
          "Hi, I came across the Software Engineer opportunity and wanted to reach out regarding the position. I have several years of experience working on full-stack applications...",

        htmlBody: `
          <p>Hi,</p>

          <p>
            I came across the
            <strong>Software Engineer</strong> opportunity and
            wanted to reach out regarding the position.
          </p>

          <p>
            I have several years of experience working on full-stack
            applications using
            <strong>React.js, Node.js, Express.js and SQL</strong>.
          </p>

          <p>
            I've worked on scalable REST APIs, authentication systems,
            analytics dashboards and cloud integrations.
          </p>

          <p>
            I've attached my resume for your consideration.
          </p>

          <p>
            Best regards,<br />
            Alex Morgan
          </p>
        `,

        trackingId: "demo-tracking-2",

        sentAt: "2026-09-21T08:30:00.000Z",

        direction: "outgoing",
        status: "sent",

        attachmentsMeta: [
          {
            filename: "alex_morgan_resume.pdf",
            mimeType: "application/pdf",
            size: 140212,
            url: "#",
            _id: "demo-attachment-2",
          },
        ],

        messageId: "demo-message-2",

        clicksCount: 2,
        opensCount: 4,

        isReplied: false,
      },
    ],
  },

  {
    threadId: "demo-thread-3",
    subject: "Frontend Developer Application",

    participants: ["hr@productcompany.com", "alex@demo.mailtracker.app"],

    lastActivityAt: "2026-09-20T14:15:00.000Z",

    totalClicks: 0,
    isReplied: false,
    repliesCount: 0,

    messages: [
      {
        id: "demo-message-3",
        type: "initial",

        from: "alex@demo.mailtracker.app",

        to: ["hr@productcompany.com"],
        cc: [],
        bcc: [],

        subject: "Frontend Developer Application",

        preview:
          "Hi, I'm reaching out regarding the Frontend Developer position. My experience includes building responsive and data-driven interfaces using React.js, Redux and Tailwind CSS...",

        htmlBody: `
          <p>Hi,</p>

          <p>
            I'm reaching out regarding the
            <strong>Frontend Developer</strong> position.
          </p>

          <p>
            My experience includes building responsive and
            data-driven interfaces using
            <strong>React.js, Redux, Tailwind CSS and Material UI</strong>.
          </p>

          <p>
            I would appreciate the opportunity to discuss the role
            and understand how I could contribute to your team.
          </p>

          <p>
            Regards,<br />
            Alex Morgan
          </p>
        `,

        trackingId: "demo-tracking-3",

        sentAt: "2026-09-20T14:15:00.000Z",

        direction: "outgoing",
        status: "sent",

        attachmentsMeta: [],

        messageId: "demo-message-3",

        clicksCount: 0,
        opensCount: 2,

        isReplied: false,
      },
    ],
  },

  {
    threadId: "demo-thread-4",
    subject: "Backend Developer | Node.js",

    participants: ["recruitment@techcompany.com", "alex@demo.mailtracker.app"],

    lastActivityAt: "2026-09-19T11:45:00.000Z",

    totalClicks: 1,
    isReplied: false,
    repliesCount: 0,

    messages: [
      {
        id: "demo-message-4",
        type: "initial",

        from: "alex@demo.mailtracker.app",

        to: ["recruitment@techcompany.com"],
        cc: [],
        bcc: [],

        subject: "Backend Developer | Node.js",

        preview:
          "Hi, I'm interested in the Backend Developer opportunity. I have experience building REST APIs and scalable backend systems using Node.js and Express.js...",

        htmlBody: `
          <p>Hi,</p>

          <p>
            I'm interested in the
            <strong>Backend Developer</strong> opportunity.
          </p>

          <p>
            I have experience building REST APIs and scalable backend
            systems using <strong>Node.js, Express.js and SQL</strong>.
          </p>

          <p>
            Please find my resume attached for your consideration.
          </p>

          <p>
            Regards,<br />
            Alex Morgan
          </p>
        `,

        trackingId: "demo-tracking-4",

        sentAt: "2026-09-19T11:45:00.000Z",

        direction: "outgoing",
        status: "sent",

        attachmentsMeta: [
          {
            filename: "alex_morgan_resume.pdf",
            mimeType: "application/pdf",
            size: 140212,
            url: "#",
            _id: "demo-attachment-4",
          },
        ],

        messageId: "demo-message-4",

        clicksCount: 1,
        opensCount: 3,

        isReplied: false,
      },
    ],
  },

  {
    threadId: "demo-thread-5",
    subject: "Full Stack Developer | React + Node.js",

    participants: ["jobs@softwarecompany.com", "alex@demo.mailtracker.app"],

    lastActivityAt: "2026-09-18T09:20:00.000Z",

    totalClicks: 0,
    isReplied: false,
    repliesCount: 0,

    messages: [
      {
        id: "demo-message-5",
        type: "initial",

        from: "alex@demo.mailtracker.app",

        to: ["jobs@softwarecompany.com"],
        cc: [],
        bcc: [],

        subject: "Full Stack Developer | React + Node.js",

        preview:
          "Hi, I would like to apply for the Full Stack Developer opportunity. I have several years of experience working with React, Node.js and SQL...",

        htmlBody: `
          <p>Hi,</p>

          <p>
            I would like to apply for the
            <strong>Full Stack Developer</strong> opportunity.
          </p>

          <p>
            I have several years of experience working with
            <strong>React, Node.js and SQL</strong>.
          </p>

          <p>
            I would be happy to discuss the opportunity further.
          </p>

          <p>
            Regards,<br />
            Alex Morgan
          </p>
        `,

        trackingId: "demo-tracking-5",

        sentAt: "2026-09-18T09:20:00.000Z",

        direction: "outgoing",
        status: "sent",

        attachmentsMeta: [],

        messageId: "demo-message-5",

        clicksCount: 0,
        opensCount: 1,

        isReplied: false,
      },
    ],
  },
];

export const DEMO_DRAFTS = [
  {
    id: "demo-draft-1",
    title: "Full Stack Developer",
    subject: "Full Stack Developer | React + Node.js | 3 Years Experience",

    body: `<p>Hi,</p>
<p>
I'm writing to express my interest in the
<strong>Full Stack Developer</strong> position. I have several years
of experience building production-ready applications using React.js,
Node.js, Express.js, SQL and cloud technologies.
</p>
<p>
I would be happy to discuss how my experience could contribute to your team.
</p>
<p>Regards,<br />Alex Morgan</p>`,

    body_preview:
      "Hi, I'm writing to express my interest in the Full Stack Developer position. I have several years of experience building production-ready applications...",

    attachments: [
      {
        filename: "alex_morgan_resume.pdf",
        mimeType: "application/pdf",
        size: 140212,
        url: "#",
        _id: "demo-attachment-1",
      },
    ],
  },

  {
    id: "demo-draft-2",
    title: "Software Engineer",
    subject: "Application for Software Engineer | Full Stack Developer",

    body: `<p>Hi,</p>
<p>
I came across the <strong>Software Engineer</strong> opportunity and
wanted to reach out regarding the position.
</p>
<p>
I have several years of professional experience developing full-stack
applications using React.js, Node.js, Express.js and SQL.
</p>
<p>
My experience includes REST APIs, authentication systems,
analytics dashboards and cloud integrations.
</p>
<p>
I have attached my resume and would be happy to discuss the
opportunity further.
</p>
<p>Best regards,<br />Alex Morgan</p>`,

    body_preview:
      "Hi, I came across the Software Engineer opportunity and wanted to reach out regarding the position. I have several years of professional experience...",

    attachments: [
      {
        filename: "alex_morgan_resume.pdf",
        mimeType: "application/pdf",
        size: 140212,
        url: "#",
        _id: "demo-attachment-2",
      },
    ],
  },

  {
    id: "demo-draft-3",
    title: "Frontend Developer",
    subject: "Frontend Developer Application | React.js",

    body: `<p>Hi,</p>
<p>
I'm reaching out regarding the
<strong>Frontend Developer</strong> position.
</p>
<p>
I have experience building responsive and data-driven interfaces
using React.js, Redux, Tailwind CSS and Material UI.
</p>
<p>
I've also worked with D3.js and Plotly.js to build
interactive dashboards.
</p>
<p>
I would appreciate the opportunity to discuss the role.
</p>
<p>Regards,<br />Alex Morgan</p>`,

    body_preview:
      "Hi, I'm reaching out regarding the Frontend Developer position. I have experience building responsive and data-driven interfaces using React.js, Redux, Tailwind CSS...",

    attachments: [],
  },

  {
    id: "demo-draft-4",
    title: "Backend Developer",
    subject: "Backend Developer | Node.js | Express.js",

    body: `<p>Hi,</p>
<p>
I'm interested in the <strong>Backend Developer</strong> opportunity
at your organization.
</p>
<p>
I have several years of experience developing backend systems and
RESTful APIs using Node.js, Express.js, SQL and cloud services.
</p>
<p>
My experience includes authentication, API development,
database optimization, WebSocket integrations and cloud services.
</p>
<p>
Please find my resume attached for your consideration.
</p>
<p>Regards,<br />Alex Morgan</p>`,

    body_preview:
      "Hi, I'm interested in the Backend Developer opportunity at your organization. I have several years of experience developing backend systems and RESTful APIs...",

    attachments: [
      {
        filename: "alex_morgan_resume.pdf",
        mimeType: "application/pdf",
        size: 140212,
        url: "#",
        _id: "demo-attachment-4",
      },
    ],
  },
];

export const DEMO_FOLLOWUPS = [
  {
    followUpId: "demo-followup-1",
    threadId: "demo-thread-1",

    to: ["recruiter@techcompany.com"],
    cc: [],
    bcc: [],

    subject: "Application for Full Stack Developer",

    htmlBody: `
      <p>Hi,</p>
      <p>
        I wanted to follow up on my application for the
        <strong>Full Stack Developer</strong> position.
      </p>
      <p>
        I would be happy to discuss my experience with React,
        Node.js and cloud technologies.
      </p>
      <p>Looking forward to hearing from you.</p>
      <p>Regards,<br />Alex Morgan</p>
    `,

    opens: 4,
    sentAt: "2026-09-18T10:30:00.000Z",
    messageId: "demo-message-1",

    daysSince: 8,
    followUpCount: 0,
    nextFollowUpDate: "2026-09-25T10:30:00.000Z",
    status: "Pending",
  },

  {
    followUpId: "demo-followup-2",
    threadId: "demo-thread-2",

    to: ["careers@startup.com"],
    cc: [],
    bcc: [],

    subject: "Software Engineer Application",

    htmlBody: `
      <p>Hello,</p>
      <p>
        I'm following up regarding my application for the
        <strong>Software Engineer</strong> position.
      </p>
      <p>
        I have several years of experience working with
        React.js, Node.js, Express.js and SQL.
      </p>
      <p>
        Please let me know if you need any additional information.
      </p>
      <p>Best regards,<br />Alex Morgan</p>
    `,

    opens: 3,
    sentAt: "2026-09-17T14:15:00.000Z",
    messageId: "demo-message-2",

    daysSince: 9,
    followUpCount: 1,
    nextFollowUpDate: "2026-09-24T14:15:00.000Z",
    status: "Pending",
  },

  {
    followUpId: "demo-followup-3",
    threadId: "demo-thread-3",

    to: ["hr@productcompany.com"],
    cc: [],
    bcc: [],

    subject: "Frontend Developer Application | React.js",

    htmlBody: `
      <p>Hi,</p>
      <p>
        I wanted to check in regarding my application for the
        <strong>Frontend Developer</strong> role.
      </p>
      <p>
        I'm particularly interested in the opportunity to work
        on React-based applications and data-driven interfaces.
      </p>
      <p>Thank you for your time.</p>
      <p>Regards,<br />Alex Morgan</p>
    `,

    opens: 6,
    sentAt: "2026-09-16T09:45:00.000Z",
    messageId: "demo-message-3",

    daysSince: 10,
    followUpCount: 1,
    nextFollowUpDate: "2026-09-23T09:45:00.000Z",
    status: "Pending",
  },

  {
    followUpId: "demo-followup-4",
    threadId: "demo-thread-4",

    to: ["recruitment@softwarecompany.com"],
    cc: [],
    bcc: [],

    subject: "Backend Developer | Node.js",

    htmlBody: `
      <p>Hello,</p>
      <p>
        I'm following up on my application for the
        <strong>Backend Developer</strong> position.
      </p>
      <p>
        My experience includes Node.js, Express.js, REST APIs,
        SQL databases and cloud services.
      </p>
      <p>
        I would appreciate the opportunity to discuss the role further.
      </p>
      <p>Regards,<br />Alex Morgan</p>
    `,

    opens: 2,
    sentAt: "2026-09-15T11:20:00.000Z",
    messageId: "demo-message-4",

    daysSince: 11,
    followUpCount: 2,
    nextFollowUpDate: "2026-09-22T11:20:00.000Z",
    status: "Pending",
  },

  {
    followUpId: "demo-followup-5",
    threadId: "demo-thread-5",

    to: ["jobs@techstartup.com"],
    cc: [],
    bcc: [],

    subject: "Full Stack Developer | React + Node.js",

    htmlBody: `
      <p>Hi,</p>
      <p>
        I wanted to follow up regarding my application for the
        <strong>Full Stack Developer</strong> position.
      </p>
      <p>
        I have experience building full-stack applications using
        React.js, Node.js, Express.js and cloud technologies.
      </p>
      <p>
        Please let me know if there are any updates regarding my application.
      </p>
      <p>Best regards,<br />Alex Morgan</p>
    `,

    opens: 5,
    sentAt: "2026-09-14T13:00:00.000Z",
    messageId: "demo-message-5",

    daysSince: 12,
    followUpCount: 0,
    nextFollowUpDate: "2026-09-21T13:00:00.000Z",
    status: "Pending",
  },
];

export const demoAccount = {
  id: "Alex Morgan",
  email: "alex@demo.mailtracker.app",
  gmailAccountId: "demo-gmail",
  isPrimary: true,
};
