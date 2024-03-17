import puppeteer, { Page } from "puppeteer";
import lighthouse from "lighthouse";
import fs from "fs";

const HOSTNAME = "https://sqemp-fe.stg.squantumengine.com";
const OUTPUT_FOLDER = "lighthouse";

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function loginSQEMP(page: Page) {
  await delay(1000);

  const loginButton = await page.waitForSelector("button > span");

  if (loginButton) {
    await loginButton.click();
  } else {
    console.log("Login button not found!");
  }
}

async function loadSQEMPLanding(page: Page) {
  await page.waitForFunction("window.location.pathname === '/campaign'");
}

async function loginSQEID(page: Page) {
  const usernameInput = await page.waitForSelector('input[name="username"]');
  const nextButton = await page.waitForSelector('button[type="submit"]');

  if (usernameInput && nextButton) {
    await usernameInput.type(
      process.env.SQEID_USERNAME ?? "sqemp-author@smma.id"
    );
    await nextButton.click();
  }

  const passwordInput = await page.waitForSelector('input[name="password"]');
  const loginButton = await page.waitForSelector('button[type="submit"]');

  if (passwordInput && loginButton) {
    await passwordInput.type(process.env.SQEID_PASSWORD ?? "password");
    await loginButton.click();
  }
}

async function runLighthouseCheck(url: string, page: Page) {
  const completeUrl = HOSTNAME + url;

  await page.goto(completeUrl);

  const runnerResult = await lighthouse(
    completeUrl,
    { disableStorageReset: true },
    {
      extends: "lighthouse:default",
      settings: {
        output: ["html"],
        formFactor: "desktop",
        screenEmulation: {
          // use puppeteer viewport size
          disabled: true,
        },
      },
    },
    page
  );

  if (runnerResult) {
    const reportHtml = runnerResult.report.toString();
    const fileName = url.replace(/\//g, "-");

    if (!fs.existsSync(OUTPUT_FOLDER)) {
      fs.mkdirSync(OUTPUT_FOLDER);
    }

    fs.writeFileSync(`${OUTPUT_FOLDER}/sqemp${fileName}.html`, reportHtml);
  }
}

const targetEndpoints = ["/campaign", "/audit"];

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    // headless: false,
    defaultViewport: {
      width: 1050,
      height: 800,
    },
  });

  const page = await browser.newPage();

  await page.goto(`${HOSTNAME}/login`);

  await loginSQEMP(page);
  await loginSQEID(page);
  await loadSQEMPLanding(page);

  for (const endpoint of targetEndpoints) {
    await runLighthouseCheck(endpoint, page);
  }

  browser.close();
})();
