/**
 * Shared JWT secret for end-user (小程序) and admin tokens.
 * Both must use the same secret so tokens are mutually distinguishable by payload shape only.
 */
export const JWT_SECRET = process.env.JWT_SECRET || 'bakery_jwt_dev_secret_2026';
