import { Injectable } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { collection } from "./icon-collection";
@Injectable({
    providedIn: 'root'
})
export class IconService {

    constructor(private iconRegistry: MatIconRegistry, private sanitizer : DomSanitizer) {

        for (const key in collection) {
            
            iconRegistry.addSvgIconLiteral(key, sanitizer.bypassSecurityTrustHtml(collection[key]))
            //iconRegistry.registerFontClassAlias(key, key)
        }
    }
    
    registerSvg(name: string, path: string) {
        this.iconRegistry.addSvgIcon(
            name,
            this.sanitizer.bypassSecurityTrustResourceUrl(path));
    }
}