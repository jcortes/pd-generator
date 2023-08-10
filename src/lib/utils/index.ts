import { join, basename } from "path";
import { renderFile } from "ejs";
import constants from "$lib/constants";

const {
  EXTENSION,
  COMPONENT_TYPE,
  DIRS,
  TEMPLATE,
} = constants;

function jsFromTemplate(template: string, extension = EXTENSION.MJS) {
  return basename(template).replace(/\.ejs$/, `.${extension}`);
}

function componentMapper({ app, type }: App.ComponentMapperArgs) {
  return ({ name, description, strategy, apiDocsUrl, apiDocs }: App.ComponentMapperCurryArgs) => {
    const nameTrimed = name.split(" ").map((word: string) => word.trim());
    const key =
      nameTrimed
        .filter((word: string) => word.length > 1 && word !== "an")
        .join("-")
        .toLowerCase();
    return {
      app,
      type,
      componentName: key,
      key: `${app}-${key}`,
      name: nameTrimed.join(" ").trim(),
      description: description.trim(),
      strategy,
      apiDocsUrl,
      apiDocs
    };
  };
}

function getFileAndTemplate({ appDir, type, componentName }: App.GetFileAndTemplateArgs) {
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

function createComponentFile(appDir: string) {
  return async ({ app, type, componentName, key, name, description, strategy, apiDocsUrl, apiDocs }: App.CreateComponentFileCurryArgs) => {
    const [filePath, templateFilePath] = getFileAndTemplate({ appDir, type, componentName });
    const fileContent =
      await renderFile(templateFilePath, {
        app, key, name, description, type, strategy, apiDocsUrl
      });
    return { filePath, fileContent, componentName, apiDocsUrl, apiDocs };
  };
}

export default {
  jsFromTemplate,
  componentMapper,
  getFileAndTemplate,
  createComponentFile
};
