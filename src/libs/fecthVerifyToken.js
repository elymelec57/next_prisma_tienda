export default async function verifytoken(token) {
    const res = await fetch('http://localhost:3000/api/verifyToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Important for JSON data
        },
        body: JSON.stringify({ token }),
    })
    const verify = await res.json()
    return verify;
}