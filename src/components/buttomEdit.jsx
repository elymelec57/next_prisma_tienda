'use client'
import { useRouter } from "next/navigation"

export default function buttomEdit({path, id}) {
    const router = useRouter()
    return (
        <button type="button" onClick={() => {
            router.push(path + id)
        }} className="bg-blue-500 text-white p-2 rounded-md">Edit</button>
    )
}
