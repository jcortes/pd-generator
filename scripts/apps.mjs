export default [{
  app: "apollo_io",
  baseUrl: "https://api.apollo.io",
  versionPath: "/v1",
  buildPath: "/Users/jcortes/Public/git/pipedream/components/apollo_io/build",
  actions: [
    {
      name: "People Enrichment",
      description: "Enriches a person's information, the more information you pass in, the more likely we can find a match.",
      apiDocsUrl: "https://apolloio.github.io/apollo-api-docs/?shell#people-enrichment"
    }
  ],
  sources: [
    {
      name: "Contact Created",
      description: "Triggers when a contact is created.",
      apiDocsUrl: "https://apolloio.github.io/apollo-api-docs/?shell#search-for-contacts",
      strategy: "polling"
    },
    {
      name: "Contact Updated",
      description: "Triggers when a contact is updated.",
      apiDocsUrl: "https://apolloio.github.io/apollo-api-docs/?shell#search-for-contacts",
      strategy: "polling"
    }
  ],
}];
