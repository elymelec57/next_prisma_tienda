import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_USER, INVALID_CREDENTIALS, SHORT_PASSWORD } from '../fixtures/auth.fixtures';

/**
 * NOTA ARQUITECTURAL
 * ------------------
 * El login ahora usa un Server Action (`loginAction` en `src/app/login/actions.ts`).
 * El flujo es: cliente → Server Action → LoginService → LoginRepository → Prisma → redirect().
 *
 * Implicaciones para los tests:
 *  - Los tests de UI/validación Zod NO necesitan servidor (react-hook-form intercepta antes del fetch).
 *  - Los tests de "flujo con mock" YA NO pueden interceptar `/api/user/login` porque el
 *    Server Action se ejecuta en el mismo proceso Next.js, no como una ruta HTTP separada.
 *  - Los happy/unhappy paths del flujo real requieren que el servidor esté activo y la BD disponible.
 */

// ─── Tests de UI (sin servidor) ──────────────────────────────────────────────

test.describe('Login Page — UI y validaciones Zod (sin servidor)', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('debe renderizar el formulario correctamente', async ({ page }) => {
        await loginPage.expectToBeOnLoginPage();
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.submitButton).toBeVisible();
        await expect(loginPage.forgotPasswordLink).toBeVisible();
        await expect(loginPage.signUpLink).toBeVisible();
    });

    test('debe mostrar error de validación con email inválido (Zod)', async ({ page }) => {
        await loginPage.fillEmail('not-an-email');
        await loginPage.fillPassword('ValidPassword1!');
        await loginPage.submit();

        await loginPage.expectEmailError('Formato de email inválido');
    });

    test('debe mostrar error de validación con contraseña corta (menos de 8 chars)', async ({ page }) => {
        await loginPage.fillEmail(SHORT_PASSWORD.email);
        await loginPage.fillPassword(SHORT_PASSWORD.password);
        await loginPage.submit();

        await loginPage.expectPasswordError('al menos 8 caracteres');
    });

    test('debe mostrar error de validación si email está vacío', async ({ page }) => {
        await loginPage.fillPassword('ValidPassword1!');
        await loginPage.submit();

        await loginPage.expectEmailError();
    });

    test('debe mostrar error de validación si contraseña está vacía', async ({ page }) => {
        await loginPage.fillEmail(TEST_USER.email);
        await loginPage.submit();

        await loginPage.expectPasswordError();
    });

    test('el campo de contraseña oculta el texto (type=password)', async () => {
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    test('el link "Sign up" navega a /register', async ({ page }) => {
        await loginPage.signUpLink.click();
        await expect(page).toHaveURL(/\/register/);
    });

    test('el link "Forgot password?" navega a /forgot-password', async ({ page }) => {
        await loginPage.forgotPasswordLink.click();
        await expect(page).toHaveURL(/\/forgot-password/);
    });
});

// ─── Tests de integración real (requieren servidor + BD) ─────────────────────

test.describe('Login Page — Integración real con Server Action (requiere servidor y BD)', () => {
    /**
     * Estos tests se ejecutan contra el Server Action real.
     * Requieren:
     *   1. `npm run dev` corriendo en localhost:3000
     *   2. El usuario TEST_USER existente en la BD
     *   3. Variable de entorno: RUN_INTEGRATION_TESTS=true
     *
     * Para correr:
     *   RUN_INTEGRATION_TESTS=true npx playwright test --grep "Integración real"
     */
    test.skip(
        !process.env.RUN_INTEGRATION_TESTS,
        'Solo se ejecuta cuando RUN_INTEGRATION_TESTS=true'
    );

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('[REAL] login exitoso — rol User — el servidor redirige a /panel', async ({ page }) => {
        // El Server Action hace redirect() server-side; el browser simplemente termina en /panel
        await loginPage.login(TEST_USER.email, TEST_USER.password);
        await expect(page).toHaveURL(/\/panel/, { timeout: 10000 });
    });

    test('[REAL] credenciales incorrectas — el Server Action devuelve error y se muestra inline', async ({ page }) => {
        await loginPage.login(INVALID_CREDENTIALS.email, INVALID_CREDENTIALS.password);

        // Con el Server Action, el error se muestra en el DOM (no en un alert())
        const errorMsg = page.locator('p.text-red-500', { hasText: /Credenciales inválidas|inválida/i });
        await expect(errorMsg).toBeVisible({ timeout: 6000 });

        // El usuario permanece en /login
        await expect(page).toHaveURL(/\/login/);
    });

    test('[REAL] el botón muestra estado de carga (isPending) durante el submit', async ({ page }) => {
        // Submittir el formulario y verificar inmediatamente que el botón esté deshabilitado
        await loginPage.fillEmail(TEST_USER.email);
        await loginPage.fillPassword(TEST_USER.password);

        await Promise.all([
            loginPage.submit(),
            loginPage.expectButtonDisabled(),
        ]);
    });

    test('[REAL] login con rol Mesero redirige a /panel/pedidos-mesero', async ({ page }) => {
        // Requiere un empleado con rol Mesero en la BD
        const MESERO = { email: process.env.TEST_MESERO_EMAIL ?? '', password: process.env.TEST_MESERO_PASS ?? '' };
        test.skip(!MESERO.email, 'TEST_MESERO_EMAIL no definido');

        await loginPage.login(MESERO.email, MESERO.password);
        await expect(page).toHaveURL(/\/panel\/pedidos-mesero/, { timeout: 10000 });
    });

    test('[REAL] login con rol Caja redirige a /panel/caja', async ({ page }) => {
        const CAJA = { email: process.env.TEST_CAJA_EMAIL ?? '', password: process.env.TEST_CAJA_PASS ?? '' };
        test.skip(!CAJA.email, 'TEST_CAJA_EMAIL no definido');

        await loginPage.login(CAJA.email, CAJA.password);
        await expect(page).toHaveURL(/\/panel\/caja/, { timeout: 10000 });
    });

    test('[REAL] login con rol Cocina redirige a /panel/orders', async ({ page }) => {
        const COCINA = { email: process.env.TEST_COCINA_EMAIL ?? '', password: process.env.TEST_COCINA_PASS ?? '' };
        test.skip(!COCINA.email, 'TEST_COCINA_EMAIL no definido');

        await loginPage.login(COCINA.email, COCINA.password);
        await expect(page).toHaveURL(/\/panel\/orders/, { timeout: 10000 });
    });
});
