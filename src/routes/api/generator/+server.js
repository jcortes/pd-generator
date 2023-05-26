// @ts-nocheck
import { join, basename } from "path";
import fsExtra from "fs-extra";
import { renderFile } from "ejs";
import { json, error } from '@sveltejs/kit';

const EXTENSION = {
  MJS: "mjs",
  JSON: "json",
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
  APP: join(DIRS.TEMPLATES, "app.ejs"),
  CONSTANTS: join(DIRS.TEMPLATES, DIRS.COMMON, "constants.ejs"),
  UTILS: join(DIRS.TEMPLATES, DIRS.COMMON, "utils.ejs"),
  ACTION: join(DIRS.TEMPLATES, DIRS.ACTIONS, COMPONENT_TYPE.ACTION, "action.ejs"),
  SOURCE: join(DIRS.TEMPLATES, DIRS.SOURCES, COMPONENT_TYPE.SOURCE, "source.ejs"),
  BASE_SOURCE: join(DIRS.TEMPLATES, DIRS.SOURCES, DIRS.COMMON, "base.ejs"),
  POLLING_SOURCE: join(DIRS.TEMPLATES, DIRS.SOURCES, DIRS.COMMON, "polling.ejs"),
  WEBHOOK_SOURCE: join(DIRS.TEMPLATES, DIRS.SOURCES, DIRS.COMMON, "webhook.ejs"),
  EVENTS_SOURCE: join(DIRS.TEMPLATES, DIRS.SOURCES, DIRS.COMMON, "events.ejs"),
};

function jsFromTemplate(template, extension = EXTENSION.MJS) {
  return basename(template).replace(/\.ejs$/, `.${extension}`);
}

function componentMapper({ app, type }) {
  return ({ name, description, strategy }) => {
    const nameTrimed = name.split(" ").map(word => word.trim());
    const key =
      nameTrimed
        .filter(word => word.length > 1 && word !== "an")
        .join("-")
        .toLowerCase();
    return {
      app,
      type,
      componentName: key,
      key: `${app}-${key}`,
      name: nameTrimed.join(" ").trim(),
      description: description.trim(),
      strategy
    };
  };
}

function getFileAndTemplate({ appDir, type, componentName }) {
  const relativeFilePath = join(componentName, `${componentName}.${EXTENSION.MJS}`);
  return type === COMPONENT_TYPE.ACTION
    ? [
      join(appDir, DIRS.ACTIONS, relativeFilePath),
      TEMPLATE.ACTION,
    ]
    : [
      join(appDir, DIRS.SOURCES, relativeFilePath),
      TEMPLATE.SOURCE,
    ];
}

function createComponentFile(appDir) {
  return async ({ app, type, componentName, key, name, description, strategy }) => {
    const [filePath, templateFilePath] = getFileAndTemplate({ appDir, type, componentName });
    const fileContent =
      await renderFile(templateFilePath, {
        app, key, name, description, type, strategy
      });
    fsExtra.outputFileSync(filePath, fileContent);
  };
}

/** @type {import("./$types").RequestHandler} */
export async function POST({ request }) {
  const {
    app,
    baseUrl = "https://api.changeit.com",
    versionPath = "/v1",
    actions,
    sources,
    buildPath = "build",
  } = await request.json();

  if (!app) {
    throw error(400, "Missing app name");
  }

  const hasPolling = sources.some(({ strategy }) => strategy === STRATEGY.POLLING);
  const hasWebhook = sources.some(({ strategy }) => strategy === STRATEGY.WEBHOOK);

  const appCapitalized = app.replace(/\w/, fstLetter => fstLetter.toUpperCase());
  const appDir = join(buildPath, app);
  const commonDir = join(appDir, DIRS.COMMON);
  const sourceCommonDir = join(appDir, DIRS.SOURCES, DIRS.COMMON);

  try {
    if (fsExtra.existsSync(buildPath)) {
      fsExtra.rmSync(buildPath, { recursive: true });
    }
  
    // Creates the package.json file
    const packageFile = join(appDir, jsFromTemplate(TEMPLATE.PACKAGE, EXTENSION.JSON));
    const packageFileContent = await renderFile(TEMPLATE.PACKAGE, { app, appCapitalized });
    fsExtra.outputFileSync(packageFile, packageFileContent);
  
    // Creates the main app file
    const appFile = join(appDir, `${app}.app.${EXTENSION.MJS}`);
    const appFileContent = await renderFile(TEMPLATE.APP, { app, hasPolling });
    fsExtra.outputFileSync(appFile, appFileContent);
  
    // Creates the constants.mjs file inside main common dir
    const constantsCommonFile = join(commonDir, jsFromTemplate(TEMPLATE.CONSTANTS));
    const constantsCommonFileContent = await renderFile(TEMPLATE.CONSTANTS, { baseUrl, versionPath });
    fsExtra.outputFileSync(constantsCommonFile, constantsCommonFileContent);
  
    // Creates the utils.mjs file inside main common dir
    const utilsCommonFile = join(commonDir, jsFromTemplate(TEMPLATE.UTILS));
    const utilsCommonFileContent = await renderFile(TEMPLATE.UTILS);
    fsExtra.outputFileSync(utilsCommonFile, utilsCommonFileContent);

    // creates the file sources/common/base.mjs if either hasPolling or hasWebhook is true
    if (hasPolling || hasWebhook) {
      const baseCommonSourceFile = join(sourceCommonDir, jsFromTemplate(TEMPLATE.BASE_SOURCE));
      const baseCommonSourceFileContent = await renderFile(TEMPLATE.BASE_SOURCE, { app });
      fsExtra.outputFileSync(baseCommonSourceFile, baseCommonSourceFileContent);

      const eventsSourceFile = join(sourceCommonDir, jsFromTemplate(TEMPLATE.EVENTS_SOURCE));
      const eventsSourceFileContent = await renderFile(TEMPLATE.EVENTS_SOURCE);
      fsExtra.outputFileSync(eventsSourceFile, eventsSourceFileContent);
    }

    // Creates the file sources/common/polling.mjs if hasPolling is true
    if (hasPolling) {
      const pollingSourceFile = join(sourceCommonDir, jsFromTemplate(TEMPLATE.POLLING_SOURCE));
      const pollingSourceFileContent = await renderFile(TEMPLATE.POLLING_SOURCE);
      fsExtra.outputFileSync(pollingSourceFile, pollingSourceFileContent);
    }

    // Creates the file sources/common/webhook.mjs if hasWebhook is true
    if (hasWebhook) {
      const webhookSourceFile = join(sourceCommonDir, jsFromTemplate(TEMPLATE.WEBHOOK_SOURCE));
      const webhookSourceFileContent = await renderFile(TEMPLATE.WEBHOOK_SOURCE);
      fsExtra.outputFileSync(webhookSourceFile, webhookSourceFileContent);
    }
  
    actions.map(componentMapper({ app, type: COMPONENT_TYPE.ACTION }))
      .concat(sources.map(componentMapper({ app, type: COMPONENT_TYPE.SOURCE })))
      .forEach(createComponentFile(appDir));
  
    return json({ success: true });
    
  } catch (err) {
    console.log(err);
    throw error(400, "Error generating the app");
  }
}