export interface AuthInterface {
    findByEmail(email: string): Promise<any>;
    updateProfile(id: number, data: any): Promise<any>;
}
