
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through puppeteer.use()
const puppeteer = require('puppeteer-extra');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())
//
// // Add adblocker plugin to block all ads and trackers (saves bandwidth)
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }))
//
//
const number = "08145358346";
const password = "Gwin@sportybet1";

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1366, height: 768 }, executablePath: "/opt/google/chrome/google-chrome", userDataDir: "/home/gwin/.config/google-chrome/" });
  const page = await browser.newPage();
  await page.setDefaultTimeout(100000)
  await page.goto('https://www.sportybet.com/ng/games?source=TopRibbon', { waitUntil: "domcontentloaded" })

  async function getBalance() {
    const balance = await page.$eval("#j_balance", el => el.textContent);
    console.log(balance)
    return balance
  }

  async function getElement(selector) {
    const element = await page.$eval(selector, el => el.outerHTML);
    console.log(element)
    return element;
  }
  async function checkFor(selector) {
    try {
      await page.locator(selector).wait()
      console.log(`${selector} found`)
    } catch (err) {
      console.log(err)
    }
  }

  const cookies = await page.cookies();

  const isLoginavailable = cookies.find(cookie => cookie.name === "phone");

  if (!isLoginavailable) {
    const numberInput = await page.locator('input[name="phone"]').waitHandle();
    const passwordInput = await page.locator('input[name="psd"]').waitHandle();
    const submitButton = await page.locator('button[data-cms-key="log_in"]').waitHandle();

    if (passwordInput || numberInput) {
      await numberInput.type(number)
      await passwordInput.type(password)
      await submitButton.click();
    }
  }
  await checkFor("#j_balance")

  await getBalance()

  await checkFor(".container .lobby-container")


  await new Promise(resolve => setTimeout(resolve, 5000));
  await page.mouse.click(727, 220);

  async function isLoading() {
    const isLoadingOn = await page.locator("#app-init-loader-wrap").style?.display === "none" ? true : false;

    if (!isLoadingOn) {
      console.log("Game still loading")
      await isLoading();
    }
    console.log("Game finished Loading")
    return;
  }


  // await isLoading();

  //
  // let count = await page.locator(".align-items-center .d-flex .justify-content-center .multiplier > span").waitHandle();
  //
  // console.log(await cookies)
  //
  // count ? console.log(await count.innerText()) : console.log("count not yet rendered in the dom")
  // await page.screenshot({ path: "screenshot.png" })
  // console.log(All done, check the screenshots. ✨)
})();
