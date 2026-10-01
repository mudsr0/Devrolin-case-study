/**
 * Role primitives shared by server and client code.
 *
 * This module must stay free of server-only imports (`next/headers`,
 * `jsonwebtoken`, `bcryptjs`) so that `'use client'` components can use it.
 * Server-only session handling lives in `@/lib/auth`, which re-exports
 * everything defined here.
 */

export const ROLES = {
  ADMIN: 'admin',
  SALES: 'sales',
}

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
  },
  [ROLES.SALES]: {
    canView: true,
    canCreate: false,
    canEdit: false,
    canDelete: false,
  },
}

const NO_PERMISSIONS = {
  canView: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
}

/**
 * Paths that only the admin role may reach.
 *
 * Keep in sync with `ADMIN_ONLY_PREFIXES` in `src/proxy.js`, which duplicates
 * this list because Proxy cannot depend on shared modules. If the two drift,
 * a sales user logging in from `?from=/admin/dashboard` gets pushed to a URL
 * the proxy immediately bounces.
 */
export const ADMIN_ONLY_PREFIXES = [
  '/admin/new',
  '/admin/edit',
  '/admin/dashboard',
]

/** Internal areas a logged-in user may be sent back to after signing in. */
export const PORTAL_PREFIXES = ['/admin', '/sales']

/**
 * Normalizes the role claim from a JWT payload.
 *
 * Tokens minted before role support existed carry no `role` claim, and were only
 * ever issued to admins. Treating an absent or unrecognized claim as `admin`
 * keeps those existing sessions working instead of locking them out.
 */
export function normalizeRole(role) {
  return role === ROLES.SALES ? ROLES.SALES : ROLES.ADMIN
}

export function permissionsFor(role) {
  return ROLE_PERMISSIONS[normalizeRole(role)] ?? NO_PERMISSIONS
}

/** Each role's landing page after login. */
export function defaultDashboardPath(role) {
  return normalizeRole(role) === ROLES.SALES
    ? '/sales/dashboard'
    : '/admin/dashboard'
}

export function isAdminOnlyPath(pathname) {
  return ADMIN_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

/**
 * Whether a role is allowed to land on `pathname` directly.
 * Admins can reach everything; sales is limited to the admin-only routes
 * being withheld.
 */
export function canAccessPath(role, pathname) {
  if (normalizeRole(role) === ROLES.ADMIN) {
    return true
  }
  return !isAdminOnlyPath(pathname)
}

/** True for same-origin absolute paths only (rejects `//evil.com` and URLs). */
export function isInternalPath(pathname) {
  return (
    typeof pathname === 'string' &&
    pathname.startsWith('/') &&
    !pathname.startsWith('//')
  )
}

/**
 * Resolves where to send a user after a successful login.
 *
 * A `requested` path (from the `?from=` query param) is honoured only when it
 * is internal and reachable by the role; otherwise the role's own dashboard is
 * used. This keeps `?from=` from turning into an open redirect or from bouncing
 * a sales user onto an admin-only page.
 */
export function resolvePostLoginPath(role, requested) {
  if (isInternalPath(requested) && canAccessPath(role, requested)) {
    return requested
  }
  return defaultDashboardPath(role)
}