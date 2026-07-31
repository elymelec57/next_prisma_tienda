import { IBusinessRepository } from "@/interfaces/User/Business/BusinessInterface";

export class BusinessService {
    private businessRepository: IBusinessRepository;

    constructor(businessRepository: IBusinessRepository) {
        this.businessRepository = businessRepository;
    }

    async getBusiness(userId: number) {
        const rest = await this.businessRepository.getBusinessByUserId(userId);

        if (!rest) {
            return { status: false, message: 'Business not found' };
        }

        if (rest.mainImageId != null) {
            const image = await this.businessRepository.getImageById(rest.mainImageId);
            rest.url = image ? image.url : null;
        } else {
            rest.url = null;
        }

        return { status: true, rest };
    }
}
