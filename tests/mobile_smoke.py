"""Small Playwright smoke test for the iPhone-sized PWA experience."""

import os
import sys

from playwright.sync_api import expect, sync_playwright


BASE_URL = os.environ.get("IDEAFORGE_URL", "http://127.0.0.1:4173")


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        context = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        page = context.new_page()

        page.goto(BASE_URL, wait_until="domcontentloaded")
        expect(page).to_have_title("IdeaForge")
        expect(page.locator('textarea[placeholder="What\'s your idea?"]')).to_be_visible()

        manifest = page.request.get(f"{BASE_URL}/manifest.json")
        assert manifest.ok, f"manifest request failed: {manifest.status}"
        assert "/icon.svg" in manifest.text()

        icon = page.request.get(f"{BASE_URL}/icon.svg")
        assert icon.ok, f"icon request failed: {icon.status}"

        page.fill('textarea[placeholder="What\'s your idea?"]', "Test a mobile idea validation flow")
        page.get_by_role("button", name="Save Draft").click()
        expect(page.get_by_role("status")).to_contain_text("Saved")

        page.get_by_role("link", name="Feed").click()
        expect(page.get_by_role("heading", name="Feed")).to_be_visible()
        expect(page.get_by_text("Test a mobile idea validation flow", exact=False)).to_be_visible()

        page.get_by_text("Test a mobile idea validation flow", exact=False).first.click()
        expect(page.get_by_text("Raw Capture")).to_be_visible()
        page.get_by_role("button", name="Refine with AI").click()
        expect(page.get_by_text("Problem Statement")).to_be_visible(timeout=20_000)
        assert not page.get_by_text("Auto-Generated Awesome App").is_visible()

        service_worker_ready = page.evaluate(
            "navigator.serviceWorker ? navigator.serviceWorker.ready.then(() => true) : false"
        )
        assert service_worker_ready is True

        os.makedirs("test-artifacts", exist_ok=True)
        page.screenshot(path="test-artifacts/mobile-smoke.png", full_page=True)
        context.close()
        browser.close()


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"mobile smoke failed: {error}", file=sys.stderr)
        raise
    print("mobile smoke passed")
