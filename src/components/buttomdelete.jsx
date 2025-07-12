'use client'
import { useRouter } from "next/navigation"

export default function buttomDelete({path, id}) {
    const router = useRouter()

    const deleteUser = async ()=> {
        const query = await fetch(path + id,{
            method: 'DELETE',
        });
        const res = await query.json()
        if(res.status){
            router.refresh()
        }else{
            alert(res.message)
        }
    }

    return (
        <button type="button" onClick={deleteUser} className="bg-red-500 text-white p-2 rounded-md">Delete</button>
    )
}
