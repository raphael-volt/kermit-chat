export interface IApiConfig {
    key: string
    url: string
    routes: IApiConfigRoutes
}
export interface IApiConfigRoutes {
    api: string
    images: string
    downloads: string
}
export class ApiConfig implements IApiConfig {
    key: string
    url: string
    routes: IApiConfigRoutes
}

const DEFAULT_API_CONFIG: ApiConfig = {
    key: '22317bca3371399e',
    url: 'http://localhost:4201',
    routes: {
        api: "api",
        images: "image.php",
        downloads: "download.php"
    }
}

export { DEFAULT_API_CONFIG }