import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

describe("Project Management App", () => {
  it("should load the production app and display the sign in form", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: "https://project-management-app-liard.vercel.app/" });

    const isFormVisible = await testdriver.assert(
      "The Sign In form with email input, password input, and Sign In button is visible"
    );
    expect(isFormVisible).toBeTruthy();
  });

  it("should allow entering sample credentials into the sign in form", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: "https://project-management-app-liard.vercel.app/" });

    await testdriver.find("Email input field").click();
    await testdriver.type("alice@example.com");

    await testdriver.find("Password input field").click();
    await testdriver.type("password123");

    const areCredentialsEntered = await testdriver.assert(
      "The email input contains 'alice@example.com' and the password field has characters entered"
    );
    expect(areCredentialsEntered).toBeTruthy();
  });
});
