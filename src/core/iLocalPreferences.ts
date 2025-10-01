
export interface ILocalPreferences {
    retrieveData(key: string, type: 'bool' | 'int' | 'double' | 'number' | 'string' | 'stringArray'): Promise<any>;
    storeData(key: string, value: any): Promise<void>;
    removeData(key: string): Promise<void>;
    clearAll(): Promise<void>;
}