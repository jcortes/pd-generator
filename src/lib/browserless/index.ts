import puppeteer, { type PuppeteerLaunchOptions } from "puppeteer";
import { env } from "$env/dynamic/private";

function getBrowser(args?: PuppeteerLaunchOptions) {
  return puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${env.BROWSERLESS_API_KEY}`,
    ...args
  });
}

async function getApiDocsByUrl(url: string) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(url);
  const textContent =await page.evaluate(() => {
    const elements = document.querySelectorAll("script, style");
    elements.forEach((element) => element.remove());
    return document.body.textContent
  });
  await browser.close();
  return textContent;
}

export default {
  getApiDocsByUrl
};