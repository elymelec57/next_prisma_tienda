// src/libs/auth.js
export async function authorizeAdmin(request) {
    const jwt = require('jsonwebtoken');
    
    // First, check the Authorization header
    let token = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    
    // Fall back to cookie if no Bearer token is provided
    if (!token) {
        token = request.cookies.get('auth_token')?.value;
    }

    if (!token) {
        return { authorized: false, error: 'Unauthorized', status: 401 };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const auth = decoded.data;
        // Normalize roles to be an array of objects if it's a string
        // if (auth && typeof auth.role === 'string' && !auth.roles) {
        //     auth.roles = [{ name: auth.role }];
        // }
        return { authorized: true, auth };
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return { authorized: false, error: 'Unauthorized', status: 401 };
        }
        throw error;
    }
}
