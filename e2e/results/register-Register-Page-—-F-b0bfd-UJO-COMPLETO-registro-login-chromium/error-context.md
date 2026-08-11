# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.ts >> Register Page — Flujo con mock de API >> [FLUJO COMPLETO] registro + login
- Location: e2e/tests/register.spec.ts:197:9

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/panel/
Received string:  "http://localhost:3000/login"
Timeout: 8000ms

Call log:
  - Expect "toHaveURL" with timeout 8000ms
    19 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://localhost:3000/login"

```

```yaml
- alert: Login
- heading "Welcome Back" [level=1]
- paragraph: Enter your credentials to access your account
- text: Email
- textbox "Email":
  - /placeholder: name@example.com
  - text: test_e2e@example.com
- text: Password
- link "Forgot password?":
  - /url: /forgot-password
- textbox "Password": Password123!
- paragraph: Credenciales inválidas
- button "Log In"
- text: Or continue with Don't have an account?
- link "Sign up":
  - /url: /register
- img "Fine dining table setting"
- region "Notifications Alt+T"
- button "Open Tanstack query devtools":
  - img
```

# Test source

```ts
  132 |             registerPage.expectButtonDisabled(),
  133 |         ]);
  134 |     });
  135 | });
  136 | 
  137 | test.describe('Register Page — Flujo con mock de API', () => {
  138 |     let registerPage: RegisterPage;
  139 | 
  140 |     test.beforeEach(async ({ page }) => {
  141 |         registerPage = new RegisterPage(page);
  142 |     });
  143 | 
  144 |     test('[HAPPY PATH] registro exitoso muestra toast y redirige a /login', async ({ page }) => {
  145 |         await mockRegisterSuccess(page);
  146 |         await registerPage.goto();
  147 | 
  148 |         // Use a unique email so toast is triggered (even mocked)
  149 |         await registerPage.register(
  150 |             TEST_USER.name,
  151 |             `e2e_${Date.now()}@example.com`,
  152 |             TEST_USER.password,
  153 |             TEST_USER.password,
  154 |         );
  155 | 
  156 |         // After success, RegisterService redirects to /login
  157 |         await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  158 |     });
  159 | 
  160 |     test('[UNHAPPY PATH] email ya registrado muestra toast de error', async ({ page }) => {
  161 |         await mockRegisterFailure(page, 'El email ya está registrado');
  162 |         await registerPage.goto();
  163 | 
  164 |         // The page uses toast.error on failure – check for the toast
  165 |         await registerPage.register(
  166 |             TEST_USER.name,
  167 |             TEST_USER.email,
  168 |             TEST_USER.password,
  169 |             TEST_USER.password,
  170 |         );
  171 | 
  172 |         // Should stay on register page and show the toast
  173 |         await expect(page).toHaveURL(/\/register/);
  174 |         // Toast is rendered by react-toastify; look for the text in DOM
  175 |         const toast = page.locator('.Toastify__toast-body', { hasText: 'El email ya está registrado' });
  176 |         await expect(toast).toBeVisible({ timeout: 5000 });
  177 |     });
  178 | 
  179 |     test('[UNHAPPY PATH] error de red muestra toast de error', async ({ page }) => {
  180 |         await page.route('**/api/user/register', async (route) => {
  181 |             await route.abort('failed');
  182 |         });
  183 | 
  184 |         await registerPage.goto();
  185 |         await registerPage.register(
  186 |             TEST_USER.name,
  187 |             TEST_USER.email,
  188 |             TEST_USER.password,
  189 |             TEST_USER.password,
  190 |         );
  191 | 
  192 |         await expect(page).toHaveURL(/\/register/);
  193 |         const toast = page.locator('.Toastify__toast-body', { hasText: 'Error al registrar' });
  194 |         await expect(toast).toBeVisible({ timeout: 5000 });
  195 |     });
  196 | 
  197 |     test('[FLUJO COMPLETO] registro + login', async ({ page }) => {
  198 |         // 1. Registrar
  199 |         await mockRegisterSuccess(page);
  200 |         await registerPage.goto();
  201 |         await registerPage.register(
  202 |             TEST_USER.name,
  203 |             TEST_USER.email,
  204 |             TEST_USER.password,
  205 |             TEST_USER.password,
  206 |         );
  207 |         await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  208 | 
  209 |         // 2. Hacer login después del registro
  210 |         const loginPage = new LoginPage(page);
  211 |         await page.route('**/api/user/login', async (route) => {
  212 |             await route.fulfill({
  213 |                 status: 200,
  214 |                 contentType: 'application/json',
  215 |                 body: JSON.stringify({
  216 |                     status: true,
  217 |                     message: 'login successfully',
  218 |                     auth: {
  219 |                         id: 99,
  220 |                         name: TEST_USER.name,
  221 |                         email: TEST_USER.email,
  222 |                         role: 'User',
  223 |                         restaurantId: null,
  224 |                         currency: 'USD',
  225 |                         sucursales: [],
  226 |                     },
  227 |                 }),
  228 |             });
  229 |         });
  230 | 
  231 |         await loginPage.login(TEST_USER.email, TEST_USER.password);
> 232 |         await expect(page).toHaveURL(/\/panel/, { timeout: 8000 });
      |                            ^ Error: expect(page).toHaveURL(expected) failed
  233 |     });
  234 | });
  235 | 
  236 | test.describe('Register Page — Integración real (requiere servidor y BD)', () => {
  237 |     /**
  238 |      * Estos tests se ejecutan contra la API real y crean un usuario temporal.
  239 |      * Para correr solo los tests de integración:
  240 |      *   RUN_INTEGRATION_TESTS=true npx playwright test --grep "Integración real"
  241 |      */
  242 |     test.skip(
  243 |         !process.env.RUN_INTEGRATION_TESTS,
  244 |         'Solo se ejecuta cuando RUN_INTEGRATION_TESTS=true'
  245 |     );
  246 | 
  247 |     let registerPage: RegisterPage;
  248 | 
  249 |     test.beforeEach(async ({ page }) => {
  250 |         registerPage = new RegisterPage(page);
  251 |         await registerPage.goto();
  252 |     });
  253 | 
  254 |     test('[REAL] registro con email único crea usuario y redirige a login', async ({ page }) => {
  255 |         const uniqueEmail = `e2e_real_${Date.now()}@example.com`;
  256 | 
  257 |         await registerPage.register(TEST_USER.name, uniqueEmail, TEST_USER.password, TEST_USER.password);
  258 |         await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  259 | 
  260 |         // Opcional: intentar hacer login con las mismas credenciales
  261 |         const loginPage = new LoginPage(page);
  262 |         await loginPage.login(uniqueEmail, TEST_USER.password);
  263 |         await expect(page).toHaveURL(/\/panel/, { timeout: 10000 });
  264 |     });
  265 | 
  266 |     test('[REAL] registro con email duplicado muestra error', async ({ page }) => {
  267 |         // Intentar registrar el mismo email dos veces
  268 |         await registerPage.register(TEST_USER.name, TEST_USER.email, TEST_USER.password, TEST_USER.password);
  269 | 
  270 |         // Debe permanecer en register o mostrar error
  271 |         await expect(page).toHaveURL(/\/register/);
  272 |     });
  273 | });
  274 | 
```