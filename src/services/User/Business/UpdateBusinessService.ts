import { IUpdateBusiness } from "@/interfaces/User/Business/UpdateBusinessInterface";
import { SaveImageVercelService } from "@/services/Shared/File/SaveImageVercelService";
import slugify from "slugify";
import deleteImage from "@/libs/deleteImage";

export class UpdateBusinessService {
    private businessRepository: IUpdateBusiness;
    private saveImageService: SaveImageVercelService;

    constructor(businessRepository: IUpdateBusiness, saveImageService: SaveImageVercelService) {
        this.businessRepository = businessRepository;
        this.saveImageService = saveImageService;
    }

    async execute(userId: number, formDataReq: FormData, imageFile: File, mainImageId: number) {
        const formStr = formDataReq.get('form') as string;
        let form: any = {};
        if (formStr) {
            form = JSON.parse(formStr);
            if (form.form) {
                form = form.form;
            }
        }

        const slug = slugify(form.name || '', {
            lower: true,
            strict: true,
            remove: /[*+~.()"'!:@]/g
        });

        try {
            const businessupdate = await this.businessRepository.updateBusiness(userId, form, slug);

            if (!businessupdate) {
                return { status: false, message: 'Business updated error' };
            }

            if (imageFile) {
                const blob = await this.saveImageService.saveImage('restaurant', imageFile);
                const newImage = await this.businessRepository.createImage({
                    blob: blob,
                    id: businessupdate.id,
                    model: 'restaurant'
                });
                await this.businessRepository.updateBusinessImage(businessupdate.id, newImage.id);
                if (mainImageId) {
                    const imageLast = await this.businessRepository.deleteImage(String(mainImageId));
                    await deleteImage(imageLast.url)
                }
                businessupdate.mainImageId = newImage.id;
            }

            return { status: true, message: 'Business updated', id: businessupdate.id, mainImage: businessupdate.mainImageId };
        } catch (error: any) {
            return { status: false, message: error.message || 'Business updated error' };
        }
    }
}