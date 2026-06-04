import bcrypt from 'bcryptjs';

export class UpdateProfileService {
    constructor(profileRepository, updateProfileRepository) {
        this.profileRepository = profileRepository;
        this.updateProfileRepository = updateProfileRepository;
    }

    async execute(form) {
        const profile = await this.profileRepository.findById(form.id);

        if (!profile) {
            return { status: false, message: 'User not found' };
        }

        let updateData = {
            name: form.name,
            email: form.email
        };

        if (form.password && form.confirm_password) {
            const match = bcrypt.compareSync(form.password, profile.password);

            if (!match) {
                return { status: false, message: 'the password current is incorrect' };
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(form.confirm_password, salt);
            updateData.password = hash;
        }

        const updatedUser = await this.updateProfileRepository.update(profile.id, updateData);

        return { status: true, update: updatedUser };
    }
}
