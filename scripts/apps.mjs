export default [{
  app: "scale_ai",
  baseUrl: "https://api.scale.com",
  versionPath: "/v1",
  buildPath: "/Users/jcortes/Public/git/pipedream/components/scale_ai/build",
  actions: [
    {
      name: "Create Image Annotation Task",
      description: "Create an image annotation task.",
      apiDocsUrl: "https://docs.scale.com/reference/general-image-annotation"
    },
    {
      name: "Create Text Annotation Task",
      description: "Create a text annotation task.",
      apiDocsUrl: "https://docs.scale.com/reference/text-collection"
    },
    {
      name: "Create Document Transcription Task",
      description: "Create a document transcription task.",
      apiDocsUrl: "https://docs.scale.com/reference/document-transcription-1"
    },
  ],
  sources: [
    // {
    //   name: "",
    //   description: "",
    //   apiDocsUrl: "",
    //   strategy: "polling"
    // },
  ],
}];
