import { NgModule } from "@angular/core";
import { UserPreviewComponent } from './user-preview.component';
import { UserPictoPipe } from './user-picto.pipe';
import { MaterialModule } from 'material';
import { CommonModule } from '@angular/common';
import { MatAvatarsModule } from "mat-avatars";

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        MatAvatarsModule
    ],
    declarations: [
        UserPreviewComponent,
        UserPictoPipe
    ],
    exports: [
        UserPreviewComponent,
        UserPictoPipe 
    ]
})

export class UserPreviewModule { }