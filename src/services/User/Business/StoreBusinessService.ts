import { IStoreBusiness } from "@/interfaces/User/Business/StoreBusinessInterface";
import slugify from "slugify";
import { SaveImageVercelService } from "@/services/Shared/File/SaveImageVercelService";

export class StoreBusinessService {
    private storeBusinessRepository: IStoreBusiness;
    private saveImageService: SaveImageVercelService;

    constructor(storeBusinessRepository: IStoreBusiness, saveImageService: SaveImageVercelService) {
        this.storeBusinessRepository = storeBusinessRepository;
        this.saveImageService = saveImageService;
    }

    async execute(formDataReq: FormData, userId: number, image: any) {

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
            remove: /[*+~.()'"!:@]/g
        });

        try {

            const blob = await this.saveImageService.saveImage('restaurant', image);
            const newImage = await this.storeBusinessRepository.createImage({
                blob: blob,
                id: 'Por_definir',
                model: 'restaurant'
            });

            const businessCreate = await this.storeBusinessRepository.createBusiness(form, slug, userId, String(newImage.id));

            if (businessCreate) {
                await this.storeBusinessRepository.updateImage(newImage.id, String(businessCreate.id));

                return { status: true, message: 'Business created', id: businessCreate.id };
            }

            return { status: false, message: 'Business created error' };
        } catch (error: any) {
            return { status: false, message: error.message || 'Business created error' };
        }
    }
}
