/**
 * POST /food/consumed
 */

export interface CreateFoodConsumedRequest {
    /**
     * The id of the account that is adding the meal.
     * Clients accounts will be automatically passed and providers can only pass accounts that they have access to.
     */
    account: string;
    /** The id of the type of consumed meal. */
    type: number;
    /** The number of servings of this meal consumed. */
    serving: number;
    /** Timestamp the meal was consumed. */
    consumedAt: string;
    /** The note for the consumed meal. */
    note?: string;
    /** The id of the meal that was consumed. */
    meal: string;
}
