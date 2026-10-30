import { expect, test } from "@playwright/test";

test("menu traps focus, locks scroll, closes with Escape and restores focus", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Explore SECTION 88" });
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBeTruthy();
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  await trigger.click();
  await page.mouse.click(1200, 300);
  await expect(dialog).not.toBeVisible();
  await trigger.click();
  await dialog.getByRole("link", { name: /Lookbook/ }).click();
  await expect(page).toHaveURL(/\/lookbook$/);
});

test("search suggestions, no results, clear and search-results navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open search", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Search", exact: true });
  const input = dialog.getByRole("textbox", { name: "Search the collection" });
  await input.fill("signal");
  await expect(dialog.getByText("1 suggestions", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Signal Study/ })).toBeVisible();
  await input.fill("not-a-style");
  await expect(dialog.getByText("No matches yet.")).toBeVisible();
  await dialog.getByRole("button", { name: "Clear search", exact: true }).first().click();
  await expect(input).toHaveValue("");
  await input.fill("signal");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/search\?q=signal/);
  await expect(page.locator(".product-card")).toHaveCount(1);
});

test("catalogue filters and sorting update the URL and survive refresh", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.locator(".product-card")).toHaveCount(10);
  await page.getByRole("button", { name: "Boxy", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(3);
  await expect(page).toHaveURL(/fit=Boxy/);
  await page.getByLabel("Size", { exact: true }).filter({ visible: true }).selectOption("M");
  await page.getByLabel("Sort by", { exact: true }).filter({ visible: true }).selectOption("price-desc");
  await expect(page).toHaveURL(/sort=price-desc/);
  await page.reload();
  await expect(page.locator(".product-card")).toHaveCount(3);
  await page.getByRole("textbox", { name: "Search product titles" }).fill("no-matching-title");
  await expect(page.getByText("No objects in this view.")).toBeVisible();
  await page.getByRole("button", { name: /Clear all filters/ }).click();
  await expect(page.locator(".product-card")).toHaveCount(10);
  await expect(page).toHaveURL(/\/shop$/);
});

test("product selection, cart arithmetic, persistence and removal", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/products/signal-study");
  const add = page.getByRole("button", { name: "Add to bag", exact: true });
  await expect(add).toBeEnabled();
  await add.click();
  await expect(page.locator(".product-information").getByRole("alert")).toContainText("Choose an available size");
  await expect(page.getByRole("button", { name: "Size XS unavailable", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Color Paper", exact: true }).click();
  await expect(page.getByRole("button", { name: "Size XXL unavailable", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Size M", exact: true }).click();
  await page.getByRole("button", { name: "Increase quantity", exact: true }).click();
  await add.click();
  const bag = page.getByRole("dialog", { name: /Your bag/ });
  await expect(bag).toBeVisible();
  await expect(bag.getByText("Paper / M / Oversized", { exact: true })).toBeVisible();
  await expect(bag.getByTestId("subtotal")).toHaveText("₹5,000");
  await bag.getByRole("button", { name: "Increase Signal Study quantity", exact: true }).click();
  await expect(bag.getByTestId("subtotal")).toHaveText("₹7,500");
  await bag.getByRole("link", { name: /View shopping bag/ }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await page.reload();
  await expect(page.locator("main").getByTestId("subtotal")).toHaveText("₹7,500");
  await expect(page.getByRole("button", { name: "Open bag, 3 items" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Checkout unavailable" })).toBeDisabled();
  await page.getByRole("button", { name: "Decrease Signal Study quantity", exact: true }).click();
  await expect(page.locator("main").getByTestId("subtotal")).toHaveText("₹5,000");
  await page.getByRole("button", { name: "Remove Signal Study", exact: true }).click();
  await expect(page.locator("main").getByText("Your story starts here.")).toBeVisible();
  expect(errors).toEqual([]);
});

test("gallery, zoom, size guide and accordions are keyboard operable", async ({ page }) => {
  await page.goto("/products/signal-study");
  await page.getByRole("button", { name: "Next image", exact: true }).click();
  await expect(page.locator(".gallery-main")).toContainText("02 / 04");
  await page.getByRole("button", { name: /Zoom Object 01 \/ Back/ }).click();
  const zoom = page.getByRole("dialog", { name: /Signal Study \/ image 2/ });
  await expect(zoom).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(zoom).not.toBeVisible();
  const guideTrigger = page.getByRole("button", { name: "Size guide", exact: true });
  await guideTrigger.click();
  const guide = page.getByRole("dialog", { name: "Size guide", exact: true });
  await expect(guide.getByRole("table")).toBeVisible();
  await expect(guide.getByText("Pending", { exact: true }).first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(guide).not.toBeVisible();
  await expect(guideTrigger).toBeFocused();
  const accordion = page.getByRole("button", { name: "Fabric & care", exact: true });
  await accordion.focus();
  await page.keyboard.press("Enter");
  await expect(accordion).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText(/Fabric composition, weight/)).toBeVisible();
  await page.keyboard.press("Space");
  await expect(accordion).toHaveAttribute("aria-expanded", "false");
});

test("newsletter transparently validates and demonstrates signup; ticker can pause", async ({ page }) => {
  await page.goto("/");
  const email = page.getByRole("textbox", { name: "Email address", exact: true });
  await email.fill("invalid");
  await page.getByRole("button", { name: "Preview newsletter signup" }).click();
  await expect(page.locator(".newsletter").getByRole("alert")).toContainText("Enter a valid email");
  await email.fill("demo@example.com");
  await page.getByRole("button", { name: "Preview newsletter signup" }).click();
  await expect(page.getByText("Previewing signup…", { exact: true })).toBeVisible();
  await expect(page.getByText(/Demo complete. Your email was not saved/)).toBeVisible();
  await page.getByRole("button", { name: "Pause brand ticker" }).click();
  await expect(page.locator(".ticker-track")).toHaveCSS("animation-play-state", "paused");
  await page.getByRole("button", { name: "Dismiss announcement" }).click();
  await page.reload();
  await expect(page.locator(".announcement")).toHaveCount(0);
});

test("mobile filters apply, clear and product gallery supports touch", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/shop");
  await page.getByRole("button", { name: "Filter & sort", exact: true }).tap();
  const sheet = page.getByRole("dialog", { name: "Filter & sort", exact: true });
  await sheet.getByLabel("Fit", { exact: true }).selectOption("Regular");
  await sheet.getByLabel("Size", { exact: true }).selectOption("L");
  await sheet.getByLabel("Sort by", { exact: true }).selectOption("name-asc");
  await sheet.getByRole("button", { name: "Show 3 objects" }).tap();
  await expect(sheet).not.toBeVisible();
  await expect(page.locator(".product-card")).toHaveCount(3);
  await expect(page).toHaveURL(/fit=Regular/);
  await page.getByRole("button", { name: "Filter & sort", exact: true }).tap();
  await sheet.getByRole("button", { name: "Clear all", exact: true }).tap();
  await sheet.getByRole("button", { name: "Show 10 objects" }).tap();
  await expect(page.locator(".product-card")).toHaveCount(10);
  await page.goto("/products/signal-study");
  await page.locator(".gallery-main").evaluate((element) => {
    for (const [name, property, x] of [["touchstart", "touches", 280], ["touchend", "changedTouches", 50]] as const) {
      const event = new Event(name, { bubbles: true });
      Object.defineProperty(event, property, { value: [{ clientX: x, clientY: 240 }] });
      element.dispatchEvent(event);
    }
  });
  await expect(page.locator(".gallery-main")).toContainText("02 / 04");
  await page.getByRole("button", { name: "Size M", exact: true }).tap();
  await page.getByRole("button", { name: "Add to bag", exact: true }).tap();
  await expect(page.getByRole("dialog", { name: /Your bag/ })).toBeVisible();
  await context.close();
});

test("reduced motion leaves content visible and stops the ticker", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".ticker-track")).toHaveCSS("animation-name", "none");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: /Our story/, exact: true }).first().click();
  await expect(page).toHaveURL(/\/our-story$/);
});

test("contact preview accepts valid input without sending a message", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name", { exact: true }).fill("Demo visitor");
  await page.getByLabel("Email", { exact: true }).fill("demo@example.com");
  await page.getByLabel("Message", { exact: true }).fill("A local form preview.");
  await page.getByRole("button", { name: "Preview message form" }).click();
  await expect(page.getByText(/Preview complete. Your message was not sent or saved/)).toBeVisible();
});
