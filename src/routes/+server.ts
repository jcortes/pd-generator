import { join } from "path";
import fsExtra from "fs-extra";
import { renderFile } from "ejs";
import { json, error } from "@sveltejs/kit";
import openai from "$lib/openai";
import browserless from "$lib/browserless";
import utils from "$lib/utils";
import constants from "$lib/constants";

const {
  EXTENSION,
  COMPONENT_TYPE,
  STRATEGY,
  DIRS,
  TEMPLATE,
} = constants;

export async function POST({ request }) {
  const {
    lib = "axios",
    app,
    baseUrl = "https://api.changeit.com",
    versionPath = "/v1",
    actions,
    sources,
    buildPath = "build",
    mainApiDocs,
    mainApiDocsUrl,
    aiEnabled = false,
  }: App.RequestData = await request.json();

  if (!app) {
    throw error(400, "Missing app name");
  }

  const mainApiDocsContent = aiEnabled
    && mainApiDocsUrl
    && await browserless.getApiDocsByUrl(mainApiDocsUrl)
    || mainApiDocs;

  let templates = "";
  const hasPolling = sources.some(({ strategy }) => strategy === STRATEGY.POLLING);
  const hasWebhook = sources.some(({ strategy }) => strategy === STRATEGY.WEBHOOK);

  const appCapitalized = app.replace(/\w/, (fstLetter: string) => fstLetter.toUpperCase());
  const appDir = join(buildPath, app);
  const commonDir = join(appDir, DIRS.COMMON);
  const sourceCommonDir = join(appDir, DIRS.SOURCES, DIRS.COMMON);

  try {
    if (fsExtra.existsSync(buildPath)) {
      fsExtra.rmSync(buildPath, { recursive: true });
    }
  
    // Creates the package.json file
    const packageFile = join(appDir, utils.jsFromTemplate(TEMPLATE.PACKAGE, EXTENSION.JSON));
    const packageFileContent = await renderFile(TEMPLATE.PACKAGE, { app, appCapitalized });
    fsExtra.outputFileSync(packageFile, packageFileContent);
  
    // Creates the main app file
    const appFile = join(appDir, `${app}.app.${EXTENSION.MJS}`);
    const appFileContent = await renderFile(TEMPLATE.APP[lib], { app, hasPolling });
    fsExtra.outputFileSync(appFile, appFileContent);
  
    // Creates the constants.mjs file inside main common dir
    const constantsCommonFile = join(commonDir, utils.jsFromTemplate(TEMPLATE.CONSTANTS));
    const constantsCommonFileContent = await renderFile(TEMPLATE.CONSTANTS, { baseUrl, versionPath });
    fsExtra.outputFileSync(constantsCommonFile, constantsCommonFileContent);
  
    // Creates the utils.mjs file inside main common dir
    const utilsCommonFile = join(commonDir, utils.jsFromTemplate(TEMPLATE.UTILS));
    const utilsCommonFileContent = await renderFile(TEMPLATE.UTILS);
    fsExtra.outputFileSync(utilsCommonFile, utilsCommonFileContent);

    templates += `Package -> ${packageFile}:\n`;
    templates += `${packageFileContent}\n\n`;
    templates += `Code Template -> ${appFile}:\n`;
    templates += `${appFileContent}\n\n`;
    templates += `Code Template -> ${constantsCommonFile}:\n`;
    templates += `${constantsCommonFileContent}\n\n`;
    templates += `Code Template -> ${utilsCommonFile}:\n`;
    templates += `${utilsCommonFileContent}\n\n`;

    // creates the file sources/common/base.mjs if either hasPolling or hasWebhook is true
    if (hasPolling || hasWebhook) {
      const baseCommonSourceFile = join(sourceCommonDir, utils.jsFromTemplate(TEMPLATE.BASE_SOURCE));
      const baseCommonSourceFileContent = await renderFile(TEMPLATE.BASE_SOURCE, { app });
      fsExtra.outputFileSync(baseCommonSourceFile, baseCommonSourceFileContent);

      const eventsSourceFile = join(sourceCommonDir, utils.jsFromTemplate(TEMPLATE.EVENTS_SOURCE));
      const eventsSourceFileContent = await renderFile(TEMPLATE.EVENTS_SOURCE);
      fsExtra.outputFileSync(eventsSourceFile, eventsSourceFileContent);

      templates += `Code Template -> ${baseCommonSourceFile}:\n`;
      templates += `${baseCommonSourceFileContent}\n\n`;
      templates += `Code Template -> ${eventsSourceFile}:\n`;
      templates += `${eventsSourceFileContent}\n\n`;
    }

    // Creates the file sources/common/polling.mjs if hasPolling is true
    if (hasPolling) {
      const pollingSourceFile = join(sourceCommonDir, utils.jsFromTemplate(TEMPLATE.POLLING_SOURCE));
      const pollingSourceFileContent = await renderFile(TEMPLATE.POLLING_SOURCE);
      fsExtra.outputFileSync(pollingSourceFile, pollingSourceFileContent);

      templates += `Code Template -> ${pollingSourceFile}:\n`;
      templates += `${pollingSourceFileContent}\n\n`;
    }

    // Creates the file sources/common/webhook.mjs if hasWebhook is true
    if (hasWebhook) {
      const webhookSourceFile = join(sourceCommonDir, utils.jsFromTemplate(TEMPLATE.WEBHOOK_SOURCE));
      const webhookSourceFileContent = await renderFile(TEMPLATE.WEBHOOK_SOURCE);
      fsExtra.outputFileSync(webhookSourceFile, webhookSourceFileContent);

      templates += `Code Template -> ${webhookSourceFile}:\n`;
      templates += `${webhookSourceFileContent}\n\n`;
    }
  
    const components = actions.map(utils.componentMapper({ app, type: COMPONENT_TYPE.ACTION }))
      .concat(sources.map(utils.componentMapper({ app, type: COMPONENT_TYPE.SOURCE })))
      .map(utils.createComponentFile(appDir))
      .map(async (promise) => {
        const { filePath, fileContent, componentName, apiDocsUrl, apiDocs } = await promise;

        const apiDocsContent = aiEnabled
          && apiDocsUrl
          && await browserless.getApiDocsByUrl(apiDocsUrl)
          || apiDocs;

        const templatePrompt = `These are the file templates: \n\n${templates}\n\nCode Template -> ${filePath}:\n${fileContent}`;

        const prompt = apiDocsContent
          ? `These are the main api docs: ${mainApiDocsContent}\n\nThese are the api docs for the component: ${apiDocsContent}\n\n${templatePrompt}`
          : `These are the main api docs: ${mainApiDocsContent}\n\n${templatePrompt}`;
        
        console.log("prompt!!!", prompt);
        
        const improvement = aiEnabled && await openai.createChatCompletion(prompt);
        return { filePath, fileContent, componentName, improvement };
      });

    const improvements = await Promise.all(components);

    improvements.forEach(({
      filePath, fileContent, componentName, improvement
    }) => {
      fsExtra.outputFileSync(filePath as string, fileContent as string);

      if (improvement) {
        fsExtra.outputFileSync(join(appDir, `${componentName}.${EXTENSION.MD}`), improvement as string);
      }
    });

    return json({ success: true });
    
  } catch (err) {
    console.log(err);
    throw error(400, "Error generating the app");
  }
}
