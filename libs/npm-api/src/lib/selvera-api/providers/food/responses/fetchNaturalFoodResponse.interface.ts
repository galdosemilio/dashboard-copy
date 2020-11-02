import { GenericFoodResponse } from './fetchGenericFoodResponse.interface';

export interface NaturalFoodResponse {
    id: string;
    name: string;
    brand: string;
    calories: number;
    servingQuantity: number;
    servingUnit: string;
    servingWeight: number;
    thumbnailImage: string;
    ingredients: Array<GenericFoodResponse>;
}
