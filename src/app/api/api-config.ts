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

const DEV_API_CONFIG: ApiConfig = {
    key: '22317bca3371399e',
    url: 'http://localhost:4201',
    routes: {
        api: "api",
        images: "image.php",
        downloads: "download.php"
    }
}

const PROD_API_CONFIG: ApiConfig = Object.assign({}, DEV_API_CONFIG)
PROD_API_CONFIG.url = "https://jp.ketmie.com"
export { DEV_API_CONFIG, PROD_API_CONFIG }