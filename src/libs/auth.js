// src/libs/auth.js

export const routeRoles = [
  { href: '/store/plato', roles: ['user'] },
  { href: '/store/ingredientes', roles: ['user'] },
  { href: '/store/contornos', roles: ['user'] },
  { href: '/store/orders', roles: ['user', 'cocina'] },
  { href: '/store/pedidos-mesero', roles: ['user', 'mesero'] },
  { href: '/store/caja', roles: ['user', 'caja'] },
  { href: '/store/horarios', roles: ['mesero', 'caja', 'cocina'] },
  { href: '/store/mesas', roles: ['user'] },
  { href: '/store/clients', roles: ['user'] },
  { href: '/store/business', roles: ['user'] },
  { href: '/store/empleados', roles: ['user'] },
  { href: '/store/profile', roles: ['user'] },
  { href: '/store', roles: ['user'] },
];

export function isAuthorized(userRole, pathname) {
  if (!userRole) return false;
  const role = userRole.toLowerCase();

  // Sort by href length descending to match most specific route first
  const sortedRoutes = [...routeRoles].sort((a, b) => b.href.length - a.href.length);

  for (const item of sortedRoutes) {
    if (pathname.startsWith(item.href)) {
      return item.roles.includes(role);
    }
  }

  return true;
}

export async function authorizeRequest(request, resourceId, resourceType) {
  const jwt = require('jsonwebtoken');
  const token = request.cookies.get('token')?.value

  if (!token) {
    return { authorized: false, error: 'Unauthorized', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    return { authorized: true, auth: decoded.data };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return { authorized: false, error: 'Unauthorized', status: 401 };
    }
    throw error;
  }
}
