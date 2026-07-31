import { SaveImageInterface } from "@/interfaces/Shared/File/SaveImageInterface";
import { put } from "@vercel/blob";

export class SaveImageVercelService implements SaveImageInterface {
    async saveImage(model: string, file: File): Promise<any> {
        const path = model === 'planPayment' ? `subscriptions/${file.name}` : file.name;

        const blob = await put(path, file, {
            access: 'public',
            addRandomSuffix: true,
        });

        return blob;
    }
}