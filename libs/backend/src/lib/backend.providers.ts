import { PHPProviders } from '@coachcare/backend/services/php/providers.index';
import {
  GatewayProviders,
  SelveraProviders
} from '@coachcare/backend/services/providers/providers.index';

export const BackendProviders = [...GatewayProviders, ...PHPProviders, ...SelveraProviders];
