const resources = [
  {
    title: "React Interview Preparation Guide",
    slug: "react-interview-preparation-guide",
    category: "Frontend Development",
    description:
      "A practical guide covering the React concepts most commonly discussed in frontend interviews.",
    content:
      "This guide covers React fundamentals, component composition, props, state, hooks, rendering behavior, reconciliation, keys, forms, routing, performance optimization, and common interview patterns. Focus on being able to explain why React behaves a certain way rather than memorizing definitions. Practice small coding tasks around state updates, controlled inputs, effects, memoization, routing, and async data fetching.",
    readTime: 12,
    level: "Intermediate",
    tags: ["React", "Frontend", "JavaScript", "Interview"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "JavaScript Interview Essentials",
    slug: "javascript-interview-essentials",
    category: "Frontend Development",
    description:
      "Review closures, scope, hoisting, promises, async behavior, and other essential JavaScript topics.",
    content:
      "Strong JavaScript knowledge is central to frontend interviews. Review lexical scope, closures, execution context, hoisting, this, prototypes, array methods, event loop behavior, promises, async and await, error handling, object references, destructuring, modules, and immutability. Practice explaining each concept with a small example.",
    readTime: 14,
    level: "Intermediate",
    tags: ["JavaScript", "Frontend", "Interview"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "HTML Interview Questions You Should Know",
    slug: "html-interview-questions-you-should-know",
    category: "Frontend Development",
    description:
      "Review semantic HTML, accessibility, forms, document structure, and browser fundamentals.",
    content:
      "HTML interviews often focus on semantic structure, accessibility, forms, metadata, loading behavior, and the purpose of common elements. Be ready to explain semantic tags, label associations, button types, input types, alt text, ARIA usage, script loading, and the difference between block and inline elements.",
    readTime: 8,
    level: "Beginner",
    tags: ["HTML", "Frontend", "Accessibility"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "CSS Interview Preparation",
    slug: "css-interview-preparation",
    category: "Frontend Development",
    description:
      "A focused review of layout, specificity, responsive design, Flexbox, Grid, and CSS architecture.",
    content:
      "Prepare for CSS interviews by reviewing the box model, cascade, inheritance, specificity, positioning, stacking contexts, Flexbox, Grid, media queries, responsive layouts, pseudo-classes, pseudo-elements, transitions, animations, and common layout debugging techniques.",
    readTime: 10,
    level: "Intermediate",
    tags: ["CSS", "Frontend", "Responsive Design"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "React Hooks Explained for Interviews",
    slug: "react-hooks-explained-for-interviews",
    category: "Frontend Development",
    description:
      "Understand useState, useEffect, useRef, useMemo, useCallback, and other important hooks.",
    content:
      "Hooks are easier to explain when you focus on their purpose. useState stores component state. useEffect synchronizes React with external systems. useRef stores mutable values without causing re-renders. useMemo memoizes computed values. useCallback memoizes function references. Also understand useReducer, useContext, useTransition, useDeferredValue, and custom hooks.",
    readTime: 13,
    level: "Intermediate",
    tags: ["React", "Hooks", "Interview"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "Understanding the React Rendering Cycle",
    slug: "understanding-react-rendering-cycle",
    category: "Frontend Development",
    description:
      "Learn what causes React components to render and how reconciliation updates the DOM.",
    content:
      "A React render happens when state changes, props change, context changes, or a parent renders. Rendering creates a new description of the UI. React then compares the result with the previous tree during reconciliation and applies the required DOM updates. Understanding this flow makes performance questions much easier.",
    readTime: 9,
    level: "Intermediate",
    tags: ["React", "Rendering", "Performance"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "React Performance Optimization Guide",
    slug: "react-performance-optimization-guide",
    category: "Frontend Development",
    description:
      "Learn practical React performance techniques without premature optimization.",
    content:
      "React performance work should start with identifying unnecessary work. Common tools include React.memo, useMemo, useCallback, lazy loading, code splitting, pagination, virtualization, debouncing, deferred updates, and reducing unnecessary state. Memoization should be used where it solves a measurable rendering problem rather than everywhere.",
    readTime: 11,
    level: "Advanced",
    tags: ["React", "Performance", "Optimization"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "React Router Interview Guide",
    slug: "react-router-interview-guide",
    category: "Frontend Development",
    description:
      "Review nested routes, protected routes, params, navigation, BrowserRouter, and HashRouter.",
    content:
      "React Router interviews commonly cover route configuration, nested routes, Outlet, route parameters, query parameters, Link, NavLink, useNavigate, useLocation, protected routes, lazy-loaded routes, BrowserRouter, and HashRouter. Be ready to explain when client-side routing requires server configuration.",
    readTime: 10,
    level: "Intermediate",
    tags: ["React Router", "React", "Routing"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Frontend System Design Basics",
    slug: "frontend-system-design-basics",
    category: "System Design",
    description:
      "An introduction to structuring scalable frontend applications.",
    content:
      "Frontend system design focuses on component architecture, routing, state management, API boundaries, caching, performance, accessibility, error handling, loading states, code splitting, and maintainability. Start by clarifying requirements before discussing implementation details.",
    readTime: 15,
    level: "Intermediate",
    tags: ["System Design", "Frontend", "Architecture"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "How to Structure a React Project",
    slug: "how-to-structure-a-react-project",
    category: "Frontend Development",
    description:
      "Organize components, hooks, pages, utilities, services, and application state cleanly.",
    content:
      "A React project should be organized around clear responsibilities. Typical folders include components, pages, hooks, context, services, utilities, assets, and feature-specific modules. Avoid creating folders without a real need. As the application grows, feature-based grouping often becomes easier to maintain.",
    readTime: 8,
    level: "Beginner",
    tags: ["React", "Architecture", "Project Structure"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "REST API Fundamentals",
    slug: "rest-api-fundamentals",
    category: "Backend Development",
    description:
      "Understand HTTP methods, resources, status codes, validation, and API design.",
    content:
      "REST APIs commonly expose resources through HTTP endpoints. Understand GET, POST, PUT, PATCH, DELETE, request bodies, path parameters, query parameters, headers, status codes, validation, authentication, authorization, pagination, filtering, and consistent error responses.",
    readTime: 11,
    level: "Beginner",
    tags: ["REST API", "Backend", "HTTP"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Node.js Interview Preparation",
    slug: "nodejs-interview-preparation",
    category: "Backend Development",
    description:
      "Review Node.js runtime concepts, async behavior, modules, APIs, and backend fundamentals.",
    content:
      "Node.js interviews often cover the event loop, asynchronous I/O, promises, modules, package management, environment variables, streams, error handling, Express middleware, API architecture, and database integration. Focus on explaining how Node handles concurrent I/O without creating a thread per request.",
    readTime: 14,
    level: "Intermediate",
    tags: ["Node.js", "Backend", "Interview"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "Express.js Middleware Explained",
    slug: "expressjs-middleware-explained",
    category: "Backend Development",
    description:
      "Understand middleware order, request processing, authentication, and error handling.",
    content:
      "Express middleware runs in registration order. Middleware can inspect or modify req and res, terminate the response, or call next to continue. Common middleware includes JSON parsing, CORS, authentication, logging, validation, route handlers, and centralized error handling.",
    readTime: 8,
    level: "Intermediate",
    tags: ["Express", "Node.js", "Backend"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "MongoDB and Mongoose Fundamentals",
    slug: "mongodb-and-mongoose-fundamentals",
    category: "Backend Development",
    description:
      "Learn documents, collections, schemas, ObjectIds, references, indexes, and populate.",
    content:
      "MongoDB stores BSON documents inside collections. Mongoose adds schemas, validation, models, middleware, and helpers around MongoDB. Understand ObjectIds, references, populate, indexes, unique constraints, embedded documents, query methods, and when to normalize or embed related data.",
    readTime: 12,
    level: "Intermediate",
    tags: ["MongoDB", "Mongoose", "Database"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "Authentication vs Authorization",
    slug: "authentication-vs-authorization",
    category: "Backend Development",
    description:
      "Understand the difference between proving identity and controlling access.",
    content:
      "Authentication answers who the user is. Authorization determines what that authenticated user is allowed to do. A secure application must enforce authorization on the backend even if frontend routes and buttons are protected. Frontend protection improves UX but does not secure an API.",
    readTime: 7,
    level: "Beginner",
    tags: ["Authentication", "Authorization", "Security"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "JWT Authentication Explained",
    slug: "jwt-authentication-explained",
    category: "Backend Development",
    description:
      "Learn how JSON Web Tokens are structured and commonly used for authentication.",
    content:
      "A JWT contains encoded header, payload, and signature sections. The signature allows a server to verify that the token has not been altered. Avoid storing sensitive information in the payload because JWT contents can be decoded. Token expiration, secure transport, refresh strategies, and server-side authorization remain important.",
    readTime: 10,
    level: "Intermediate",
    tags: ["JWT", "Authentication", "Security"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Firebase Authentication Overview",
    slug: "firebase-authentication-overview",
    category: "Backend Development",
    description:
      "Understand Firebase Authentication and server-side Firebase ID token verification.",
    content:
      "Firebase Authentication manages user credentials and identity providers such as email/password and Google. After authentication, the client can obtain an ID token. A backend using Firebase Admin can verify that token before accessing protected resources. Application-specific roles and profile data can remain in a separate database.",
    readTime: 9,
    level: "Intermediate",
    tags: ["Firebase", "Authentication", "Backend"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Understanding CORS",
    slug: "understanding-cors",
    category: "Web Fundamentals",
    description:
      "Learn why browsers enforce CORS and how preflight requests work.",
    content:
      "Cross-Origin Resource Sharing controls whether browser JavaScript can access resources from another origin. Requests using certain methods or headers may trigger an OPTIONS preflight request. The server must return the appropriate Access-Control-Allow-Origin, methods, and headers for the browser to proceed.",
    readTime: 8,
    level: "Intermediate",
    tags: ["CORS", "HTTP", "Web"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Git Interview and Daily Workflow Guide",
    slug: "git-interview-and-daily-workflow-guide",
    category: "Developer Tools",
    description:
      "Review commits, branches, merge, rebase, pull requests, and common Git workflows.",
    content:
      "Developers should understand repositories, working trees, staging, commits, branches, merges, rebasing, remote repositories, pull requests, conflict resolution, reset, revert, stash, and .gitignore. In interviews, explain the purpose of each operation rather than only recalling commands.",
    readTime: 10,
    level: "Beginner",
    tags: ["Git", "Developer Tools", "Version Control"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Docker Basics for Developers",
    slug: "docker-basics-for-developers",
    category: "DevOps",
    description:
      "Understand images, containers, Dockerfiles, ports, volumes, and development workflows.",
    content:
      "Docker packages applications and their dependencies into images that can run as containers. Learn the roles of Dockerfiles, images, containers, ports, environment variables, volumes, networks, registries, and Docker Compose. Containers provide process isolation but are not full virtual machines.",
    readTime: 11,
    level: "Intermediate",
    tags: ["Docker", "DevOps", "Containers"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Cloud Computing Fundamentals",
    slug: "cloud-computing-fundamentals",
    category: "DevOps",
    description:
      "Learn the basic ideas behind compute, storage, databases, networking, and managed services.",
    content:
      "Cloud platforms provide infrastructure and managed services on demand. Common areas include virtual compute, object storage, databases, networking, load balancing, DNS, serverless functions, identity management, monitoring, and autoscaling. Understand the tradeoff between managing infrastructure yourself and using managed services.",
    readTime: 12,
    level: "Beginner",
    tags: ["Cloud", "AWS", "Azure", "DevOps"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "SQL Interview Preparation",
    slug: "sql-interview-preparation",
    category: "Data & Database",
    description:
      "Practice joins, grouping, filtering, aggregation, subqueries, and database fundamentals.",
    content:
      "SQL interviews commonly test SELECT queries, WHERE, ORDER BY, GROUP BY, HAVING, aggregate functions, joins, subqueries, CTEs, indexes, primary keys, foreign keys, normalization, and transactions. Practice writing queries against realistic tables instead of only memorizing syntax.",
    readTime: 13,
    level: "Intermediate",
    tags: ["SQL", "Database", "Interview"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "Data Structures for Software Interviews",
    slug: "data-structures-for-software-interviews",
    category: "Interview Preparation",
    description:
      "A practical overview of arrays, strings, hash maps, stacks, queues, trees, and graphs.",
    content:
      "Data structure interviews reward pattern recognition and clear reasoning. Review arrays, strings, linked lists, hash maps, sets, stacks, queues, trees, heaps, graphs, recursion, sorting, searching, and complexity analysis. Practice explaining both time and space complexity.",
    readTime: 16,
    level: "Intermediate",
    tags: ["DSA", "Algorithms", "Interview"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "Big O Notation Made Simple",
    slug: "big-o-notation-made-simple",
    category: "Interview Preparation",
    description: "Learn how to reason about time and space complexity.",
    content:
      "Big O describes how resource usage grows as input size increases. Common complexities include O(1), O(log n), O(n), O(n log n), O(n squared), and exponential behavior. Focus on identifying dominant operations and understanding tradeoffs rather than performing exact timing calculations.",
    readTime: 8,
    level: "Beginner",
    tags: ["Big O", "Algorithms", "Interview"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "How to Answer Behavioral Interview Questions",
    slug: "how-to-answer-behavioral-interview-questions",
    category: "Interview Preparation",
    description:
      "Structure clear answers about teamwork, conflict, failure, ownership, and problem solving.",
    content:
      "Behavioral answers should be specific and structured. The STAR framework uses Situation, Task, Action, and Result. Choose examples that demonstrate ownership, communication, learning, collaboration, problem solving, and measurable outcomes. Avoid vague statements that do not explain what you personally did.",
    readTime: 9,
    level: "Beginner",
    tags: ["Interview", "Behavioral", "Career"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "How to Introduce Yourself in a Technical Interview",
    slug: "how-to-introduce-yourself-in-a-technical-interview",
    category: "Interview Preparation",
    description:
      "Build a concise technical introduction focused on role relevance and projects.",
    content:
      "A strong introduction usually includes your name, current focus, core technical stack, one or two relevant projects, and what kind of role you are pursuing. Keep it concise and avoid narrating your entire life history. Your introduction should naturally create opportunities for useful follow-up questions.",
    readTime: 6,
    level: "Beginner",
    tags: ["Interview", "Introduction", "Career"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Resume Writing for Software Developers",
    slug: "resume-writing-for-software-developers",
    category: "Career",
    description:
      "Create a concise developer resume that emphasizes skills, projects, and measurable outcomes.",
    content:
      "A software developer resume should make technical relevance easy to scan. Include contact information, skills, experience, projects, and education where appropriate. Project bullets should explain what you built, the technologies used, technical challenges, and measurable results where possible.",
    readTime: 11,
    level: "Beginner",
    tags: ["Resume", "Career", "Jobs"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "How to Write Better Project Descriptions",
    slug: "how-to-write-better-project-descriptions",
    category: "Career",
    description:
      "Turn vague project descriptions into clear technical accomplishments.",
    content:
      "Avoid project bullets such as built a website using React. Explain the product, important functionality, technical decisions, integrations, and outcomes. Strong descriptions make it easy for an interviewer to understand the scope and ask deeper technical questions.",
    readTime: 7,
    level: "Beginner",
    tags: ["Resume", "Projects", "Career"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Building a Developer Portfolio",
    slug: "building-a-developer-portfolio",
    category: "Career",
    description:
      "Choose projects and presentation strategies that demonstrate real development ability.",
    content:
      "A portfolio should demonstrate that you can build, debug, explain, and finish software. A few complete projects are generally more valuable than many unfinished demos. Include clear descriptions, technologies, screenshots when useful, source code, deployed links, and explanations of important technical decisions.",
    readTime: 9,
    level: "Beginner",
    tags: ["Portfolio", "Career", "Projects"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Job Search Strategy for Developers",
    slug: "job-search-strategy-for-developers",
    category: "Career",
    description:
      "Organize applications, networking, interview preparation, and follow-ups effectively.",
    content:
      "A productive job search combines targeted applications, portfolio improvement, technical preparation, networking, referrals, and consistent follow-up. Track applications so you know the company, role, date, current status, and next action. Quality and consistency generally matter more than sending identical applications everywhere.",
    readTime: 10,
    level: "Beginner",
    tags: ["Jobs", "Career", "Applications"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "How to Read a Job Description",
    slug: "how-to-read-a-job-description",
    category: "Career",
    description:
      "Separate core requirements from preferences and understand what employers are really asking for.",
    content:
      "Job descriptions frequently mix essential requirements, preferred qualifications, responsibilities, and general company language. Identify the core technologies and responsibilities first. You do not need to satisfy every preferred item before applying if you meet much of the role's actual requirement.",
    readTime: 7,
    level: "Beginner",
    tags: ["Jobs", "Career", "Applications"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Salary Negotiation Basics",
    slug: "salary-negotiation-basics",
    category: "Career",
    description:
      "Understand compensation discussions and how to negotiate professionally.",
    content:
      "Salary discussions work best when based on role scope, market context, experience, and the complete compensation package. Avoid negotiating emotionally. Ask clarifying questions, understand base pay and benefits, and communicate your expectations clearly and professionally.",
    readTime: 8,
    level: "Beginner",
    tags: ["Salary", "Career", "Negotiation"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "LinkedIn Profile Guide for Developers",
    slug: "linkedin-profile-guide-for-developers",
    category: "Career",
    description:
      "Improve your profile headline, summary, skills, experience, and project visibility.",
    content:
      "A developer LinkedIn profile should clearly communicate what you build and what roles you target. Use a specific headline, concise summary, relevant technical skills, project links, and clear experience descriptions. Keep information aligned with your resume.",
    readTime: 8,
    level: "Beginner",
    tags: ["LinkedIn", "Career", "Job Search"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Networking for Software Developers",
    slug: "networking-for-software-developers",
    category: "Career",
    description:
      "Build useful professional relationships without sending generic referral requests.",
    content:
      "Effective networking is based on genuine professional interaction. Engage with developers, recruiters, communities, alumni, and people working in areas you are interested in. When asking for help, be specific and respectful rather than immediately requesting a referral from someone who does not know you.",
    readTime: 8,
    level: "Beginner",
    tags: ["Networking", "Career", "Jobs"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Frontend Accessibility Fundamentals",
    slug: "frontend-accessibility-fundamentals",
    category: "Frontend Development",
    description:
      "Build interfaces that work with keyboards, screen readers, and assistive technologies.",
    content:
      "Accessibility starts with semantic HTML. Use native elements where possible, label form controls, provide meaningful alternative text, preserve keyboard navigation, maintain sufficient contrast, manage focus appropriately, and use ARIA only when native semantics are insufficient.",
    readTime: 10,
    level: "Intermediate",
    tags: ["Accessibility", "Frontend", "HTML"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Web Performance Fundamentals",
    slug: "web-performance-fundamentals",
    category: "Frontend Development",
    description:
      "Understand loading performance, rendering cost, image optimization, caching, and bundle size.",
    content:
      "Web performance depends on network cost, JavaScript execution, rendering, assets, caching, and server response times. Common improvements include code splitting, lazy loading, optimized images, caching, compression, reducing unnecessary JavaScript, pagination, and avoiding expensive render work.",
    readTime: 11,
    level: "Intermediate",
    tags: ["Performance", "Web", "Frontend"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Browser Rendering Explained",
    slug: "browser-rendering-explained",
    category: "Web Fundamentals",
    description: "Learn how HTML and CSS become pixels on the screen.",
    content:
      "Browsers parse HTML into the DOM and CSS into the CSSOM. These structures contribute to the render tree, layout, paint, and compositing process. JavaScript can affect these stages by changing DOM or style information. Understanding this pipeline helps explain performance and rendering issues.",
    readTime: 10,
    level: "Intermediate",
    tags: ["Browser", "Rendering", "Web"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "The JavaScript Event Loop",
    slug: "the-javascript-event-loop",
    category: "Web Fundamentals",
    description:
      "Understand call stacks, tasks, microtasks, promises, and asynchronous execution.",
    content:
      "JavaScript executes synchronous code on the call stack. Browser or runtime APIs handle asynchronous operations. Completed callbacks are scheduled through queues. Promise callbacks use the microtask queue, which is processed before the next task queue item. Understanding this explains many ordering questions in interviews.",
    readTime: 10,
    level: "Intermediate",
    tags: ["JavaScript", "Event Loop", "Web"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "Promises and Async Await",
    slug: "promises-and-async-await",
    category: "Web Fundamentals",
    description:
      "Understand asynchronous JavaScript and common error-handling patterns.",
    content:
      "Promises represent eventual completion or failure. then and catch attach handlers, while async and await provide syntax for working with promises more sequentially. Always consider rejection handling, parallel operations, cancellation where applicable, and how asynchronous work interacts with UI state.",
    readTime: 9,
    level: "Intermediate",
    tags: ["JavaScript", "Promises", "Async"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Debouncing and Throttling",
    slug: "debouncing-and-throttling",
    category: "Frontend Development",
    description:
      "Learn two common techniques for controlling frequently triggered operations.",
    content:
      "Debouncing delays execution until activity stops for a defined interval. It is useful for search input and validation. Throttling limits execution to at most once per interval and is useful for scroll or resize events. Both techniques reduce unnecessary work but solve different interaction patterns.",
    readTime: 7,
    level: "Intermediate",
    tags: ["JavaScript", "Performance", "Frontend"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Frontend State Management Guide",
    slug: "frontend-state-management-guide",
    category: "Frontend Development",
    description:
      "Decide when local state, context, reducers, or external stores are appropriate.",
    content:
      "State should live as close as practical to the components that need it. Local component state is enough for many features. Context is useful for broadly shared values. Reducers help manage complex state transitions. External stores can help larger applications but should not be introduced simply because they are popular.",
    readTime: 10,
    level: "Intermediate",
    tags: ["React", "State Management", "Architecture"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "API Error Handling for Frontend Developers",
    slug: "api-error-handling-for-frontend-developers",
    category: "Frontend Development",
    description:
      "Build predictable loading, success, empty, and error states around API requests.",
    content:
      "Frontend API handling should account for loading, success, empty data, validation errors, authorization errors, server failures, network failures, and request cancellation. Check HTTP status before assuming a response succeeded and provide users with useful recovery options.",
    readTime: 9,
    level: "Intermediate",
    tags: ["API", "Frontend", "Error Handling"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "System Design: Designing a Job Portal",
    slug: "system-design-designing-a-job-portal",
    category: "System Design",
    description:
      "Explore the major entities and API boundaries of a modern job platform.",
    content:
      "A job portal commonly includes users, candidates, recruiters, companies, jobs, saved jobs, applications, resources, search, filtering, and notifications. Separate identity from application data, model relationships carefully, paginate large collections, enforce authorization at API boundaries, and avoid duplicating data that can be derived from relationships.",
    readTime: 17,
    level: "Advanced",
    tags: ["System Design", "Jobs", "Architecture"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "Database Indexing Basics",
    slug: "database-indexing-basics",
    category: "Data & Database",
    description:
      "Understand why indexes speed up reads and why they also have costs.",
    content:
      "Indexes allow databases to locate matching records without scanning every document or row. They improve many queries but consume storage and add write overhead. Index fields used frequently for filtering, sorting, uniqueness, and relationships based on actual query patterns rather than indexing everything.",
    readTime: 9,
    level: "Intermediate",
    tags: ["Database", "Indexes", "MongoDB"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Database Normalization vs Denormalization",
    slug: "database-normalization-vs-denormalization",
    category: "Data & Database",
    description:
      "Understand when to reference data and when duplication may be appropriate.",
    content:
      "Normalization reduces duplication by storing related entities separately. Denormalization intentionally duplicates selected information to simplify or accelerate reads. The right choice depends on consistency requirements, query patterns, update frequency, and performance. Avoid duplicating data without understanding how it will stay synchronized.",
    readTime: 10,
    level: "Intermediate",
    tags: ["Database", "Architecture", "MongoDB"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Pagination Strategies for Web Applications",
    slug: "pagination-strategies-for-web-applications",
    category: "Backend Development",
    description:
      "Understand page-based and cursor-based pagination and when each approach fits.",
    content:
      "Page-based pagination commonly uses limit and offset or skip and works well for many standard interfaces. Cursor pagination uses a stable field such as an ID or timestamp and scales better for frequently changing or very large datasets. APIs should return enough metadata for the frontend to render navigation predictably.",
    readTime: 9,
    level: "Intermediate",
    tags: ["Pagination", "Backend", "API"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Search and Filtering API Design",
    slug: "search-and-filtering-api-design",
    category: "Backend Development",
    description:
      "Design APIs that support keyword search, filters, sorting, and pagination together.",
    content:
      "Search endpoints often accept query parameters for keyword, category, location, type, experience, mode, sorting, page, and limit. Validate supported values, build database queries deliberately, avoid returning unbounded result sets, and return pagination metadata alongside the records.",
    readTime: 10,
    level: "Intermediate",
    tags: ["Search", "Filtering", "API"],
    featured: false,
    published: true,
    source: "seed",
  },
  {
    title: "Environment Variables and Application Secrets",
    slug: "environment-variables-and-application-secrets",
    category: "Security",
    description:
      "Understand which configuration belongs in frontend and backend environment files.",
    content:
      "Server secrets such as database credentials and service-account keys must remain on the server. Frontend environment variables are bundled into browser code and should never be treated as secret. Keep .env files out of source control and use deployment-provider environment configuration for production.",
    readTime: 8,
    level: "Beginner",
    tags: ["Security", "Environment Variables", "Deployment"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "Frontend vs Backend Authorization",
    slug: "frontend-vs-backend-authorization",
    category: "Security",
    description:
      "Understand why protected routes alone cannot secure application data.",
    content:
      "A frontend protected route can prevent normal navigation and improve the user experience, but users can bypass frontend code and call APIs directly. Every protected backend endpoint must verify identity and enforce permissions independently. The frontend and backend should both understand roles, but the backend is the security boundary.",
    readTime: 7,
    level: "Intermediate",
    tags: ["Security", "Authorization", "Frontend", "Backend"],
    featured: true,
    published: true,
    source: "seed",
  },
  {
    title: "How to Prepare for a Coding Interview",
    slug: "how-to-prepare-for-a-coding-interview",
    category: "Interview Preparation",
    description:
      "Build a practical routine for theory, coding, debugging, and communication practice.",
    content:
      "Interview preparation should combine conceptual review and active coding. Practice explaining solutions before writing code, clarify requirements, test edge cases, debug systematically, and discuss tradeoffs. Repeated focused practice is more useful than passively reading large question lists.",
    readTime: 10,
    level: "Beginner",
    tags: ["Interview", "Coding", "Career"],
    featured: true,
    published: true,
    source: "seed",
  },
];

export default resources;
