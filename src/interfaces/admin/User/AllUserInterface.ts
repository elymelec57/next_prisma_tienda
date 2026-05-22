export interface IAllUserInterface {
    allUsers(): Promise<any[]>;
    roleUsers(): Promise<any[]>;
}