/**
 * Interface for GET /food/ingredient/:id (Response)
 */

import { IngredientMetadata } from '../entities/ingredientMetadata.type';
import { IngredientMeasurementResponse } from './ingredientMeasurementsResponse.interface';

export interface FetchSingleIngredientResponse {
    ingredientId: string;
    name: string;
    brand: string;
    calories: number;
    carbohydrate: number;
    cholesterol: number;
    protein: number;
    fiber: number;
    sugar: number;
    potassium: number;
    totalFat: number;
    saturatedFat: number;
    sodium: number;
    servingQuantity: number;
    servingUnit: string;
    servingWeight: number;
    thumbnailImage: string;
    highresImage: string;
    metadata: IngredientMetadata;
    isLocal: boolean;
    measurements: Array<IngredientMeasurementResponse>;
}
