import {
    AddConsumedRequest,
    AddFavoriteMealRequest,
    AddMealRequest,
    DeleteFavoriteMealRequest,
    FetchAllConsumedRequest,
    FetchAllFoodRequest,
    FetchAllMealRequest,
    FetchFavoriteMealsRequest,
    FetchSingleIngredientRequest,
    FetchSummaryRequest
} from '../../providers/food/requests';
import {
    AddConsumedMealResponse,
    AddMealResponse,
    DetailedIngredientResponse,
    FetchAllConsumedResponse,
    FetchAllFoodResponse,
    FetchAllMealResponse,
    FetchFavoriteMealResponse,
    FetchSingleConsumedMealResponse,
    FetchSingleIngredientResponse,
    FetchSingleMealResponse,
    SummaryDataResponse,
    SummaryDataResponseUnfiltered,
    UnderscoreDetailedIngredientResponse
} from '../../providers/food/responses';
import { ApiService } from '../../services/api.service';
import { FetchMealPlansRequest } from './requests/fetchMealPlansRequest.interface';
import { FetchAllMealPlansResponse } from './responses/fetchAllMealPlansResponse.interface';

/**
 * Food Logging for clients and providers
 */
class Food {
    /**
     * Init Api Service
     */
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Fetch Nutrition summary data
     * @param fetchAllFoodRequest must implement FetchAllFoodRequest
     * @returns FetchAllFoodResponse
     */
    public fetchSummary(fetchSummaryRequest: FetchSummaryRequest): Promise<Array<SummaryDataResponse>> {
        return this.apiService
            .request({
                endpoint: `/nutrition/summary`,
                method: `GET`,
                data: fetchSummaryRequest,
                version: '2.0'
            })
            .then((response: SummaryDataResponseUnfiltered) => {
                return response.data;
            });
    }

    /**
     * Fetch All Food
     * @param fetchAllFoodRequest must implement FetchAllFoodRequest
     * @returns FetchAllFoodResponse
     */
    public fetchAllFood(fetchAllFoodRequest: FetchAllFoodRequest): Promise<FetchAllFoodResponse> {
        return this.apiService
            .request({
                endpoint: `/food`,
                method: `GET`,
                data: fetchAllFoodRequest
            })
            .then(response => {
                const branded =
                    response.branded === undefined
                        ? []
                        : response.branded.map((brandedItem: any) => {
                              return {
                                  id: brandedItem.id,
                                  name: brandedItem.name,
                                  brand: brandedItem.brand,
                                  calories: brandedItem.calories,
                                  servingQuantity: brandedItem.serving_quantity,
                                  servingUnit: brandedItem.serving_unit,
                                  servingWeight: brandedItem.serving_weight,
                                  thumbnailImage: brandedItem.thumbnail_image
                              };
                          });
                const common =
                    response.common === undefined
                        ? []
                        : response.common.map((commonItem: any) => {
                              return {
                                  id: commonItem.id,
                                  name: commonItem.name,
                                  brand: commonItem.brand,
                                  calories: commonItem.calories,
                                  servingQuantity: commonItem.serving_quantity,
                                  servingUnit: commonItem.serving_unit,
                                  servingWeight: commonItem.serving_weight,
                                  thumbnailImage: commonItem.thumbnail_image
                              };
                          });
                const natural = {
                    id: response.natural.id,
                    name: response.natural.name,
                    brand: response.natural.brand,
                    calories: response.natural.calories,
                    servingQuantity: response.natural.serving_quantity,
                    servingUnit: response.natural.serving_unit,
                    servingWeight: response.natural.serving_weight,
                    thumbnailImage: response.natural.thumbnail_image,
                    ingredients: []
                };

                natural.ingredients =
                    response.natural.ingredients === undefined
                        ? {}
                        : response.natural.ingredients.map((naturalIngredient: any) => {
                              return {
                                  id: naturalIngredient.id,
                                  name: naturalIngredient.name,
                                  brand: naturalIngredient.brand,
                                  calories: naturalIngredient.calories,
                                  servingQuantity: naturalIngredient.serving_quantity,
                                  servingUnit: naturalIngredient.serving_unit,
                                  servingWeight: naturalIngredient.serving_weight,
                                  thumbnailImage: naturalIngredient.thumbnail_image
                              };
                          });

                const local =
                    response.local === undefined
                        ? []
                        : response.local.map((i: any) => {
                              const ingredients =
                                  i.ingredients === undefined
                                      ? []
                                      : i.ingredients.map((j: any) => ({
                                            id: j.id,
                                            name: j.name,
                                            brand: j.brand,
                                            calories: j.calories,
                                            servingQuantity: j.serving_quantity,
                                            servingUnit: j.serving_unit,
                                            servingWeight: j.serving_weight,
                                            thumbnailImage: j.thumbnail_image,
                                            metadata: j.metadata
                                        }));

                              return {
                                  id: i.id,
                                  name: i.name,
                                  brand: i.brand,
                                  calories: i.calories,
                                  servingQuantity: i.serving_quantity,
                                  servingUnit: i.serving_unit,
                                  servingWeight: i.serving_weight,
                                  thumbnailImage: i.thumbnail_image,
                                  ingredients: ingredients
                              };
                          });

                return {
                    branded: branded,
                    common: common,
                    natural: natural,
                    local: local
                };
            });
    }

    /**
     * Fetch All Consumed
     * @param fetchAllConsumedRequest must implement FetchAllConsumedRequest
     * @returns FetchAllConsumedResponse
     */
    public fetchAllConsumed(fetchAllConsumedRequest: FetchAllConsumedRequest): Promise<FetchAllConsumedResponse> {
        return this.apiService
            .request({
                endpoint: `/food/consumed`,
                method: `GET`,
                data: fetchAllConsumedRequest
            })
            .then(response => {
                return {
                    pagination: response.pagination,
                    meals: response.meals.map((meal: any) => {
                        const ingredients =
                            meal.ingredients === undefined
                                ? []
                                : meal.ingredients.map((measurement: any) => ({
                                      name: measurement.name,
                                      calories: measurement.calories,
                                      servingQuantity: measurement.serving_quantity,
                                      displayUnit: measurement.display_unit,
                                      metadata: measurement.metadata
                                  }));

                        return {
                            id: meal.id,
                            mealId: meal.meal_id,
                            name: meal.name,
                            type: meal.type,
                            imageUrl: meal.image_url,
                            consumedDate: meal.consumed_date,
                            note: meal.note,
                            calories: meal.calories,
                            protein: meal.protein,
                            totalFat: meal.total_fat,
                            saturatedFat: meal.saturated_fat,
                            cholesterol: meal.cholesterol,
                            fiber: meal.fiber,
                            sugar: meal.sugar,
                            sodium: meal.sodium,
                            carbohydrate: meal.carbohydrate,
                            ingredients: ingredients
                        };
                    })
                };
            });
    }

    /**
     * Fetch Single Consumed
     * @param id of consumed meal
     * @returns FetchSingleConsumedMealResponse
     */
    public fetchSingleConsumed(id: number): Promise<FetchSingleConsumedMealResponse> {
        return this.apiService
            .request({
                endpoint: `/food/consumed/${id}`,
                method: `GET`
            })
            .then(response => {
                const ingredients = response.ingredients.map((ingredient: any) => {
                    const measurements =
                        ingredient.measurements === undefined || !ingredient.measurements
                            ? []
                            : ingredient.measurements.map((measurement: any) => ({
                                  servingWeight: measurement.serving_weight,
                                  servingQuantity: measurement.serving_quantity,
                                  servingUnit: measurement.serving_unit
                              }));

                    return {
                        brand: ingredient.brand,
                        calcium: ingredient.calcium,
                        calories: ingredient.calories,
                        carbohydrate: ingredient.carbohydrate,
                        cholesterol: ingredient.cholesterol,
                        displayUnit: ingredient.display_unit,
                        fiber: ingredient.fiber,
                        highresImage: ingredient.highres_image,
                        imageUrl: ingredient.image_url,
                        ingredientId: ingredient.ingredient_id,
                        measurements: measurements,
                        name: ingredient.name,
                        potassium: ingredient.potassium,
                        protein: ingredient.protein,
                        saturatedFat: ingredient.saturated_fat,
                        serving: ingredient.serving,
                        servingQuantity: ingredient.serving_quantity,
                        servingUnit: ingredient.serving_unit,
                        servingWeight: ingredient.serving_weight,
                        sodium: ingredient.sodium,
                        sugar: ingredient.sugar,
                        thumbnailImage: ingredient.thumbnail_image,
                        totalFat: ingredient.total_fat,
                        metadata: ingredient.metadata
                    };
                });

                return {
                    account: response.account,
                    calories: response.calories,
                    carbohydrate: response.carbohydrate,
                    category: response.category,
                    cholesterol: response.cholesterol,
                    consumedDate: response.consumed_date,
                    note: response.note,
                    favorite: response.favorite,
                    fiber: response.fiber,
                    id: response.id,
                    imageUrl: response.image_url,
                    ingredients: ingredients,
                    name: response.name,
                    mealId: response.meal_id,
                    protein: response.protein,
                    saturatedFat: response.saturated_fat,
                    serving: response.serving,
                    sodium: response.sodium,
                    sugar: response.sugar,
                    totalFat: response.total_fat,
                    type: response.type
                };
            });
    }

    /**
     * Add Consumed Meal
     * @param addConsumedRequest must implement AddConsumedRequest
     * @returns AddConsumedMealResponse
     */
    public addConsumed(addConsumedRequest: AddConsumedRequest): Promise<AddConsumedMealResponse> {
        return this.apiService.request({
            endpoint: `/food/consumed`,
            method: `POST`,
            data: addConsumedRequest
        });
    }

    /**
     * Delete Consumed Meal
     * @param id
     * @returns void
     */
    public deleteConsumed(id: number): Promise<void> {
        return this.apiService.request({
            endpoint: `/food/consumed/${id}`,
            method: `DELETE`
        });
    }

    /**
     * Add Meal
     * @param addMeal must implement AddMealRequest
     * @returns AddMealResponse
     */
    public addMeal(addMeal: AddMealRequest): Promise<AddMealResponse> {
        return this.apiService.request({
            endpoint: `/food/meal`,
            method: `POST`,
            data: addMeal
        });
    }

    /**
     * Fetch All Meals
     * @param fetchAllMealRequest must implement FetchAllMealRequest
     * @returns AddMealResponse
     */
    public fetchAllMeals(fetchAllMealRequest?: FetchAllMealRequest): Promise<FetchAllMealResponse> {
        return this.apiService
            .request({
                endpoint: `/food/meal`,
                method: `GET`,
                data: fetchAllMealRequest
            })
            .then(response => {
                const meals = response.meals.map((meal: any) => {
                    return {
                        id: meal.id,
                        name: meal.name,
                        imageUrl: meal.image_url,
                        public: meal.public,
                        createdAt: meal.created_at,
                        category: meal.category,
                        calories: meal.calories,
                        ingredients: meal.ingredients.map((ingredient: any) => {
                            return {
                                name: ingredient.name,
                                displayUnit: ingredient.display_unit,
                                servingQuantity: ingredient.serving_quantity,
                                calories: ingredient.calories,
                                metadata: ingredient.metadata,
                                measurements: ingredient.measurements
                                    ? ingredient.measurements.map((measurement: any) => ({
                                          unit: measurement.serving_unit,
                                          weight: measurement.serving_weight,
                                          quantity: measurement.serving_quantity
                                      }))
                                    : []
                            };
                        }),
                        plans: meal.meal_plans
                            ? meal.meal_plans.map((plan: any) => ({
                                  id: plan.id,
                                  description: plan.description,
                                  items: plan.items
                                      ? plan.items.map((item: any) => ({
                                            recipe: item.recipe,
                                            dayOfWeek: item.day_of_week,
                                            type: item.type
                                        }))
                                      : []
                              }))
                            : [],
                        keys: meal.keys || []
                    };
                });

                return {
                    meals,
                    pagination: response.pagination
                };
            });
    }

    /**
     * Fetch Single Meal
     * @param id id of meal
     * @returns FetchSingleMealResponse
     */
    public fetchSingleMeal(id: number | string): Promise<FetchSingleMealResponse> {
        return this.apiService
            .request({
                endpoint: `/food/meal/${id}`,
                method: 'GET'
            })
            .then(response => {
                const ingredients: Array<DetailedIngredientResponse> = [];
                if (response.ingredients) {
                    response.ingredients.forEach((i: UnderscoreDetailedIngredientResponse) => {
                        const ingredient: DetailedIngredientResponse = {
                            ingredientId: i.ingredient_id,
                            name: i.name,
                            calcium: i.calcium,
                            calories: i.calories,
                            carbohydrate: i.carbohydrate,
                            cholesterol: i.cholesterol,
                            protein: i.protein,
                            fiber: i.fiber,
                            highresImage: i.highres_image,
                            imageUrl: '',
                            sugar: i.sugar,
                            totalFat: i.total_fat,
                            saturatedFat: i.saturated_fat,
                            sodium: i.sodium,
                            servingQuantity: i.serving_quantity,
                            servingWeight: i.serving_weight,
                            servingUnit: i.serving_unit,
                            displayUnit: i.display_unit,
                            serving: i.serving,
                            thumbnailImage: i.thumbnail_image,
                            metadata: i.metadata,
                            measurements: i.measurements.map((measurement: any) => {
                                return {
                                    servingWeight: measurement.serving_weight,
                                    servingUnit: measurement.serving_unit,
                                    servingQuantity: measurement.serving_quantity
                                };
                            })
                        };

                        if (!ingredient.measurements.length) {
                            ingredient.measurements.push({
                                servingQuantity: ingredient.servingQuantity,
                                servingUnit: ingredient.servingUnit.toString(),
                                servingWeight: ingredient.servingWeight
                            });
                        }

                        ingredients.push(ingredient);
                    });
                }

                return {
                    id: response.id,
                    name: response.name,
                    totalFat: response.total_fat,
                    imageUrl: response.image_url,
                    createdAt: response.created_at,
                    public: response.public,
                    calories: response.calories,
                    sodium: response.sodium,
                    cholesterol: response.cholesterol,
                    fiber: response.fiber,
                    sugar: response.sugar,
                    carbohydrate: response.carbohydrate,
                    protein: response.protein,
                    category: response.category,
                    ingredients: ingredients
                };
            });
    }

    /**
     * Fetch Meal Plans
     * @returns FetchAllMealPlansResponse
     * @param request FetchMealPlansRequest
     */
    public fetchMealPlans(request: FetchMealPlansRequest): Promise<FetchAllMealPlansResponse> {
        return this.apiService.request({
            endpoint: `/food/meal-plan`,
            data: request,
            method: 'GET',
            version: '2.0'
        });
    }

    /**
     * Fetch Favorite Meals
     * @param fetchFavoriteMealsRequest must implement FetchFavoriteMealsRequest
     * @returns void
     */
    public fetchFavorite(fetchFavoriteMealsRequest: FetchFavoriteMealsRequest): Promise<FetchFavoriteMealResponse> {
        return this.apiService
            .request({
                endpoint: `/food/favorite`,
                method: 'GET',
                data: fetchFavoriteMealsRequest
            })
            .then(response => {
                return {
                    meals: response.meals.map((i: any) => {
                        return {
                            id: i.id,
                            name: i.name,
                            imageUrl: i.image_url,
                            public: i.public,
                            createdAt: i.created_at,
                            category: i.category
                        };
                    }),
                    pagination: response.pagination
                };
            });
    }

    /**
     * Add Favorite
     * @param addFavoriteMeal must implement AddFavoriteMealRequest
     * @returns void
     */
    public addFavorite(addFavoriteMeal: AddFavoriteMealRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/food/favorite`,
            method: 'POST',
            data: addFavoriteMeal
        });
    }

    /**
     * Delete Favorite
     * @param deleteFavoriteMealRequest must implement DeleteFavoriteMealRequest
     * @returns void
     */
    public deleteFavorite(deleteFavoriteMealRequest: DeleteFavoriteMealRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/food/favorite`,
            method: 'DELETE',
            data: deleteFavoriteMealRequest,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        });
    }

    /**
     * Fetch Ingredient
     * @param fetchSingleIngredientRequest must implement FetchSingleIngredientRequest
     * @returns fetchSingleIngredientResponse
     */
    public fetchIngredient(
        fetchSingleIngredientRequest: FetchSingleIngredientRequest
    ): Promise<FetchSingleIngredientResponse> {
        return this.apiService
            .request({
                endpoint: `/food/ingredient/${encodeURIComponent(fetchSingleIngredientRequest.id)}`,
                method: 'GET',
                data: {
                    type: fetchSingleIngredientRequest.type
                }
            })
            .then(response => {
                return {
                    ingredientId: response.ingredient_id,
                    name: response.name,
                    type: response.type,
                    brand: response.brand,
                    calories: response.calories,
                    protein: response.protein,
                    totalFat: response.total_fat,
                    saturatedFat: response.saturated_fat,
                    cholesterol: response.cholesterol,
                    fiber: response.fiber,
                    sugar: response.sugar,
                    sodium: response.sodium,
                    carbohydrate: response.carbohydrate,
                    potassium: response.potassium,
                    servingQuantity: response.serving_quantity,
                    servingUnit: response.serving_unit,
                    servingWeight: response.serving_weight,
                    thumbnailImage: response.thumbnail_image,
                    highresImage: response.highres_image,
                    metadata: response.metadata,
                    isLocal: response.isLocal,
                    measurements:
                        response.measurements === undefined
                            ? []
                            : response.measurements.map((i: any) => {
                                  return {
                                      servingUnit: i.serving_unit,
                                      servingQuantity: i.serving_quantity,
                                      servingWeight: i.serving_weight
                                  };
                              })
                };
            });
    }
}

export { Food };
