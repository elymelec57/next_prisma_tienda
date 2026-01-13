// src/libs/auth.js
import jwt from 'jsonwebtoken';

export async function authorizeRequest(request, resourceId, resourceType) {
  
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
