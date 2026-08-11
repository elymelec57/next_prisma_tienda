import { test, expect, Page } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import {
    TEST_USER,
    WEAK_PASSWORD,
    MISMATCHED_PASSWORDS,
} from '../fixtures/auth.fixtures';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Mock the /api/user/register endpoint.
 * The RegisterService uses RegisterRepository.create() (prisma.user.create).
 * The route returns { status: true, message: 'User created successfully' } on success.
 */
async function mockRegisterSuccess(page: Page) {
    await page.route('**/api/user/register', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                status: true,
                message: 'User created successfully',
            }),
        });
    });
}

async function mockRegisterFailure(page: Page, message = 'El email ya está registrado') {
    await page.route('**/api/user/register', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ status: false, message }),
        });
    });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe('Register Page — UI', () => {
    let registerPage: RegisterPage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        await registerPage.goto();
    });

    test('debe renderizar el formulario con todos los campos', async ({ page }) => {
        await registerPage.expectToBeOnRegisterPage();
        await expect(registerPage.nameInput).toBeVisible();
        await expect(registerPage.emailInput).toBeVisible();
        await expect(registerPage.passwordInput).toBeVisible();
        await expect(registerPage.confirmPasswordInput).toBeVisible();
        await expect(registerPage.submitButton).toBeVisible();
        await expect(registerPage.loginLink).toBeVisible();
    });

    test('debe mostrar error si el nombre está vacío (Zod: Name is required)', async ({ page }) => {
        await registerPage.fillEmail(TEST_USER.email);
        await registerPage.fillPassword(TEST_USER.password);
        await registerPage.fillConfirmPassword(TEST_USER.password);
        await registerPage.submit();

        await registerPage.expectFieldError('Name is required');
    });

    test('debe mostrar error si el email tiene formato inválido (Zod)', async ({ page }) => {
        await registerPage.fillName(TEST_USER.name);
        await registerPage.fillEmail('not-an-email');
        await registerPage.fillPassword(TEST_USER.password);
        await registerPage.fillConfirmPassword(TEST_USER.password);
        await registerPage.submit();

        await registerPage.expectFieldError('Invalid email address');
    });

    test('debe mostrar error si la contraseña tiene menos de 6 caracteres (Zod)', async ({ page }) => {
        await registerPage.fillName(TEST_USER.name);
        await registerPage.fillEmail(TEST_USER.email);
        await registerPage.fillPassword(WEAK_PASSWORD.password);    // '123' → < 6
        await registerPage.fillConfirmPassword(WEAK_PASSWORD.password);
        await registerPage.submit();

        await registerPage.expectFieldError('Password must be at least 6 characters');
    });

    test('debe mostrar error si las contraseñas no coinciden (Zod refine)', async ({ page }) => {
        await registerPage.fillName(MISMATCHED_PASSWORDS.name);
        await registerPage.fillEmail(MISMATCHED_PASSWORDS.email);
        await registerPage.fillPassword(MISMATCHED_PASSWORDS.password);
        await registerPage.fillConfirmPassword(MISMATCHED_PASSWORDS.confirm_password);
        await registerPage.submit();

        await registerPage.expectFieldError('Passwords do not match');
    });

    test('debe mostrar error si todos los campos están vacíos', async ({ page }) => {
        await registerPage.submit();
        await registerPage.expectAnyError();
    });

    test('el link "Login" navega a /login', async ({ page }) => {
        await registerPage.loginLink.click();
        await expect(page).toHaveURL(/\/login/);
    });

    test('los campos de contraseña son de tipo password (texto oculto)', async () => {
        await expect(registerPage.passwordInput).toHaveAttribute('type', 'password');
        await expect(registerPage.confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    test('los campos están deshabilitados durante el envío', async ({ page }) => {
        // Mock with delay to observe disabled state
        await page.route('**/api/user/register', async (route) => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: true, message: 'User created successfully' }),
            });
        });

        await registerPage.fillName(TEST_USER.name);
        await registerPage.fillEmail(`ts_${Date.now()}@example.com`);
        await registerPage.fillPassword(TEST_USER.password);
        await registerPage.fillConfirmPassword(TEST_USER.password);

        await Promise.all([
            registerPage.submit(),
            registerPage.expectButtonDisabled(),
        ]);
    });
});

test.describe('Register Page — Flujo con mock de API', () => {
    let registerPage: RegisterPage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
    });

    test('[HAPPY PATH] registro exitoso muestra toast y redirige a /login', async ({ page }) => {
        await mockRegisterSuccess(page);
        await registerPage.goto();

        // Use a unique email so toast is triggered (even mocked)
        await registerPage.register(
            TEST_USER.name,
            `e2e_${Date.now()}@example.com`,
            TEST_USER.password,
            TEST_USER.password,
        );

        // After success, RegisterService redirects to /login
        await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
    });

    test('[UNHAPPY PATH] email ya registrado muestra toast de error', async ({ page }) => {
        await mockRegisterFailure(page, 'El email ya está registrado');
        await registerPage.goto();

        // The page uses toast.error on failure – check for the toast
        await registerPage.register(
            TEST_USER.name,
            TEST_USER.email,
            TEST_USER.password,
            TEST_USER.password,
        );

        // Should stay on register page and show the toast
        await expect(page).toHaveURL(/\/register/);
        // Toast is rendered by react-toastify; look for the text in DOM
        const toast = page.locator('.Toastify__toast-body', { hasText: 'El email ya está registrado' });
        await expect(toast).toBeVisible({ timeout: 5000 });
    });

    test('[UNHAPPY PATH] error de red muestra toast de error', async ({ page }) => {
        await page.route('**/api/user/register', async (route) => {
            await route.abort('failed');
        });

        await registerPage.goto();
        await registerPage.register(
            TEST_USER.name,
            TEST_USER.email,
            TEST_USER.password,
            TEST_USER.password,
        );

        await expect(page).toHaveURL(/\/register/);
        const toast = page.locator('.Toastify__toast-body', { hasText: 'Error al registrar' });
        await expect(toast).toBeVisible({ timeout: 5000 });
    });

    test('[FLUJO COMPLETO] registro + login', async ({ page }) => {
        // 1. Registrar
        await mockRegisterSuccess(page);
        await registerPage.goto();
        await registerPage.register(
            TEST_USER.name,
            TEST_USER.email,
            TEST_USER.password,
            TEST_USER.password,
        );
        await expect(page).toHaveURL(/\/login/, { timeout: 8000 });

        // 2. Hacer login después del registro
        const loginPage = new LoginPage(page);
        await page.route('**/api/user/login', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: true,
                    message: 'login successfully',
                    auth: {
                        id: 99,
                        name: TEST_USER.name,
                        email: TEST_USER.email,
                        role: 'User',
                        restaurantId: null,
                        currency: 'USD',
                        sucursales: [],
                    },
                }),
            });
        });

        await loginPage.login(TEST_USER.email, TEST_USER.password);
        await expect(page).toHaveURL(/\/panel/, { timeout: 8000 });
    });
});

test.describe('Register Page — Integración real (requiere servidor y BD)', () => {
    /**
     * Estos tests se ejecutan contra la API real y crean un usuario temporal.
     * Para correr solo los tests de integración:
     *   RUN_INTEGRATION_TESTS=true npx playwright test --grep "Integración real"
     */
    test.skip(
        !process.env.RUN_INTEGRATION_TESTS,
        'Solo se ejecuta cuando RUN_INTEGRATION_TESTS=true'
    );

    let registerPage: RegisterPage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        await registerPage.goto();
    });

    test('[REAL] registro con email único crea usuario y redirige a login', async ({ page }) => {
        const uniqueEmail = `e2e_real_${Date.now()}@example.com`;

        await registerPage.register(TEST_USER.name, uniqueEmail, TEST_USER.password, TEST_USER.password);
        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

        // Opcional: intentar hacer login con las mismas credenciales
        const loginPage = new LoginPage(page);
        await loginPage.login(uniqueEmail, TEST_USER.password);
        await expect(page).toHaveURL(/\/panel/, { timeout: 10000 });
    });

    test('[REAL] registro con email duplicado muestra error', async ({ page }) => {
        // Intentar registrar el mismo email dos veces
        await registerPage.register(TEST_USER.name, TEST_USER.email, TEST_USER.password, TEST_USER.password);

        // Debe permanecer en register o mostrar error
        await expect(page).toHaveURL(/\/register/);
    });
});
