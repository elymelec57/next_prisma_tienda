import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the Login page.
 * Encapsulates all selectors and actions of /login.
 */
export class LoginPage {
    readonly url = '/login';

    constructor(private page: Page) { }

    // ─── Locators ────────────────────────────────────────────────────────────
    get emailInput() { return this.page.locator('#email'); }
    get passwordInput() { return this.page.locator('#password'); }
    get submitButton() { return this.page.getByRole('button', { name: /Log In/i }); }
    get forgotPasswordLink() { return this.page.getByRole('link', { name: /Forgot password/i }); }
    get signUpLink() { return this.page.getByRole('link', { name: /Sign up/i }); }
    get heading() { return this.page.getByRole('heading', { name: /Welcome Back/i }); }

    // ─── Actions ─────────────────────────────────────────────────────────────
    async goto() {
        await this.page.goto(this.url);
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async submit() {
        await this.submitButton.click();
    }

    /**
     * Fills and submits the login form in one step.
     */
    async login(email: string, password: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.submit();
    }

    // ─── Assertions ──────────────────────────────────────────────────────────
    async expectToBeOnLoginPage() {
        await expect(this.page).toHaveURL(/\/login/);
        await expect(this.heading).toBeVisible();
    }

    async expectEmailError(message?: string) {
        const error = this.page.locator('p.text-red-500').first();
        await expect(error).toBeVisible();
        if (message) await expect(error).toContainText(message);
    }

    async expectPasswordError(message?: string) {
        const errors = this.page.locator('p.text-red-500');
        const count = await errors.count();
        let found = false;
        for (let i = 0; i < count; i++) {
            const text = await errors.nth(i).textContent();
            if (!message || text?.includes(message)) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);
    }

    async expectButtonDisabled() {
        await expect(this.submitButton).toBeDisabled();
    }

    async expectButtonEnabled() {
        await expect(this.submitButton).toBeEnabled();
    }
}
