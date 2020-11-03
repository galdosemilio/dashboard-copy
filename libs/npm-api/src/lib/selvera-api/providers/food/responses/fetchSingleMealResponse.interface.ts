/**
 * Interface for GET /food/meal/:id (Response)
 */

import { DetailedIngredientResponse } from './detailedIngredientResponse.interface';

export interface FetchSingleMealResponse {
    id: string;
    name: string;
    imageUrl: string;
    createdAt: string;
    calories: number;
    protein: number;
    totalFat: number;
    saturatedFat?: number;
    cholesterol: number;
    fiber: number;
    sugar: number;
    sodium: number;
    carbohydrate: number;
    category: string;
    ingredients: Array<DetailedIngredientResponse>;
}
