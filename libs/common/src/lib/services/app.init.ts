import { ContextService } from './context.service';

/**
 * App Initializer
 *
 * @param context ContextService
 */
export function onAppInit(context: ContextService) {
  return context.init();
}
