// src/libs/auth.js

export const routeRoles = [
  { href: '/panel/admin/plans', roles: ['admin'] },
  { href: '/panel/admin/payments', roles: ['admin'] },
  { href: '/panel/plato', roles: ['user'] },
  { href: '/panel/ingredientes', roles: ['user'] },
  { href: '/panel/contornos', roles: ['user'] },
  { href: '/panel/orders', roles: ['user', 'cocina'] },
  { href: '/panel/pedidos-mesero', roles: ['user', 'mesero'] },
  { href: '/panel/caja', roles: ['user', 'caja'] },
  { href: '/panel/horarios', roles: ['mesero', 'caja', 'cocina'] },
  { href: '/panel/mesas', roles: ['user'] },
  { href: '/panel/clients', roles: ['user'] },
  { href: '/panel/business', roles: ['user'] },
  { href: '/panel/empleados', roles: ['user'] },
  { href: '/panel/profile', roles: ['user'] },
  { href: '/panel', roles: ['user'] },
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
    const auth = decoded.data;
    // Normalize roles to be an array of objects if it's a string
    if (auth && typeof auth.role === 'string' && !auth.roles) {
      auth.roles = [{ name: auth.role }];
    }
    return { authorized: true, auth };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return { authorized: false, error: 'Unauthorized', status: 401 };
    }
    throw error;
  }
}
