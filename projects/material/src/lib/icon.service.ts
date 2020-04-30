import { Injectable } from "@angular/core";
import { collection } from "./icon-collection";
@Injectable({
    providedIn: 'root'
})
export class IconService {

    constructor() {
        this.createSvgFactory()
    }

    private createSvgFactory() {
        const div = document.createElement('div')
        div.style.position = "fixed"
        const symbols: string[] = []
        const re = /<svg xmlns="[^"]*"(.*)<\/svg>/gm
        const fill_re = /fill="(black)"/gm
        let sym: string
        for (const key in collection) {
            sym = collection[key].replace(re, `<symbol id="${key}" $1</symbol>`)
            symbols.push(sym.replace(fill_re, 'fill="currentColor"'))
        }
        div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="24" viewBox="0 0 24 24" width="24">
\t${symbols.join("\n\t")}
</svg>`
        document.body.appendChild(div)
        const pathList = div.getElementsByTagName('path')
        for (let i = 0; i < pathList.length; i++) {
            const element = pathList.item(i);
            if(! element.hasAttribute("fill")) {
                element.setAttribute("fill", 'currentColor')
            }
            
        }

    }

    get(key: string): string {
        if (key in collection)
            return collection[key]
        return 'not found'
    }
}