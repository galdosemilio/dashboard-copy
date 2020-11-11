/**
 * Types
 */

// api

export interface ApiMap<T> {
  [name: string]: T;
}

export interface ApiField {
  type: string;
  optional?: boolean;
  description?: string;
  children?: ApiMap<ApiField>;
  values?: string;
  partial?: boolean;
}

export interface ApiParam extends ApiField {
  default?: string;
  values?: string;
}

export interface ApiSuccess extends ApiField {
  code?: string;
  children?: ApiMap<ApiSuccess>;
}

export interface ApiEndpoint<T> {
  api: {
    method: string;
    url: string;
    version: string;
  };
  fields: ApiMap<T>;
}

export type ApiRequest = ApiEndpoint<ApiParam>;
export type ApiResponse = ApiEndpoint<ApiSuccess>;

export interface ApiRoute {
  description: string;
  src: string;
  api: {
    method: string;
    url: string;
  };
  version: string;
  permissions: Array<string>;
  apiParam?: ApiMap<ApiParam>;
  apiSuccess?: ApiMap<ApiSuccess>;
  hasResponse?: boolean;
}

export interface RawApiRoute extends ApiRoute {
  name: string;
  group: string;
}

export interface RenderRoute extends ApiRoute {
  parameters: string;
  req: RenderType & {
    isOptional?: boolean;
  };
  res: RenderResponse;
}

export interface RenderType {
  type: string;
}

export interface RenderResponse extends RenderType {
  fieldId?: string;
  desc?: string;
}

// routes
export interface ApiModule {
  [provider: string]: ApiProvider;
}

export interface ApiProvider {
  [method: string]: ApiRoute;
}

export interface RenderProvider {
  [method: string]: RenderRoute;
}

export interface RoutesMap {
  [modname: string]: ApiModule;
}

// interfaces
export interface RequestsMap {
  [name: string]: ApiRequest;
}

export interface ResponsesMap {
  [name: string]: ApiResponse;
}
