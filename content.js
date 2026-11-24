/* =====================================================================
   SITE CONTENT: every piece of text on the site lives here.
   Edit the values below and refresh the page. No build step needed.

   Inline formatting you can use inside any text value:
     **text**    -> bold / emphasised
     [[text]]    -> purple accent colour
     __text__    -> underlined highlight
   ===================================================================== */

window.CONTENT = {
  meta: {
    title: "Vaibhav Semwal | Applied AI & Full-Stack Engineer",
    description:
      "Portfolio of Vaibhav Semwal: Computer Science engineer and game developer building agentic AI systems, RAG pipelines and full-stack applications.",
  },

  brand: {
    // Shown next to the logo in the top-left. The dot is coloured automatically.
    first: "vaibhav",
    last: "semwal",
    logoAlt: "Vaibhav Semwal logo",
  },

  nav: [
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
  ],

  hero: {
    status: "Open to Work",
    // Hidden inside the logo's slash; revealed when the logo splits on hover / tap.
    // A different one is picked at random each time the logo opens.
    secrets: [
      "change is the only constant",
      "stay curious",
      "ship it, then make it better",
      "every bug is a lesson",
      "build things that matter",
      "keep moving forward",
    ],
    firstName: "VAIBHAV",
    lastName: "SEMWAL",
    // Short keywords shown under the name, separated by slashes.
    keywords: ["Delhi, IN", "Agentic AI", "RAG Systems", "Full-Stack", "Game Dev"],
    primaryCta: { label: "See my work", href: "#projects" },
    secondaryCta: { label: "Say hello", href: "mailto:vaibhavsemwalxii@gmail.com" },
    // Tech logos on the 3D ring around the hero logo. The ring sits compact
    // around the logo and opens out when hovered (tapped on touch screens).
    // icon: an image file in assets/icons/. Around 16 is the comfortable maximum.
    orbit: [
      { name: "Python", icon: "assets/icons/python.svg" },
      { name: "React", icon: "assets/icons/react.svg" },
      { name: "JavaScript", icon: "assets/icons/javascript.svg" },
      { name: "Node.js", icon: "assets/icons/nodejs.svg" },
      { name: "TypeScript", icon: "assets/icons/typescript.svg" },
      { name: "Django", icon: "assets/icons/django.svg" },
      { name: "Java", icon: "assets/icons/java.svg" },
      { name: "LangChain", icon: "assets/icons/langchain.svg" },
      { name: "C#", icon: "assets/icons/csharp.svg" },
      { name: "Hugging Face", icon: "assets/icons/huggingface.svg" },
      { name: "SQL", icon: "assets/icons/sql.svg" },
      { name: "Docker", icon: "assets/icons/docker.svg" },
      { name: "PostgreSQL", icon: "assets/icons/postgresql.svg" },
      { name: "MongoDB", icon: "assets/icons/mongodb.svg" },
      { name: "Git", icon: "assets/icons/git.svg" },
      { name: "Godot", icon: "assets/icons/godot.svg" },
    ],
  },

  about: {
    title: "About",
    accent: "me",
    lead:
      "CS Engineer and Game Developerㅤㅤㅤ**1 year of experience.**",
    paragraphs: [
      "I have worked in multiple languages such as Python, JS, Java and C# with various different frameworks with hands on experience with the modern Gen-AI stack. Building RAG and agentic end-to-end systems, from vector retrieval design and prompt/agent architecture all the way to production deployment.",
      "My background in scalable, RPC client-server architecture means I bring the same systems discipline (__modularity, performance, reliability__) to AI application design.",
    ],
    // value: the number that counts up. decimals: digits after the point.
    stats: [
      { value: 95, decimals: 0, suffix: "%", label: "tool-call accuracy on my desktop agent" },
      { value: 35, decimals: 0, suffix: "%", label: "boost in app responsiveness shipped" },
      { value: 20, decimals: 0, suffix: "%", label: "faster network responses" },
    ],
    // Four small tiles filling the last stat slot (2x2).
    // tone: purple | blue | indigo | outline
    mini: [
      { value: "1+", label: "years shipping", tone: "purple" },
      { value: "10+", label: "featured projects", tone: "outline" },
      { value: "16", label: "tools & languages", tone: "outline" },
      { value: "IN", label: "Delhi · remote", tone: "blue" },
    ],
  },

  /* -------------------------------------------------------------------
     PROJECTS CAROUSEL
     Each { ... } block in `items` becomes one card. To add a project,
     copy this template to the end of the list and fill it in:

      {
        kicker: "One-line description",
        name: "Project Name",
        summary: "One or two short sentences. Use **bold** for a key result.",
        tags: ["Tech", "Used"],
        link: "https://github.com/...",                          // optional
        visual: { type: "image", src: "assets/my-project.png" }, // optional
      },

     visual types (all optional; leave visual out for a styled placeholder):
       { type: "image", src: "assets/file.png" }   -> a screenshot
       { type: "terminal", title, lines: [...] }  -> animated log (see JARVIS)
       { type: "paper", heading, badge, questions, button } -> paper mock-up
       { type: "notify", app, items: [[sender, subject], ...] } -> notification stack (see MailTag)
     ------------------------------------------------------------------- */
  projects: {
    title: "Gen-AI",
    accent: "projects",
    linkLabel: "View on GitHub",
    items: [
      {
        kicker: "Autonomous Desktop AI Agent",
        name: "JARVIS",
        summary:
          "A Dockerised Python agent that runs multi-step tool-calling workflows from speech. Built on LangGraph with guardrails for **95% tool-call accuracy**.",
        tags: ["Python", "LangGraph", "Hugging Face", "LangSmith", "Docker"],
        link: "https://github.com/Vaibhav-Semwal/agentic-assistant",
        // "terminal" shows an animated log. Each line: [type, text]
        // types: user | step | tool | ok
        visual: {
          type: "terminal",
          title: "jarvis · agent.log",
          lines: [
            ["user", "🎙 user: \"summarise today's tasks\""],
            ["step", "◆ graph  planner → executor"],
            ["tool", "→ tool   fs.open(\"today.md\")"],
            ["step", "◆ guard  NeMo rails passed"],
            ["ok", "✓ done   accuracy 95%"],
          ],
        },
      },
      {
        kicker: "RAG-Based AI Test Paper Generator",
        name: "Paper Maker",
        summary:
          "React + Django app that generates test papers grounded in your own content, with a REST CRUD layer and **one-click PDF export**.",
        tags: ["React", "Django", "SQLite", "REST API", "LangChain"],
        link: "https://github.com/Vaibhav-Semwal/PaperMonkey",
        // "paper" shows a stack of generated test papers.
        visual: {
          type: "paper",
          heading: "Unit Test · Physics",
          badge: "RAG-grounded",
          questions: 3,
          button: "Export PDF ↓",
        },
      },
      {
        kicker: "Desktop Mail Notifier",
        name: "MailTag",
        summary:
          "An Electron tray app that starts with your PC, checks your inbox over IMAP on a timer and pops a notification for new mail. Reads sender and subject only, with the app password **encrypted by the OS keyring**.",
        tags: ["Electron", "JavaScript", "Node.js", "IMAP", "HTML/CSS"],
        link: "https://github.com/Vaibhav-Semwal/mail-tag",
        // "notify" shows a stack of desktop notifications. Each item: [sender, subject]
        visual: {
          type: "notify",
          app: "MailTag",
          items: [
            ["GitHub", "Your build passed on main"],
            ["Hiring Team", "Interview slot for Thursday"],
            ["Newsletter", "This week in Node.js"],
          ],
        },
      },
    ],
  },

  experience: {
    title: "Where I've",
    accent: "worked",
    items: [
      {
        meta: "Evolits",
        chip: "Remote",
        role: "Game Developer",
        org: "WildFusion",
        bullets: [
          "Collaborated with international cross-functional teams and players to design and ship game features across the whole application stack.",
          "Engineered modular game components and third-party service integrations, delivering **20% faster** network responses and **35% better** app responsiveness.",
          "Built tools in C#, Godot and Python so teams could exchange data across multiple formats.",
        ],
        tags: ["C#", "Godot", "Python", "System Design"],
        // Optional links shown at the bottom of the card.
        links: [{ label: "Evolits on X", href: "https://x.com/evolitsofficial" }],
      },
    ],
  },

  skills: {
    title: "The",
    accent: "Stack",
    // Small note shown under the toolkit panel, bottom right.
    more: "and much more...",
    // One row per group. icon: code | spark | database | tool
    groups: [
      { icon: "code", title: "Languages", items: ["Python", "JavaScript", "TypeScript", "Java", "C#", "SQL"] },
      { icon: "spark", title: "Gen-AI", items: ["LangGraph/LangChain/LangSmith", "RAG", "Hugging Face", "ollama/vllm", "Agentic AI"] },
      { icon: "database", title: "Frameworks", items: ["React", "Node", "Django", "REST APIs", "MySQL", "PostgreSQL", "MongoDB"] },
      { icon: "tool", title: "Tools", items: ["Docker", "Git/Github", "Godot", "Claude Code"] },
    ],
  },

  contact: {
    titleLine1: "Have an idea?",
    titleLine2: "Let's Build it Together",
    email: "vaibhavsemwalxii@gmail.com",
    links: [
      { label: "GitHub", href: "https://github.com/Vaibhav-Semwal" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/vaibhav-s-39ba95266" },
    ],
  },

  footer: {
    text: "Vaibhav Semwal · Delhi, India", // the © year is added automatically
    backToTop: "Back to top",
  },
};
