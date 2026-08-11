/**
 * Auth fixtures: credentials and test data shared across auth tests.
 * Update TEST_USER to match a real user in your dev database.
 */
export const TEST_USER = {
    name: 'Test E2E User',
    email: 'test_e2e@example.com',
    password: 'Password123!',
};

export const INVALID_CREDENTIALS = {
    email: 'notexists@example.com',
    password: 'wrongpassword123',
};

export const WEAK_PASSWORD = {
    name: 'Weak User',
    email: 'weak@example.com',
    password: '123',
};

export const MISMATCHED_PASSWORDS = {
    name: 'Mismatch User',
    email: 'mismatch@example.com',
    password: 'ValidPass123!',
    confirm_password: 'DifferentPass456!',
};

/** Zod min length for password in loginSchema is 8 */
export const SHORT_PASSWORD = {
    email: 'user@example.com',
    password: 'short',  // < 8 chars
};
