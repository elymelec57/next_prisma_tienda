import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the Register page.
 * Encapsulates all selectors and actions of /register.
 */
export class RegisterPage {
    readonly url = '/register';

    constructor(private page: Page) { }

    // ─── Locators ────────────────────────────────────────────────────────────
    get nameInput() { return this.page.locator('#name'); }
    get emailInput() { return this.page.locator('#email'); }
    get passwordInput() { return this.page.locator('#password'); }
    get confirmPasswordInput() { return this.page.locator('#confirm_password'); }
    get submitButton() { return this.page.getByRole('button', { name: /Create Account/i }); }
    get loginLink() { return this.page.getByRole('link', { name: /Login/i }); }
    get heading() { return this.page.getByRole('heading', { name: /Create an Account/i }); }

    // ─── Actions ─────────────────────────────────────────────────────────────
    async goto() {
        await this.page.goto(this.url);
    }

    async fillName(name: string) {
        await this.nameInput.fill(name);
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async fillConfirmPassword(password: string) {
        await this.confirmPasswordInput.fill(password);
    }

    async submit() {
        await this.submitButton.click();
    }

    /**
     * Fills and submits the full registration form in one step.
     */
    async register(name: string, email: string, password: string, confirmPassword?: string) {
        await this.fillName(name);
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.fillConfirmPassword(confirmPassword ?? password);
        await this.submit();
    }

    // ─── Assertions ──────────────────────────────────────────────────────────
    async expectToBeOnRegisterPage() {
        await expect(this.page).toHaveURL(/\/register/);
        await expect(this.heading).toBeVisible();
    }

    async expectFieldError(message: string) {
        const error = this.page.locator('p.text-red-500', { hasText: message });
        await expect(error.first()).toBeVisible();
    }

    async expectAnyError() {
        await expect(this.page.locator('p.text-red-500').first()).toBeVisible();
    }

    async expectButtonDisabled() {
        await expect(this.submitButton).toBeDisabled();
    }

    async expectButtonEnabled() {
        await expect(this.submitButton).toBeEnabled();
    }
}
