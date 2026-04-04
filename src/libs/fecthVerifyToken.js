export default async function verifytoken(origin,token, pathname) {
    const res = await fetch(`${origin}/api/verifyToken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Important for JSON data
        },
        body: JSON.stringify({ token, pathname }),
    })
    const verify = await res.json()
    return verify;
}
