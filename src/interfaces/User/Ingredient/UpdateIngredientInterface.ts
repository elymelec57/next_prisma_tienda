export interface IUpdateIngredient {
    update(id: number, data: any): Promise<any>;
}