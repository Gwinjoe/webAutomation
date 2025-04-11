
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

  await checkFor("#games-lobby-wrapper");

  const enterGame = async () => {
    try {
      const frames = await page.frames();
      const targetFrame = frames.find(frame => frame.url().includes('//www.sportybet.com/ng/sportygames/lobby'));
      console.log(await targetFrame.url())
      const element = await targetFrame.locator('div[data-id="35"]').waitHandle();
      await element.click();
      console.log("Game entered successfully")
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (err) {
      console.log("Entering Game Error: " + err)
    }
  }

  await enterGame();
  async function isLoading() {
    const isLoadingOn = await targetFrame.locator("#app-init-loader-wrap").style?.display === "none" ? true : false;

    if (!isLoadingOn) {
      console.log("Game still loading")
      await isLoading();
    }
    console.log("Game finished Loading")
    return;
  }


  // await isLoading();
  const frames = await page.frames();
  const targetFrame = frames.find(frame => frame.url().includes('//www.sportybet.com/ng/sportygames/'));
  console.log(await targetFrame.url())

  const checkIfModalAndClick = async () => {
    try {
      const modalOn = await targetFrame.locator("#__BVID__47___BV_modal_footer_ > button.btn.btn-primary").setTimeout(3000).waitHandle();
      await modalOn.click();
    } catch (err) {
      console.log("No modal found")
    }
  }
  await checkIfModalAndClick();


  const checkAutoBet = async () => {
    try {
      const checkbox = await targetFrame.locator("#__BVID__534 > div > div > div:nth-child(1) > div > div.row.auto-menu.no-gutters > div:nth-child(1) > div > div.position-relative > label > input").waitHandle();
      const isChecked = await checkbox.getProperty("checked").jsonValue();
      console.log(await isChecked)
    } catch (err) {
      console.log("checkbox err: " + err)
    }
  }
  await checkAutoBet();
  //
  // let count = await page.locator(".align-items-center .d-flex .justify-content-center .multiplier > span").waitHandle();
  //
  // console.log(await cookies)
  //
  // count ? console.log(await count.innerText()) : console.log("count not yet rendered in the dom")
  // await page.screenshot({ path: "screenshot.png" })
  // console.log(All done, check the screenshots. ✨)
})();
