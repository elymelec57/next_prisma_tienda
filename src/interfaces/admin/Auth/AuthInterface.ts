export interface IAuth {
    findByEmail(email: string): Promise<any>
    findById(id: number): Promise<any>
    updateProfile(id: number, data: any): Promise<any>
}
