const date = new Date().toISOString();
const brokenCapabilities = {
  browserName: "chrome",
  platformName: "macOS 13",
  browserVersion: "latest",
  "sauce:options": {
    name: "Broken Google Search",
    screenResolution: "1280x960",
    build: process.env.GITLAB_CI
      ? `${process.env.CI_JOB_NAME}-${date}`
      : `support-tech-test-${date}`,
    idleTimeout: 8,
  },
};

const workingCapabilities = {
  browserName: "chrome",
  platformName: "macOS 13",
  browserVersion: "latest",
  "sauce:options": {
    name: "Guinea-Pig Sauce",
    screenResolution: "1280x960",
    build: process.env.GITLAB_CI
      ? `${process.env.CI_JOB_NAME}-${date}`
      : `support-tech-test-${date}`,
    tags: ["NicoTag1", "NicoTag2", "NicoTag3"],
    idleTimeout: 5,
  },
};

exports.brokenCapabilities = brokenCapabilities;
exports.workingCapabilities = workingCapabilities;
