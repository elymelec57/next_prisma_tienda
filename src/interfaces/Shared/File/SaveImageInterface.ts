export interface SaveImageInterface {
    saveImage(model: string, file: File): Promise<any>;
}