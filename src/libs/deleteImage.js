import { del } from '@vercel/blob';
export default async function deleteImage(url) {
    try {
        await del(url);
        return {status:true, code:200, message: "delete"}
    } catch (error) {
        return {status:false, code:500, message: error}   
    }
}