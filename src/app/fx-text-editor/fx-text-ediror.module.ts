
import { NgModule } from '@angular/core';

import { QuillModule } from 'ngx-quill'
import { FxTextEditorComponent } from './fx-text-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [FxTextEditorComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        QuillModule.forRoot()
    ],
    exports: [
        FxTextEditorComponent
    ]
})
export class FxTextEditorModule { }
