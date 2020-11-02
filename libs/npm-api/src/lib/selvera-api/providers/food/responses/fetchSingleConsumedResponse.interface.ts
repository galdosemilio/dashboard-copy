/**
 * Interface for GET /food/consumed/:id (Response)
 */

import { DetailedIngredientResponse } from './detailedIngredientResponse.interface';

export interface FetchSingleConsumedMealResponse {
    account: number;
    calories: number;
    carbohydrate: number;
    category: string;
    cholesterol: number;
    consumedDate: string;
    note: string;
    favorite: boolean;
    fiber: number;
    id: number;
    imageUrl: string;
    ingredients: Array<DetailedIngredientResponse>;
    mealId: number;
    name: string;
    protein: number;
    saturatedFat: number;
    serving: number;
    sodium: number;
    sugar: number;
    totalFat: number;
    type: string;
}
