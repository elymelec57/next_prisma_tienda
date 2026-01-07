export async function generateMetadata() {
    return {
        title: "Register",
        description: "Register for a new account",
    }
}

export default function RegisterLayout({ children }) {
    return (
        <>{children}</>
    )
}
