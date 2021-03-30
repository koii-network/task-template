/// <reference types="node" />
import { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios";
export interface ApiConfig {
    host?: string;
    protocol?: string;
    port?: string | number;
    timeout?: number;
    logging?: boolean;
    logger?: Function;
}
export default class Api {
    readonly METHOD_GET = "GET";
    readonly METHOD_POST = "POST";
    config: ApiConfig;
    constructor(config: ApiConfig);
    applyConfig(config: ApiConfig): void;
    getConfig(): ApiConfig;
    private mergeDefaults;
    get(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    post(endpoint: string, body: Buffer | string | object, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    /**
     * Get an AxiosInstance with the base configuration setup to fire off
     * a request to the network.
     */
    request(): AxiosInstance;
}
