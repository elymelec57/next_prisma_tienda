export interface IAllContornos {
    findAllByRestaurantId(restaurantId: number): Promise<any>
    findAllByRestaurantIdAndSucursalId(restaurantId: number, sucursalId: number): Promise<any>
    findById(id: number): Promise<any>
}