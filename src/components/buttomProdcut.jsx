'use client'
import { useRouter } from "next/navigation"

export default function buttomProdcut({id}) {
    const router = useRouter()
    return (
        <button type="button" onClick={() => {
            router.push(`/dashboard/user/${id}/product`)
        }} className="bg-green-500 text-white p-2 rounded-md">Products</button>
    )
}