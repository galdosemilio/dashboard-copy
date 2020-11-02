/**
 * Interface for GET /food (Response)
 */

import { GenericFoodResponse } from './fetchGenericFoodResponse.interface';
import { LocalFoodResponse } from './fetchLocalFoodResponse.interface';
import { NaturalFoodResponse } from './fetchNaturalFoodResponse.interface';

export interface FetchAllFoodResponse {
    branded: Array<GenericFoodResponse>;
    common: Array<GenericFoodResponse>;
    natural: NaturalFoodResponse;
    local: Array<LocalFoodResponse>;
}
