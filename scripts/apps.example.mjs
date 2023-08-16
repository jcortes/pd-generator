export default [{
  app: "webinarkit",
  baseUrl: "https://webinarkit.com",
  versionPath: "/api",
  buildPath: "/Users/jcortes/Public/git/pipedream/components/webinarkit/build",
  actions: [
    {
      name: "List Webinars",
      description: "Returns a list of webinars.",
      apiDocsUrl: "https://documenter.getpostman.com/view/22597176/Uzs435mo#31a536ea-5a5a-4b22-8523-4b69b79afce7"
    },
    {
      name: "Create Webinar",
      description: "Creates a new webinar.",
      apiDocsUrl: "https://documenter.getpostman.com/view/22597176/Uzs435mo#c7925070-a595-4fb2-ae68-630620db9ed6"
    },
    {
      name: "Register Attendee",
      description: "Registers a new attendee for a specific webinar.",
      apiDocsUrl: "https://documenter.getpostman.com/view/22597176/Uzs435mo#4eb04d17-042d-4026-8b2d-bc972f442ae0"
    },
    {
      name: "Send Reminder",
      description: "Sends a reminder to the attendees about the pending webinar.",
      apiDocsUrl: "https://documenter.getpostman.com/view/22597176/Uzs435mo#033f7d11-dcd3-4130-b41b-7eee4d4f28d1"
    }
  ],
  sources: [
    {
      name: "Webinar Created",
      description: "Triggered when a new webinar is created.",
      apiDocsUrl: "https://documenter.getpostman.com/view/6125750/UyrDEFnd#b6db56e1-2767-499e-9928-38c82f3bd3e6",
      strategy: "polling"
    }
  ],
  mainApiDocs: "",
  mainApiDocsUrl: "",
  aiEnabled: false
}];
