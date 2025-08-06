/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** UserProviderType */
export enum UserProviderType {
  Tg = "tg",
  Vk = "vk",
  Google = "google",
  Yandex = "yandex",
}

/** UserCompanyStatus */
export enum UserCompanyStatus {
  Active = "active",
  Disabled = "disabled",
}

/** UserCompanyRole */
export enum UserCompanyRole {
  Admin = "admin",
  Employee = "employee",
}

/** TopicsType */
export enum TopicsType {
  All = "all",
  Law = "law",
  Gpt = "gpt",
  Estate = "estate",
}

/** TopicStatusRequest */
export enum TopicStatusRequest {
  Archived = "archived",
  Active = "active",
}

/** TopicStatus */
export enum TopicStatus {
  Deleted = "deleted",
  Archived = "archived",
  Active = "active",
}

/** SenderRole */
export enum SenderRole {
  Assistant = "assistant",
  User = "user",
}

/** ProductStatus */
export enum ProductStatus {
  Active = "active",
  Hidden = "hidden",
  Suspended = "suspended",
  Deleted = "deleted",
}

/** ContentType */
export enum ContentType {
  Document = "document",
  Image = "image",
  Audio = "audio",
}

/** AssistantTypeFolderRequest */
export enum AssistantTypeFolderRequest {
  ExplainGpt = "explain_gpt",
  ExplainLaw = "explain_law",
  ExplainEstate = "explain_estate",
}

/** AssistantType */
export enum AssistantType {
  ExplainGpt = "explain_gpt",
  ExplainLaw = "explain_law",
  ExplainEstate = "explain_estate",
  ExplainImg = "explain_img",
}

/** AddUtmRequest */
export interface AddUtmRequest {
  /** Utm */
  utm: string;
  /** User Id */
  user_id?: number | null;
}

/** AttachmentResponse */
export interface AttachmentResponse {
  /** Filename */
  filename: string;
  content_type: ContentType;
  /** Url */
  url: string;
}

/** AuthUser */
export interface AuthUser {
  /** Email */
  email?: string | null;
  /** Name */
  name?: string | null;
  /** Id */
  id: number;
  /** Access Token */
  access_token: string;
  /** Refresh Token */
  refresh_token: string;
}

/** Body_upload_file_api_v2_attachments_upload__post */
export interface BodyUploadFileApiV2AttachmentsUploadPost {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** Body_upload_file_internal_api_v2_attachments_upload__user_provider___user_external_id___post */
export interface BodyUploadFileInternalApiV2AttachmentsUploadUserProviderUserExternalIdPost {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** BotResponse */
export interface BotResponse {
  /** Text */
  text: string;
}

/** CompanyModelPydantic */
export interface CompanyModelPydantic {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Name */
  name: string;
  /** Inn */
  inn: number;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Contact Email */
  contact_email: string;
  /** Contact Phone */
  contact_phone: string;
  /** Contact Telegram */
  contact_telegram?: string | null;
}

/** CreateCompanyRequest */
export interface CreateCompanyRequest {
  /** Name */
  name: string;
  /** Inn */
  inn: number;
  /** Contact Email */
  contact_email: string;
  /** Contact Phone */
  contact_phone: string;
  /** Contact Telegram */
  contact_telegram?: string | null;
}

/** CreatedAttachmentResponse */
export interface CreatedAttachmentResponse {
  /**
   * Attachment Id
   * @format uuid
   */
  attachment_id: string;
}

/** Disclaimer */
export interface Disclaimer {
  /** Id */
  id: number;
  /** User Id */
  user_id: number;
  /** Check Disclaimer */
  check_disclaimer: boolean;
}

/** Employee */
export interface Employee {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Name */
  name: string;
  /**
   * Email
   * @format email
   */
  email: string;
  role: UserCompanyRole;
  status: UserCompanyStatus;
}

/** EmployeeCreateRequest */
export interface EmployeeCreateRequest {
  /** Name */
  name: string;
  /**
   * Email
   * @format email
   */
  email: string;
  role: UserCompanyRole;
}

/** EmployeeCreateResponse */
export interface EmployeeCreateResponse {
  /** Name */
  name: string;
  /**
   * Email
   * @format email
   */
  email: string;
  role: UserCompanyRole;
  /** Password */
  password: string;
  status: UserCompanyStatus;
}

/** FolderResponse */
export interface FolderResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  assistant_type: AssistantType;
  /** Folder Name */
  folder_name: string;
  /** Display Order */
  display_order: number;
}

/** FolderUpdateRequest */
export interface FolderUpdateRequest {
  /** Folder Name */
  folder_name?: string | null;
  /** Display Order */
  display_order?: number | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HistoryMessageResponse */
export interface HistoryMessageResponse {
  /** Text */
  text: string;
  role: SenderRole;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Attachments */
  attachments: AttachmentResponse[];
}

/** Limit */
export interface Limit {
  /** Requests */
  requests: number;
  /** Available Requests */
  available_requests: number;
  /** Is Unlimited */
  is_unlimited: boolean;
}

/** LoginUserRequest */
export interface LoginUserRequest {
  /**
   * Email
   * @format email
   */
  email: string;
  /** Password */
  password: string;
}

/** MessageRequest */
export interface MessageRequest {
  /** Text */
  text: string;
  /** Attachments */
  attachments?: string[] | null;
  /**
   * Properties
   * Возможные поля:
   *
   * reasoning - для gpt (включает думающую модель)
   *
   * web_search - для всех (включает поиск в интернете)
   *
   * judicial_practice - для law поиск судебной практики
   *
   * short_answer - для law короткий ответ
   */
  properties?: string[] | null;
}

/** MessageResponse */
export interface MessageResponse {
  /** Text */
  text: string;
  /** Topic Id */
  topic_id: number;
}

/** NonPasswordUser */
export interface NonPasswordUser {
  /** Email */
  email?: string | null;
  /** Name */
  name?: string | null;
  /** Id */
  id: number;
}

/** NonPasswordUserTG */
export interface NonPasswordUserTG {
  /** Tg Id */
  tg_id: number;
  /** Name */
  name?: string | null;
  /** Telegram Username */
  telegram_username?: string | null;
  /** Id */
  id: number;
}

/** Notification */
export interface Notification {
  /** Target */
  target?: string | null;
  /** Telegram Ids */
  telegram_ids?: (number | string)[] | null;
  /** Text */
  text?: string | null;
  /** Photos */
  photos?: string[] | null;
  /** Video */
  video?: string | null;
  /** Document */
  document?: string | null;
  /** Gif */
  gif?: string | null;
  /** To Admin */
  to_admin?: boolean | null;
}

/** ProductPrivateResponse */
export interface ProductPrivateResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Name */
  name: string;
  assistant_type: AssistantType;
  /** Price */
  price: number;
  /** Day Gap */
  day_gap: number;
  status: ProductStatus;
  /** Priority */
  priority: number;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
}

/** ProductPublicResponse */
export interface ProductPublicResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Name */
  name: string;
  assistant_type: AssistantType;
  /** Price */
  price?: number | null;
  /** Day Gap */
  day_gap: number;
}

/** ProductSaveRequest */
export interface ProductSaveRequest {
  /** Name */
  name: string;
  assistant_type: AssistantType;
  /** Price */
  price: number;
  /** Day Gap */
  day_gap: number;
  status: ProductStatus;
  /** Priority */
  priority: number;
}

/** Promo */
export interface Promo {
  /** Id */
  id?: number | null;
  /** Name */
  name?: string | null;
  /** Subscription Id */
  subscription_id?: number | null;
  /** Date Start */
  date_start?: string | null;
  /** Is Actual */
  is_actual?: boolean | null;
}

/** PromoSaveRequest */
export interface PromoSaveRequest {
  /** Name */
  name?: string | null;
  /** Subscription Id */
  subscription_id?: number | null;
  /** Date Start */
  date_start?: string | null;
  /** Is Actual */
  is_actual?: boolean | null;
}

/** ResourceUsageResponse */
export interface ResourceUsageResponse {
  /** Resource Code */
  resource_code: string;
  /** Used */
  used: number;
  /** Available */
  available: number;
}

/** StartConversationRequest */
export interface StartConversationRequest {
  message: MessageRequest;
  assistant_type: AssistantType;
}

/** Statistic */
export interface Statistic {
  /** Today User */
  today_user: number;
  /** Today Requests */
  today_requests: number;
}

/** Subscription */
export interface Subscription {
  /** Id */
  id?: number | null;
  /** Name */
  name?: string | null;
  /** Price */
  price?: number | null;
  /** Requests Limit */
  requests_limit?: number | null;
  /** Day Gap */
  day_gap?: number | null;
  /** Created At */
  created_at?: string | null;
  /** Is Visible */
  is_visible?: boolean | null;
  /** Is Unlimited */
  is_unlimited?: boolean | null;
  /** Product Id */
  product_id?: string | null;
}

/** SubscriptionSaveRequest */
export interface SubscriptionSaveRequest {
  /** Name */
  name?: string | null;
  /** Price */
  price?: number | null;
  /** Requests Limit */
  requests_limit?: number | null;
  /** Day Gap */
  day_gap?: number | null;
  /** Is Visible */
  is_visible?: boolean | null;
  /** Is Unlimited */
  is_unlimited?: boolean | null;
}

/** TopicFolderModelPydantic */
export interface TopicFolderModelPydantic {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Topic Id */
  topic_id: number;
  /**
   * Folder Id
   * @format uuid
   */
  folder_id: string;
}

/** TopicSchema */
export interface TopicSchema {
  /** Id */
  id: number;
  /** Topic Name */
  topic_name: string;
  assistant_type: AssistantType;
  /** Sid */
  sid?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** TopicsListSchema */
export interface TopicsListSchema {
  /**
   * Date
   * @format date-time
   */
  date: string;
  /** Topics */
  topics: TopicSchema[];
}

/** UpdateTopicRequest */
export interface UpdateTopicRequest {
  /** Id */
  id: number;
  /** Topic Name */
  topic_name?: string | null;
  status?: TopicStatus | null;
}

/** UpdateUserRequest */
export interface UpdateUserRequest {
  /** Name */
  name?: string | null;
  /** Email */
  email?: string | null;
  /** Password */
  password?: string | null;
  /** Telegram Username */
  telegram_username?: string | null;
  /** Telegram Id */
  telegram_id?: number | null;
}

/** UserCompanyModelPydantic */
export interface UserCompanyModelPydantic {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** User Id */
  user_id: number;
  /**
   * Company Id
   * @format uuid
   */
  company_id: string;
  role: UserCompanyRole;
  status: UserCompanyStatus;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
}

/** UserCreateRequest */
export interface UserCreateRequest {
  /** Name */
  name: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /**
   * Password
   * @minLength 6
   */
  password: string;
}

/** UserLimitResponse */
export interface UserLimitResponse {
  /** Requests */
  requests?: number | null;
  /** Available Requests */
  available_requests?: number | null;
  /** Is Unlimited */
  is_unlimited: boolean;
  /**
   * Date Start
   * @format date-time
   */
  date_start: string;
  /**
   * Date Expire
   * @format date-time
   */
  date_expire: string;
}

/** Utm */
export interface Utm {
  /** Id */
  id?: number | null;
  /** Utm */
  utm?: string | null;
  /** User Id */
  user_id?: number | null;
  /** Used At */
  used_at?: string | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title FastAPI
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags User
     * @name GetUserApiV2UsersSelfGet
     * @summary Get User
     * @request GET:/api/v2/users/self
     * @secure
     */
    getUserApiV2UsersSelfGet: (params: RequestParams = {}) =>
      this.request<NonPasswordUser, HTTPValidationError>({
        path: `/api/v2/users/self`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UpdateUserApiV2UsersPatch
     * @summary Update User
     * @request PATCH:/api/v2/users/
     * @secure
     */
    updateUserApiV2UsersPatch: (
      data: UpdateUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<NonPasswordUser, HTTPValidationError>({
        path: `/api/v2/users/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name CreateUserApiV2UsersPost
     * @summary Create User
     * @request POST:/api/v2/users/
     */
    createUserApiV2UsersPost: (
      data: UserCreateRequest,
      params: RequestParams = {},
    ) =>
      this.request<AuthUser, HTTPValidationError>({
        path: `/api/v2/users/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name LoginUserApiV2UsersLoginPost
     * @summary Login User
     * @request POST:/api/v2/users/login
     */
    loginUserApiV2UsersLoginPost: (
      data: LoginUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<AuthUser, HTTPValidationError>({
        path: `/api/v2/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name TgAuthUserApiV2UsersTgAuthGet
     * @summary Tg Auth User
     * @request GET:/api/v2/users/tg/auth
     */
    tgAuthUserApiV2UsersTgAuthGet: (params: RequestParams = {}) =>
      this.request<AuthUser, any>({
        path: `/api/v2/users/tg/auth`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name RefreshTokenApiV2UsersTokenRefreshPost
     * @summary Refresh Token
     * @request POST:/api/v2/users/token/refresh
     * @secure
     */
    refreshTokenApiV2UsersTokenRefreshPost: (params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v2/users/token/refresh`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Redirect to OAuth provider for authentication
     *
     * @tags User
     * @name OauthLoginApiV2UsersAuthProviderGet
     * @summary Oauth Login
     * @request GET:/api/v2/users/auth/{provider}
     */
    oauthLoginApiV2UsersAuthProviderGet: (
      provider: UserProviderType,
      query: {
        /** Redirect Uri */
        redirect_uri: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AuthUser, HTTPValidationError>({
        path: `/api/v2/users/auth/${provider}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Handle callback, fetch user info and issue JWTs
     *
     * @tags User
     * @name OauthCallbackApiV2UsersAuthProviderCallbackGet
     * @summary Oauth Callback
     * @request GET:/api/v2/users/auth/{provider}/callback
     */
    oauthCallbackApiV2UsersAuthProviderCallbackGet: (
      provider: UserProviderType,
      params: RequestParams = {},
    ) =>
      this.request<AuthUser, HTTPValidationError>({
        path: `/api/v2/users/auth/${provider}/callback`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Attachment
     * @name UploadFileApiV2AttachmentsUploadPost
     * @summary Upload File
     * @request POST:/api/v2/attachments/upload/
     * @secure
     */
    uploadFileApiV2AttachmentsUploadPost: (
      data: BodyUploadFileApiV2AttachmentsUploadPost,
      params: RequestParams = {},
    ) =>
      this.request<CreatedAttachmentResponse, HTTPValidationError>({
        path: `/api/v2/attachments/upload/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic
     * @name CreateEmptyTopicApiV2TopicsNewPost
     * @summary Create Empty Topic
     * @request POST:/api/v2/topics/new
     * @secure
     */
    createEmptyTopicApiV2TopicsNewPost: (
      query: {
        assistant_type: AssistantType;
      },
      params: RequestParams = {},
    ) =>
      this.request<number, HTTPValidationError>({
        path: `/api/v2/topics/new`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic
     * @name NewTopicStreamingApiV2TopicsTopicIdStartStreamPost
     * @summary New Topic Streaming
     * @request POST:/api/v2/topics/{topic_id}/start/stream/
     * @secure
     */
    newTopicStreamingApiV2TopicsTopicIdStartStreamPost: (
      topicId: number,
      data: StartConversationRequest,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v2/topics/${topicId}/start/stream/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic
     * @name ProcessUserMessageStreamingApiV2TopicsTopicIdMessageStreamPost
     * @summary Process User Message Streaming
     * @request POST:/api/v2/topics/{topic_id}/message/stream/
     * @secure
     */
    processUserMessageStreamingApiV2TopicsTopicIdMessageStreamPost: (
      topicId: number,
      data: MessageRequest,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v2/topics/${topicId}/message/stream/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic
     * @name GetTopicHistoryApiV2TopicsTopicIdHistoryGet
     * @summary Get Topic History
     * @request GET:/api/v2/topics/{topic_id}/history/
     * @secure
     */
    getTopicHistoryApiV2TopicsTopicIdHistoryGet: (
      topicId: number,
      params: RequestParams = {},
    ) =>
      this.request<HistoryMessageResponse[], HTTPValidationError>({
        path: `/api/v2/topics/${topicId}/history/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic
     * @name GetTopicListApiV2TopicsTopicTypeStatusGet
     * @summary Get Topic List
     * @request GET:/api/v2/topics/{topic_type}/{status}
     * @secure
     */
    getTopicListApiV2TopicsTopicTypeStatusGet: (
      status: TopicStatusRequest,
      topicType: string,
      query: {
        topics_type: TopicsType;
        /** Folder Id */
        folder_id?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<TopicsListSchema[], HTTPValidationError>({
        path: `/api/v2/topics/${topicType}/${status}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic
     * @name UpdateTopicApiV2TopicsPatch
     * @summary Update Topic
     * @request PATCH:/api/v2/topics/
     * @secure
     */
    updateTopicApiV2TopicsPatch: (
      data: UpdateTopicRequest,
      params: RequestParams = {},
    ) =>
      this.request<TopicSchema, HTTPValidationError>({
        path: `/api/v2/topics/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic
     * @name MoveTopicToFolderApiV2TopicsTopicIdFolderIdPost
     * @summary Move Topic To Folder
     * @request POST:/api/v2/topics/{topic_id}/{folder_id}
     * @secure
     */
    moveTopicToFolderApiV2TopicsTopicIdFolderIdPost: (
      topicId: number,
      folderId: string,
      params: RequestParams = {},
    ) =>
      this.request<TopicFolderModelPydantic, HTTPValidationError>({
        path: `/api/v2/topics/${topicId}/${folderId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic
     * @name RemoveTopicFromFolderApiV2TopicsTopicIdFolderIdDelete
     * @summary Remove Topic From Folder
     * @request DELETE:/api/v2/topics/{topic_id}/{folder_id}
     * @secure
     */
    removeTopicFromFolderApiV2TopicsTopicIdFolderIdDelete: (
      topicId: number,
      folderId: string,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v2/topics/${topicId}/${folderId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic
     * @name PinTopicApiV2TopicsPinTopicIdFolderIdPost
     * @summary Pin Topic
     * @request POST:/api/v2/topics/pin/{topic_id}/{folder_id}
     * @secure
     */
    pinTopicApiV2TopicsPinTopicIdFolderIdPost: (
      topicId: number,
      folderId: string,
      params: RequestParams = {},
    ) =>
      this.request<TopicSchema, HTTPValidationError>({
        path: `/api/v2/topics/pin/${topicId}/${folderId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic
     * @name UpdatePinTopicApiV2TopicsPinTopicIdFolderIdDelete
     * @summary Update Pin Topic
     * @request DELETE:/api/v2/topics/pin/{topic_id}/{folder_id}
     * @secure
     */
    updatePinTopicApiV2TopicsPinTopicIdFolderIdDelete: (
      topicId: number,
      folderId: string,
      params: RequestParams = {},
    ) =>
      this.request<TopicSchema, HTTPValidationError>({
        path: `/api/v2/topics/pin/${topicId}/${folderId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Payment
     * @name CreatePaymentApiV2PaymentsSubscriptionIdPost
     * @summary Create Payment
     * @request POST:/api/v2/payments/{subscription_id}
     * @secure
     */
    createPaymentApiV2PaymentsSubscriptionIdPost: (
      subscriptionId: number,
      params: RequestParams = {},
    ) =>
      this.request<string, HTTPValidationError>({
        path: `/api/v2/payments/${subscriptionId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Limit
     * @name GetUserLimitsByUidApiV2LimitsGet
     * @summary Get User Limits By Uid
     * @request GET:/api/v2/limits/
     * @secure
     */
    getUserLimitsByUidApiV2LimitsGet: (params: RequestParams = {}) =>
      this.request<UserLimitResponse[], HTTPValidationError>({
        path: `/api/v2/limits/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Limit
     * @name UpdateLimitsApiV2LimitsUpdatePost
     * @summary Update Limits
     * @request POST:/api/v2/limits/update/
     */
    updateLimitsApiV2LimitsUpdatePost: (params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/v2/limits/update/`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Limit
     * @name SetStartLimitsApiV2LimitsSetStartForAllPost
     * @summary Set Start Limits
     * @request POST:/api/v2/limits/set_start_for_all/
     */
    setStartLimitsApiV2LimitsSetStartForAllPost: (params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/v2/limits/set_start_for_all/`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Quota
     * @name GetUserResourceUsageApiV2QuotasGet
     * @summary Get User Resource Usage
     * @request GET:/api/v2/quotas/
     * @secure
     */
    getUserResourceUsageApiV2QuotasGet: (params: RequestParams = {}) =>
      this.request<ResourceUsageResponse[], HTTPValidationError>({
        path: `/api/v2/quotas/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Statistic
     * @name GetDailyStatisticApiV2StatisticsCommonDailyGet
     * @summary Get Daily Statistic
     * @request GET:/api/v2/statistics/common/daily
     */
    getDailyStatisticApiV2StatisticsCommonDailyGet: (
      params: RequestParams = {},
    ) =>
      this.request<Statistic, any>({
        path: `/api/v2/statistics/common/daily`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Disclaimer
     * @name SetDisclaimerForAllApiV2DisclaimersSetForAllPost
     * @summary Set Disclaimer For All
     * @request POST:/api/v2/disclaimers/set_for_all/
     */
    setDisclaimerForAllApiV2DisclaimersSetForAllPost: (
      params: RequestParams = {},
    ) =>
      this.request<Disclaimer[], any>({
        path: `/api/v2/disclaimers/set_for_all/`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscription
     * @name GetSubscriptionApiV2SubscriptionsSubscriptionIdGet
     * @summary Get Subscription
     * @request GET:/api/v2/subscriptions/{subscription_id}
     */
    getSubscriptionApiV2SubscriptionsSubscriptionIdGet: (
      subscriptionId: number,
      params: RequestParams = {},
    ) =>
      this.request<Subscription, HTTPValidationError>({
        path: `/api/v2/subscriptions/${subscriptionId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscription
     * @name UpdateSubscriptionApiV2SubscriptionsSubscriptionIdPut
     * @summary Update Subscription
     * @request PUT:/api/v2/subscriptions/{subscription_id}
     */
    updateSubscriptionApiV2SubscriptionsSubscriptionIdPut: (
      subscriptionId: number,
      data: SubscriptionSaveRequest,
      params: RequestParams = {},
    ) =>
      this.request<Subscription, HTTPValidationError>({
        path: `/api/v2/subscriptions/${subscriptionId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscription
     * @name DeleteSubscriptionApiV2SubscriptionsSubscriptionIdDelete
     * @summary Delete Subscription
     * @request DELETE:/api/v2/subscriptions/{subscription_id}
     */
    deleteSubscriptionApiV2SubscriptionsSubscriptionIdDelete: (
      subscriptionId: number,
      params: RequestParams = {},
    ) =>
      this.request<number, HTTPValidationError>({
        path: `/api/v2/subscriptions/${subscriptionId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscription
     * @name GetSubscriptionListApiV2SubscriptionsGet
     * @summary Get Subscription List
     * @request GET:/api/v2/subscriptions/
     */
    getSubscriptionListApiV2SubscriptionsGet: (params: RequestParams = {}) =>
      this.request<Subscription[], any>({
        path: `/api/v2/subscriptions/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Для создания безлимитной подписки нужно задать 10000 запросов ОБЯЗАТЕЛЬНО!!!!
     *
     * @tags Subscription
     * @name AddSubscriptionApiV2SubscriptionsPost
     * @summary Add Subscription
     * @request POST:/api/v2/subscriptions/
     */
    addSubscriptionApiV2SubscriptionsPost: (
      data: SubscriptionSaveRequest,
      params: RequestParams = {},
    ) =>
      this.request<Subscription, HTTPValidationError>({
        path: `/api/v2/subscriptions/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name GetProductApiV2ProductsProductIdGet
     * @summary Get Product
     * @request GET:/api/v2/products/{product_id}
     */
    getProductApiV2ProductsProductIdGet: (
      productId: string,
      params: RequestParams = {},
    ) =>
      this.request<ProductPublicResponse, HTTPValidationError>({
        path: `/api/v2/products/${productId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name UpdateProductApiV2ProductsProductIdPut
     * @summary Update Product
     * @request PUT:/api/v2/products/{product_id}
     * @secure
     */
    updateProductApiV2ProductsProductIdPut: (
      productId: string,
      data: ProductSaveRequest,
      params: RequestParams = {},
    ) =>
      this.request<ProductPrivateResponse, HTTPValidationError>({
        path: `/api/v2/products/${productId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name DeleteProductApiV2ProductsProductIdDelete
     * @summary Delete Product
     * @request DELETE:/api/v2/products/{product_id}
     * @secure
     */
    deleteProductApiV2ProductsProductIdDelete: (
      productId: string,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v2/products/${productId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name ListProductApiV2ProductsGet
     * @summary List Product
     * @request GET:/api/v2/products/
     */
    listProductApiV2ProductsGet: (params: RequestParams = {}) =>
      this.request<ProductPublicResponse[], any>({
        path: `/api/v2/products/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name AddProductApiV2ProductsPost
     * @summary Add Product
     * @request POST:/api/v2/products/
     * @secure
     */
    addProductApiV2ProductsPost: (
      data: ProductSaveRequest,
      params: RequestParams = {},
    ) =>
      this.request<ProductPrivateResponse, HTTPValidationError>({
        path: `/api/v2/products/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Promo
     * @name GetPromoApiV2PromosPromoIdGet
     * @summary Get Promo
     * @request GET:/api/v2/promos/{promo_id}
     */
    getPromoApiV2PromosPromoIdGet: (
      promoId: number,
      params: RequestParams = {},
    ) =>
      this.request<Promo, HTTPValidationError>({
        path: `/api/v2/promos/${promoId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Promo
     * @name UpdatePromoApiV2PromosPromoIdPut
     * @summary Update Promo
     * @request PUT:/api/v2/promos/{promo_id}
     */
    updatePromoApiV2PromosPromoIdPut: (
      promoId: number,
      data: PromoSaveRequest,
      params: RequestParams = {},
    ) =>
      this.request<Promo, HTTPValidationError>({
        path: `/api/v2/promos/${promoId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Promo
     * @name AddPromoApiV2PromosPost
     * @summary Add Promo
     * @request POST:/api/v2/promos/
     */
    addPromoApiV2PromosPost: (
      data: PromoSaveRequest,
      params: RequestParams = {},
    ) =>
      this.request<Promo, HTTPValidationError>({
        path: `/api/v2/promos/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Promo
     * @name UsePromoByUidApiV2PromosUsePromoNamePost
     * @summary Use Promo By Uid
     * @request POST:/api/v2/promos/use/{promo_name}
     * @secure
     */
    usePromoByUidApiV2PromosUsePromoNamePost: (
      promoName: string,
      params: RequestParams = {},
    ) =>
      this.request<Subscription, HTTPValidationError>({
        path: `/api/v2/promos/use/${promoName}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Send message to Notification Service
     *
     * @tags Notification
     * @name SendMessageApiV2NotificationSendPost
     * @summary Send Message
     * @request POST:/api/v2/notification/send/
     */
    sendMessageApiV2NotificationSendPost: (
      data: Notification,
      params: RequestParams = {},
    ) =>
      this.request<Notification, HTTPValidationError>({
        path: `/api/v2/notification/send/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Folder
     * @name CreateFolderApiV2FoldersAssistantTypeFolderNamePost
     * @summary Create Folder
     * @request POST:/api/v2/folders/{assistant_type}/{folder_name}
     * @secure
     */
    createFolderApiV2FoldersAssistantTypeFolderNamePost: (
      assistantType: AssistantTypeFolderRequest,
      folderName: string,
      params: RequestParams = {},
    ) =>
      this.request<FolderResponse, HTTPValidationError>({
        path: `/api/v2/folders/${assistantType}/${folderName}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Folder
     * @name DeleteFolderApiV2FoldersFolderIdDelete
     * @summary Delete Folder
     * @request DELETE:/api/v2/folders/{folder_id}
     * @secure
     */
    deleteFolderApiV2FoldersFolderIdDelete: (
      folderId: string,
      params: RequestParams = {},
    ) =>
      this.request<FolderResponse[], HTTPValidationError>({
        path: `/api/v2/folders/${folderId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Folder
     * @name UpdateFolderApiV2FoldersFolderIdPatch
     * @summary Update Folder
     * @request PATCH:/api/v2/folders/{folder_id}
     * @secure
     */
    updateFolderApiV2FoldersFolderIdPatch: (
      folderId: string,
      data: FolderUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<FolderResponse[], HTTPValidationError>({
        path: `/api/v2/folders/${folderId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Folder
     * @name GetFolderListApiV2FoldersAssistantTypeGet
     * @summary Get Folder List
     * @request GET:/api/v2/folders/{assistant_type}
     * @secure
     */
    getFolderListApiV2FoldersAssistantTypeGet: (
      assistantType: AssistantTypeFolderRequest,
      params: RequestParams = {},
    ) =>
      this.request<FolderResponse[], HTTPValidationError>({
        path: `/api/v2/folders/${assistantType}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name CreateCompanyApiV2CompaniesPost
     * @summary Create Company
     * @request POST:/api/v2/companies/
     * @secure
     */
    createCompanyApiV2CompaniesPost: (
      data: CreateCompanyRequest,
      params: RequestParams = {},
    ) =>
      this.request<CompanyModelPydantic, HTTPValidationError>({
        path: `/api/v2/companies/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name UpdateCompanyContactsApiV2CompaniesCompanyIdPatch
     * @summary Update Company Contacts
     * @request PATCH:/api/v2/companies/{company_id}
     * @secure
     */
    updateCompanyContactsApiV2CompaniesCompanyIdPatch: (
      companyId: string,
      query?: {
        /** Contact Email */
        contact_email?: string | null;
        /** Contact Phone */
        contact_phone?: string | null;
        /** Contact Telegram */
        contact_telegram?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<CompanyModelPydantic, HTTPValidationError>({
        path: `/api/v2/companies/${companyId}`,
        method: "PATCH",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name GetEmployeeListApiV2CompaniesCompanyIdGet
     * @summary Get Employee List
     * @request GET:/api/v2/companies/{company_id}
     * @secure
     */
    getEmployeeListApiV2CompaniesCompanyIdGet: (
      companyId: string,
      params: RequestParams = {},
    ) =>
      this.request<Employee[], HTTPValidationError>({
        path: `/api/v2/companies/${companyId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name AddUserToCompanyApiV2CompaniesCompanyIdEmployeesPost
     * @summary Add User To Company
     * @request POST:/api/v2/companies/{company_id}/employees
     * @secure
     */
    addUserToCompanyApiV2CompaniesCompanyIdEmployeesPost: (
      companyId: string,
      data: EmployeeCreateRequest,
      params: RequestParams = {},
    ) =>
      this.request<EmployeeCreateResponse, HTTPValidationError>({
        path: `/api/v2/companies/${companyId}/employees`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name UpdateEmployeeStatusApiV2CompaniesEmployeeIdStatusPatch
     * @summary Update Employee Status
     * @request PATCH:/api/v2/companies/{employee_id}/{status}
     * @secure
     */
    updateEmployeeStatusApiV2CompaniesEmployeeIdStatusPatch: (
      status: UserCompanyStatus,
      employeeId: string,
      query: {
        /** User Id */
        user_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserCompanyModelPydantic, HTTPValidationError>({
        path: `/api/v2/companies/${employeeId}/${status}`,
        method: "PATCH",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name RemoveEmployeeFromCompanyApiV2CompaniesUserIdDelete
     * @summary Remove Employee From Company
     * @request DELETE:/api/v2/companies/{user_id}
     * @secure
     */
    removeEmployeeFromCompanyApiV2CompaniesUserIdDelete: (
      userId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v2/companies/${userId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  internal = {
    /**
     * No description
     *
     * @tags User Internal
     * @name GetExternalUserInternalApiV2UsersProviderExternalIdGet
     * @summary Get External User
     * @request GET:/internal/api/v2/users/{provider}/{external_id}
     */
    getExternalUserInternalApiV2UsersProviderExternalIdGet: (
      provider: UserProviderType,
      externalId: string,
      params: RequestParams = {},
    ) =>
      this.request<NonPasswordUserTG, HTTPValidationError>({
        path: `/internal/api/v2/users/${provider}/${externalId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User Internal
     * @name UpdateExternalUserInternalApiV2UsersProviderExternalIdPatch
     * @summary Update External User
     * @request PATCH:/internal/api/v2/users/{provider}/{external_id}
     */
    updateExternalUserInternalApiV2UsersProviderExternalIdPatch: (
      provider: UserProviderType,
      externalId: string,
      query: {
        /** Telegram Username */
        telegram_username: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<NonPasswordUserTG, HTTPValidationError>({
        path: `/internal/api/v2/users/${provider}/${externalId}`,
        method: "PATCH",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User Internal
     * @name CreateExternalUserInternalApiV2UsersProviderExternalIdExternalNameExternalUsernamePut
     * @summary Create External User
     * @request PUT:/internal/api/v2/users/{provider}/{external_id}/{external_name}/{external_username}
     */
    createExternalUserInternalApiV2UsersProviderExternalIdExternalNameExternalUsernamePut:
      (
        provider: UserProviderType,
        externalId: string,
        externalName: string,
        externalUsername: string,
        params: RequestParams = {},
      ) =>
        this.request<NonPasswordUserTG, HTTPValidationError>({
          path: `/internal/api/v2/users/${provider}/${externalId}/${externalName}/${externalUsername}`,
          method: "PUT",
          format: "json",
          ...params,
        }),

    /**
     * No description
     *
     * @tags User Internal
     * @name GetUsersListTgInternalApiV2UsersProviderGet
     * @summary Get Users List Tg
     * @request GET:/internal/api/v2/users/{provider}/
     */
    getUsersListTgInternalApiV2UsersProviderGet: (
      provider: UserProviderType,
      params: RequestParams = {},
    ) =>
      this.request<NonPasswordUserTG[], HTTPValidationError>({
        path: `/internal/api/v2/users/${provider}/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User Internal
     * @name AddUtmInternalApiV2UsersUtmPost
     * @summary Add Utm
     * @request POST:/internal/api/v2/users/utm
     */
    addUtmInternalApiV2UsersUtmPost: (
      data: AddUtmRequest,
      params: RequestParams = {},
    ) =>
      this.request<Utm, HTTPValidationError>({
        path: `/internal/api/v2/users/utm`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Attachment Internal
     * @name UploadFileInternalApiV2AttachmentsUploadUserProviderUserExternalIdPost
     * @summary Upload File
     * @request POST:/internal/api/v2/attachments/upload/{user_provider}/{user_external_id}/
     */
    uploadFileInternalApiV2AttachmentsUploadUserProviderUserExternalIdPost: (
      userProvider: UserProviderType,
      userExternalId: string,
      data: BodyUploadFileInternalApiV2AttachmentsUploadUserProviderUserExternalIdPost,
      params: RequestParams = {},
    ) =>
      this.request<CreatedAttachmentResponse, HTTPValidationError>({
        path: `/internal/api/v2/attachments/upload/${userProvider}/${userExternalId}/`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic Internal
     * @name NewTopicInternalApiV2TopicsStartUserProviderUserExternalIdPost
     * @summary New Topic
     * @request POST:/internal/api/v2/topics/start/{user_provider}/{user_external_id}/
     */
    newTopicInternalApiV2TopicsStartUserProviderUserExternalIdPost: (
      userProvider: UserProviderType,
      userExternalId: string,
      data: StartConversationRequest,
      params: RequestParams = {},
    ) =>
      this.request<MessageResponse, HTTPValidationError>({
        path: `/internal/api/v2/topics/start/${userProvider}/${userExternalId}/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Topic Internal
     * @name ProcessUserMessageInternalApiV2TopicsTopicIdMessagePost
     * @summary Process User Message
     * @request POST:/internal/api/v2/topics/{topic_id}/message/
     */
    processUserMessageInternalApiV2TopicsTopicIdMessagePost: (
      topicId: number,
      data: MessageRequest,
      params: RequestParams = {},
    ) =>
      this.request<BotResponse, HTTPValidationError>({
        path: `/internal/api/v2/topics/${topicId}/message/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Payment Internal
     * @name CreateExternalPaymentInternalApiV2PaymentsSubscriptionIdUserProviderUserExternalIdPost
     * @summary Create External Payment
     * @request POST:/internal/api/v2/payments/{subscription_id}/{user_provider}/{user_external_id}
     */
    createExternalPaymentInternalApiV2PaymentsSubscriptionIdUserProviderUserExternalIdPost:
      (
        subscriptionId: number,
        userProvider: UserProviderType,
        userExternalId: string,
        params: RequestParams = {},
      ) =>
        this.request<string, HTTPValidationError>({
          path: `/internal/api/v2/payments/${subscriptionId}/${userProvider}/${userExternalId}`,
          method: "POST",
          format: "json",
          ...params,
        }),

    /**
     * No description
     *
     * @tags Limit Internal
     * @name GetUserLimitsInternalApiV2LimitsUserProviderUserExternalIdGet
     * @summary Get User Limits
     * @request GET:/internal/api/v2/limits/{user_provider}/{user_external_id}
     */
    getUserLimitsInternalApiV2LimitsUserProviderUserExternalIdGet: (
      userProvider: UserProviderType,
      userExternalId: string,
      params: RequestParams = {},
    ) =>
      this.request<Limit, HTTPValidationError>({
        path: `/internal/api/v2/limits/${userProvider}/${userExternalId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Quota Internal
     * @name GetExternalUserResourceUsageInternalApiV2QuotasUserProviderUserExternalIdGet
     * @summary Get External User Resource Usage
     * @request GET:/internal/api/v2/quotas/{user_provider}/{user_external_id}
     */
    getExternalUserResourceUsageInternalApiV2QuotasUserProviderUserExternalIdGet:
      (
        userProvider: UserProviderType,
        userExternalId: string,
        params: RequestParams = {},
      ) =>
        this.request<ResourceUsageResponse[], HTTPValidationError>({
          path: `/internal/api/v2/quotas/${userProvider}/${userExternalId}`,
          method: "GET",
          format: "json",
          ...params,
        }),

    /**
     * No description
     *
     * @tags Quota Internal
     * @name UpdateQuotasInternalApiV2QuotasUpdatePost
     * @summary Update Quotas
     * @request POST:/internal/api/v2/quotas/update/
     */
    updateQuotasInternalApiV2QuotasUpdatePost: (params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/internal/api/v2/quotas/update/`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Disclaimer Internal
     * @name GetDisclaimerInternalApiV2DisclaimersUserProviderUserExternalIdGet
     * @summary Get Disclaimer
     * @request GET:/internal/api/v2/disclaimers/{user_provider}/{user_external_id}
     */
    getDisclaimerInternalApiV2DisclaimersUserProviderUserExternalIdGet: (
      userProvider: UserProviderType,
      userExternalId: string,
      params: RequestParams = {},
    ) =>
      this.request<Disclaimer, HTTPValidationError>({
        path: `/internal/api/v2/disclaimers/${userProvider}/${userExternalId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Disclaimer Internal
     * @name AddDisclaimerInternalApiV2DisclaimersUserProviderUserExternalIdPost
     * @summary Add Disclaimer
     * @request POST:/internal/api/v2/disclaimers/{user_provider}/{user_external_id}
     */
    addDisclaimerInternalApiV2DisclaimersUserProviderUserExternalIdPost: (
      userProvider: UserProviderType,
      userExternalId: string,
      params: RequestParams = {},
    ) =>
      this.request<Disclaimer, HTTPValidationError>({
        path: `/internal/api/v2/disclaimers/${userProvider}/${userExternalId}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Disclaimer Internal
     * @name UpdateDisclaimerInternalApiV2DisclaimersUserProviderUserExternalIdPatch
     * @summary Update Disclaimer
     * @request PATCH:/internal/api/v2/disclaimers/{user_provider}/{user_external_id}
     */
    updateDisclaimerInternalApiV2DisclaimersUserProviderUserExternalIdPatch: (
      userProvider: UserProviderType,
      userExternalId: string,
      params: RequestParams = {},
    ) =>
      this.request<Disclaimer, HTTPValidationError>({
        path: `/internal/api/v2/disclaimers/${userProvider}/${userExternalId}`,
        method: "PATCH",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Promo Internal
     * @name UsePromoInternalApiV2PromosUseUserProviderUserExternalIdPromoNamePost
     * @summary Use Promo
     * @request POST:/internal/api/v2/promos/use/{user_provider}/{user_external_id}/{promo_name}
     */
    usePromoInternalApiV2PromosUseUserProviderUserExternalIdPromoNamePost: (
      promoName: string,
      userProvider: UserProviderType,
      userExternalId: string,
      params: RequestParams = {},
    ) =>
      this.request<Subscription, HTTPValidationError>({
        path: `/internal/api/v2/promos/use/${userProvider}/${userExternalId}/${promoName}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Signal Internal
     * @name GetExternalUserResourceUsageInternalApiV2SignalsSignalNamePost
     * @summary Get External User Resource Usage
     * @request POST:/internal/api/v2/signals/{signal_name}
     */
    getExternalUserResourceUsageInternalApiV2SignalsSignalNamePost: (
      signalName: string,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/internal/api/v2/signals/${signalName}`,
        method: "POST",
        format: "json",
        ...params,
      }),
  };
}
