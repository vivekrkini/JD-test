const { devices, test, expect } = require("@playwright/test");

test.describe("JDoodle Online Java Compiler Test Suite", () => {
  let editor, editorInput;

  test.beforeEach(async ({ page }) => {
    // can be used from separate file for better maintennance
    editor = page.locator("#ideCodeEditor textarea");
    editorInput = page.locator("#ideCodeEditor .ace_scroller > .ace_content");
    await page.goto("https://www.jdoodle.com/online-java-compiler");
  });

  test("Verify Page Title", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Online Java Compiler - Online Java Editor - Java Code Online"
    );
  });

  test("Check Editor Availability", async ({ page }) => {
    await expect(editor).not.toBeNull();
  });

  test("Execute Sample Java Code", async ({ page }) => {
    const code = `public class HelloWorld {
                    public static void main(String[] args) {
                      System.out.println("Hello, JDoodle!");
                    }
                  }`;
    // clear the field
    await editorInput.click();
    await page.keyboard.press("Meta+A");
    await page.keyboard.press("Delete");
    // fill new code
    await editor.fill(code);
    await page.getByRole("button", { name: "Execute" }).click();
    await page.waitForSelector(
      "#output > .ace_scroller > .ace_content .ace_line"
    );
    const outputText = await page
      .locator("#output > .ace_scroller > .ace_content .ace_line")
      .first();
    await expect(outputText).toContainText("Hello, JDoodle!");
  });

  test("Verify Clear on editor", async ({ page }) => {
    // clear the field
    await editorInput.click();
    await page.keyboard.press("Meta+A");
    await page.keyboard.press("Delete");
    await expect(editor).toHaveText("");
  });

  test("Verify Save Option", async ({ page }) => {
    await page.click('[data-icon="floppy-disk"]');
    let GoogleSignIn = await page.getByRole("button", {
      name: "google Sign in with Google",
    });
    await expect(GoogleSignIn).toBeInViewport();
  });

  test("Test Invalid Java Code Execution", async ({ page }) => {
    test.setTimeout(2 * 60 * 1000)
    // clear the field
    await editorInput.click();
    await page.keyboard.press("Meta+A");
    await page.keyboard.press("Delete");
    // fill new code
    const invalidCode = `public class HelloWorld {
                            public static void main(String[] args) {
                              System.out.println("Hello, JDoodle!");
                            }`;
    await editor.fill(invalidCode);
    await page.getByRole("button", { name: "Execute" }).click();
    await expect(page.locator('text="JDoodle in Action.... Running the program..."')).toBeHidden({timeout: 30000})
    const outputText = await page
      .locator("#output > .ace_scroller > .ace_content .ace_line")
      .nth(1);
    await expect(outputText).toContainText("error", { timeout: 60000});
  });

  test("Test Multiple Code Execution", async ({ page }) => {
    await page.goto("https://www.jdoodle.com/online-java-compiler");
    const code1 = `public class HelloWorld {
                    public static void main(String[] args) {
                      System.out.println("Hello, JDoodle!");
                    }
                  }`;
    await editor.fill(code1);
    await page.getByRole("button", { name: "Execute" }).click();
    await expect(page.locator('text="JDoodle in Action.... Running the program..."')).toBeHidden({timeout: 30000})
    await page.waitForSelector(
      "#output > .ace_scroller > .ace_content .ace_line"
    );
    const outputText = await page
      .locator("#output > .ace_scroller > .ace_content .ace_line")
      .nth(1);
    await expect(outputText).toContainText("error");
  });

  // TBD - later exercise
  test.skip("Test Large Code Submission", async ({ page }) => {
    await page.goto("https://www.jdoodle.com/online-java-compiler");
    const largeCode = Array(2000)
      .fill("public static void main(String[] args) {}")
      .join("\n");
    await page.fill(
      'textarea[placeholder="Enter Your Java Code here"]',
      largeCode
    );
    await page.click("button#execute");
    await page.waitForSelector("pre#output");
    const outputText = await page.textContent("pre#output");
    await expect(outputText).toContain("Hello, JDoodle!");
  });

  test.skip("Test Unsupported Browser Compatibility", async ({
    page,
    browserName,
  }) => {
    if (browserName === "webkit") {
      // Skipping test for Safari (as an example) due to known issues with this browser
      test.skip();
    } else {
      // Run the test for other browsers
      await page.goto("https://www.jdoodle.com/online-java-compiler");
      const code = `public class HelloWorld {
                      public static void main(String[] args) {
                        System.out.println("Hello, JDoodle!");
                      }
                    }`;
      await page.fill(
        'textarea[placeholder="Enter Your Java Code here"]',
        code
      );
      await page.click("button#execute");
      await page.waitForSelector("pre#output");
      const outputText = await page.textContent("pre#output");
      await expect(outputText).toContain("Hello, JDoodle!");
    }
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});

test.describe("JDoodle Online Java Compiler Test Suite - Mobile", () => {
  const iPhone = devices["iPhone 11 Pro"];

  test("Verify Page Title - Mobile", async ({ page }) => {
    await page.goto("https://www.jdoodle.com/online-java-compiler", {
      ...iPhone,
    });
    await expect(page).toHaveTitle(
      "Online Java Compiler - Online Java Editor - Java Code Online"
    );
  });

  test("Check Editor Availability - Mobile", async ({ page }) => {
    await page.goto("https://www.jdoodle.com/online-java-compiler", {
      ...iPhone,
    });
    const editor = await page.$(
      'textarea[placeholder="Enter Your Java Code here"]'
    );
    await expect(editor).not.toBeNull();
  });

  // Rest of the test cases remain the same as in the previous suite...
  // (Execute Sample Java Code, Verify Clear Button Functionality, and so on)
});
