import AsyncStorage from "@react-native-async-storage/async-storage";
import { ILocalPreferences } from "./iLocalPreferences";

export class LocalPreferencesAsyncStorage implements ILocalPreferences {

    async retrieveData(key: string, type: 'bool' | 'int' | 'double' | 'number' | 'string' | 'stringArray'): Promise<any> {
        try {
            const storedValue = await AsyncStorage.getItem(key);
            if (storedValue === null) {
                // No value found for the key.
                return null;
            }

            // Parse the value based on the expected type.
            if (type === "bool") {
                return JSON.parse(storedValue);
            } else if (type === "int" || type === "double" || type === "number") {
                return JSON.parse(storedValue);
            } else if (type === "string") {
                return storedValue;
            } else if (type === "stringArray") {
                return JSON.parse(storedValue);
            } else {
                throw new Error("Unsupported type");
            }
        } catch (error) {
            console.error(`Error retrieving data for key "${key}":`, error);
            return null;
        }
    }


    async storeData(key: string, value: any): Promise<void> {
        try {
            let valueToStore: string;

            // Determine how to store based on the value's type.
            if (
                typeof value === "boolean" ||
                typeof value === "number" ||
                Array.isArray(value)
            ) {
                // For booleans, numbers, and arrays, store as JSON.
                console.log("Value to store:", value, "Type:", typeof value);
                valueToStore = JSON.stringify(value);
            } else if (typeof value === "string") {
                // Strings can be stored directly.
                console.log("String value to store:", value);
                valueToStore = value;
            } else {
                throw new Error("Unsupported type");
            }

            await AsyncStorage.setItem(key, valueToStore);
            console.info(`LocalPreferences: Stored key "${key}" with value:`, value);
        } catch (error) {
            console.error(
                `Failed to store key "${key}" with value "${value}":`,
                error
            );
        }
    }

    async removeData(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error("Error removing data:", error);
        }
    }

    async clearAll(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error("Error clearing all data:", error);
        }
    }

}
