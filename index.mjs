import { createReadStream } from "fs";
import { dirname, join } from "path";
import fsExtra from "fs-extra";
import { renderFile } from "ejs";
import yargsParser from "yargs-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = yargsParser(process.argv.slice(2));
const templatesDir = join(__dirname, "templates"); 
const appTemplateFile = join(templatesDir, "app.ejs");
const commonBaseTemplateFile = join(templatesDir, "common-base.ejs");
const commonConstantsTemplateFile = join(templatesDir, "common-constants.ejs");
const commonUtilsTemplateFile = join(templatesDir, "common-utils.ejs");
const actionComponentTemplateFile = join(templatesDir, "action-component.ejs");
const sourceComponentTemplateFile = join(templatesDir, "source-component.ejs");
const componentCommonTemplateFile = join(templatesDir, "component-common.ejs");

const jsExtension = "mjs";

function getComponentsMetadata({ app, cardContent }) {
  const componentRows =
    cardContent
      .split("\n")
      .filter(row => row);

  return componentRows.map(row => {
    const [name, description] = row.split("|");
    const nameTrimed =
      name.split(" ")
        .map(word => word.trim());

    const key =
      nameTrimed
        .filter(word => word.length > 1 && word !== "an")
        .join("-")
        .toLowerCase();
    return [
      key,
      `${app}-${key}`,
      nameTrimed.join(" ").trim(),
      description.trim(),
    ];
  });
}

const main = () => {
  try {
    const { app, type, version, baseUrl = "https://api.changeit.com", versionPath = "", cardFile } = args;
    let cardContent = "";
    const componentType = `${type || "action"}s`;

    function onReadData(chunk) {
      cardContent += Buffer.from(chunk).toString();
    }

    function onReadError(e) {
      return console.error(e);
    }

    async function onReadEnd() {
      try {
        // Creates the app dir and file
        if (!fsExtra.existsSync(app)) {
          fsExtra.mkdirSync(app);
        }

        const appFilePath = join(app, `${app}.app.${jsExtension}`);
        const appFileContent = await renderFile(appTemplateFile, { app });
        fsExtra.outputFileSync(appFilePath, appFileContent);

        // Creates main common dir
        const commonDir = join(app, "common");
        if (!fsExtra.existsSync(commonDir)) {
          fsExtra.mkdirSync(commonDir);
        }
        
        // Creates the base.mjs file inside main common dir
        const baseCommonFilePath = join(commonDir, `base.${jsExtension}`);
        const baseCommonFileContent = await renderFile(commonBaseTemplateFile, { app });
        fsExtra.outputFileSync(baseCommonFilePath, baseCommonFileContent);

        // Creates the constants.mjs file inside main common dir
        const constantsCommonFilePath = join(commonDir, `constants.${jsExtension}`);
        const constantsCommonFileContent = await renderFile(commonConstantsTemplateFile, { baseUrl, versionPath });
        fsExtra.outputFileSync(constantsCommonFilePath, constantsCommonFileContent);

        // Creates the utils.mjs file inside main common dir
        const utilsCommonFilePath = join(commonDir, `utils.${jsExtension}`);
        const utilsCommonFileContent = await renderFile(commonUtilsTemplateFile);
        fsExtra.outputFileSync(utilsCommonFilePath, utilsCommonFileContent);

        // Creates actions or sources dir
        const componentTypeDir = join(app, componentType);
        if (!fsExtra.existsSync(componentTypeDir)) {
          fsExtra.mkdirSync(componentTypeDir);
        }
      
        // Creates the common.mjs file inside actions or sources dir
        const componentCommonFilePath = join(componentTypeDir, `common.${jsExtension}`);
        const componentCommonFileContent = await renderFile(componentCommonTemplateFile);
        fsExtra.outputFileSync(componentCommonFilePath, componentCommonFileContent);

        getComponentsMetadata({ app, cardContent })
          .forEach(async ([componentName, key, name, description]) => {
            // Creates a dir for each component
            const componentDir = join(componentTypeDir, componentName);
            if (!fsExtra.existsSync(componentDir)) {
              fsExtra.mkdirSync(componentDir);
            }

            const data = {
              app: app || "myapp",
              key,
              name,
              description,
              type: type || "action",
              version: version || "0.0.1",
            };
            
            // Creates the main file for each component dir
            const componentTemplateFile = type === "action" ? actionComponentTemplateFile : sourceComponentTemplateFile;
            const componentFilePath = join(componentDir, `${componentName}.${jsExtension}`);
            const componentFileContent = await renderFile(componentTemplateFile, data);
            fsExtra.outputFileSync(componentFilePath, componentFileContent);
          });
        
      } catch (error) {
        console.error(error);
      }
    }

    createReadStream(cardFile)
      .on("data", onReadData)
      .on("error", onReadError)
      .on("end", onReadEnd);
    
  } catch (err) {
    console.error(err)
  }
}

main();