import { join } from "path";

const EXTENSION = {
  MJS: "mjs",
  JSON: "json",
  MD: "md",
};

const COMPONENT_TYPE = {
  ACTION: "action",
  SOURCE: "source",
};

const STRATEGY = {
  DEFAULT: "default",
  POLLING: "polling",
  WEBHOOK: "webhook",
};

const DIRS = {
  TEMPLATES: "templates",
  ACTIONS: "actions",
  SOURCES: "sources",
  COMMON: "common",
};

const TEMPLATE = {
  PACKAGE: join(DIRS.TEMPLATES, "package.ejs"),
  APP: {
    axios: join(DIRS.TEMPLATES, "app.ejs"),
    graphql: join(DIRS.TEMPLATES, "app.graphql.ejs")
  },
  CONSTANTS: join(DIRS.TEMPLATES, DIRS.COMMON, "constants.ejs"),
  UTILS: join(DIRS.TEMPLATES, DIRS.COMMON, "utils.ejs"),
  ACTION: join(DIRS.TEMPLATES, DIRS.ACTIONS, COMPONENT_TYPE.ACTION, "action.ejs"),
  SOURCE: join(DIRS.TEMPLATES, DIRS.SOURCES, COMPONENT_TYPE.SOURCE, "source.ejs"),
  BASE_SOURCE: join(DIRS.TEMPLATES, DIRS.SOURCES, DIRS.COMMON, "base.ejs"),
  POLLING_SOURCE: join(DIRS.TEMPLATES, DIRS.SOURCES, DIRS.COMMON, "polling.ejs"),
  WEBHOOK_SOURCE: join(DIRS.TEMPLATES, DIRS.SOURCES, DIRS.COMMON, "webhook.ejs"),
  EVENTS_SOURCE: join(DIRS.TEMPLATES, DIRS.SOURCES, DIRS.COMMON, "events.ejs"),
};

export default {
  EXTENSION,
  COMPONENT_TYPE,
  STRATEGY,
  DIRS,
  TEMPLATE,
};
