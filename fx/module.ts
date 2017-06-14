import {NgModule} from "@angular/core";
import {VirtualForDirective} from "./virtualFor/virtualFor.directive";
import {VirtualForHostDirective} from "./virtualFor/virtualForHost.directive";
import {VirtualForScrollbarComponent} from "./virtualFor/virtualScrollbar.component";

@NgModule({
    declarations: [
        VirtualForDirective,
        VirtualForHostDirective,
        VirtualForScrollbarComponent,
    ],
    exports: [
        VirtualForDirective,
        VirtualForHostDirective,
        VirtualForScrollbarComponent,
    ]
})
export class WidgetsModule {
}

