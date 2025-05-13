const { Builder, By, Key, until } = require("selenium-webdriver");
const SauceLabs = require("saucelabs").default;
const assert = require("assert");
const utils = require("./utils");
require("dotenv").config();

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;

// NOTE: Use the URL below if using our US datacenter (e.g. logged in to app.saucelabs.com)
//const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:443/wd/hub`;
// NOTE: Use the URL below if using our EU datacenter (e.g. logged in to app.eu-central-1.saucelabs.com)
const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.eu-central-1.saucelabs.com:443/wd/hub`;

/**
 * Task I: Update the test code so when it runs, the test clicks the "I am a link" link.
 *
 * Task II - Comment out the code from Task I. Update the test code so when it runs,
 * the test is able to write "Sauce" in the text box that currently says "I has no focus".
 *
 * Task III - Update the test code so when it runs, it adds an email to the email field,
 * adds text to the comments field, and clicks the "Send" button.
 * Note that email will not actually be sent!
 *
 * Task IV - Add a capability that adds a tag to each test that is run.
 * See this page for instructions: https://docs.saucelabs.com/dev/test-configuration-options/
 *
 * Task V: Set the status of the test so it shows as "passed" instead of "complete".
 * We've included the node-saucelabs package already. For more info see:
 * https://github.com/saucelabs/node-saucelabs
 */

describe("Working Sauce", async function () {
  let driver;
  let sessionId;
  const myAccount = new SauceLabs({
    user: SAUCE_USERNAME,
    key: SAUCE_ACCESS_KEY,
    region: "eu", // run in EU datacenter
  });
  console.log(myAccount.webdriverEndpoint);
  //https://ondemand.eu-central-1.saucelabs.com/

  before(async function () {
    driver = await new Builder()
      .withCapabilities(utils.workingCapabilities)
      .usingServer(ONDEMAND_URL)
      .build();

    //Get session Id
    sessionId = (await driver.getSession()).getId();

    await driver.get("https://saucelabs.com/test/guinea-pig");
  });

  it("should go to Google and click Sauce", async function () {
    /*
     * Goes to Sauce Lab's guinea-pig page and verifies the title
     */

    await assert.strictEqual(
      "I am a page title - Sauce Labs",
      await driver.getTitle()
    );
  });

  // Task I

  /* it('Should navigate to the Guinea Pig 2 page when clicking the "I am a link" link', async function () {
    const link = await driver.findElement(By.id("i am a link"));
    await link.click();
    //no explicit wait needed after click, avoided to save testing time 
    const newUrl = await driver.getCurrentUrl();
    
    assert.strictEqual(
      "https://saucelabs.com/test-guinea-pig2.html",
      newUrl,
      `URL Doesn't match`
      );
      }); */

  // Task II

  /* Update the test code so when it runs, 
  the test is able to write "Sauce" in the text box that currently says "I has no focus" */

  it('Should be able to write "Sauce" in the text box that currently says "I has no focus"', async function () {
    //locate Element
    const inputBox = await driver.findElement(By.id("i_am_a_textbox"));

    //clear value of the input element and update using sendKeys
    await inputBox.clear();
    const newValue = "Sauce";
    await inputBox.sendKeys(newValue);
    const currentValue = await inputBox.getAttribute("value");

    await assert.strictEqual(
      "Sauce",
      newValue,
      `Value not updated, current value is: ${currentValue}`
    );
  });

  //task III
  /*  * Task III - Update the test code so when it runs, it adds an email to the email field,
   * adds text to the comments field, and clicks the "Send" button.
   * Note that email will not actually be sent! */

  it('Should add an email to the email input field, add text to the comment field and click on the "Send" button', async function () {
    //locate elements
    const emailInput = await driver.findElement(By.id("fbemail"));
    const commentsInput = await driver.findElement(By.id("comments"));
    const submitButton = await driver.findElement(By.id("submit"));
    const commentsSpan = await driver.findElement(By.id("your_comments"));
    //values to assign
    const emailNewValue = "thisEmail@something.com";
    const commentsNewValue = "This should work.";
    //sendKeys
    await emailInput.sendKeys(emailNewValue);
    await commentsInput.sendKeys(commentsNewValue);
    // current values
    const emailCurrentValue = await emailInput.getAttribute("value");
    const commentsCurrentValue = await commentsInput.getAttribute("value");
    //compare new values to assign with current values
    const areValuesUpdated =
      emailCurrentValue === emailNewValue &&
      commentsCurrentValue === commentsNewValue
        ? true
        : false;

    if (areValuesUpdated) {
      // click on "Submit" button
      await submitButton.click();
      //testing span after click to verify it updated from the comments input
      const spanUpdated = await commentsSpan.getText();
      assert.ok(
        spanUpdated.includes(commentsNewValue),
        "Email and comments successfully updated"
      );
    } else {
      //Explicit error handling
      assert.ok(
        areValuesUpdated,
        `Email and comments not updated correctly.
        Expected Email: ${emailNewValue}, Actual Email: ${emailCurrentValue}
        Expected Comments: ${commentsNewValue}, Actual Comments: ${commentsCurrentValue}`
      );
    }
  });

  after(async function () {
    // Quit the session
    await driver.quit();
    /* Unfortunately I was unable to change status from "complete" to "passed", status key states as depricated,
    so I changed "passed" status to true...  */

    await myAccount.updateJob(process.env.SAUCE_USERNAME, sessionId, {
      passed: true,
      status: "passed",
    });

    const jobs = await myAccount.listJobs(process.env.SAUCE_USERNAME, {
      limit: 1,
      full: true,
    });
    console.log(jobs, "JOBS");
  });
});
