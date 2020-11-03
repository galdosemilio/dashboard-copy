/**
 * Interface for FetchAllSingleConsumedMealResponse
 */

import { IngredientMetadata } from '../entities/ingredientMetadata.type';
import { FetchAllConsumedMealIngredients } from './fetchAllConsumedMealIngredients.interface';

export interface FetchAllSingleConsumedMealResponse {
    id: string;
    mealId: string;
    name: string;
    type: string;
    imageUrl: string;
    consumedDate: string;
    note: string;
    calories: number;
    protein: number;
    totalFat: number;
    saturatedFat: number;
    cholesterol: number;
    fiber: number;
    sugar: number;
    sodium: number;
    carbohydrate: number;
    ingredients?: Array<FetchAllConsumedMealIngredients>;
    metadata: IngredientMetadata;
}
