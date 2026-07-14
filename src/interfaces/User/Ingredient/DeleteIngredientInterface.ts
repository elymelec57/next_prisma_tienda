export interface IDeleteIngredient {
    delete(id: number): Promise<any>;
}