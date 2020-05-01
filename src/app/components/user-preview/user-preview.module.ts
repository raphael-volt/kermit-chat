import { NgModule } from "@angular/core";
import { UserPreviewComponent } from './user-preview.component';
import { UserPictoPipe } from './user-picto.pipe';
import { MaterialModule } from 'material';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule
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