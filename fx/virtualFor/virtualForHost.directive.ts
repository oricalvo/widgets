import {
    Component,
    Directive,
    ElementRef,
    EmbeddedViewRef,
    Input, NgModule,
    NgZone,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {VirtualForService} from "./virtualFor.service";

@Directive({
    selector: "[virtualForHostSize]",
    providers: [VirtualForService],
})
export class VirtualForHostDirective {
    @Input("virtualForHostSize") public size: number;

    private handlerOnWheel;

    constructor(private element: ElementRef, private service: VirtualForService) {
        this.handlerOnWheel = $event => this.onWheel($event);
    }

    ngOnInit() {
        this.element.nativeElement.addEventListener("wheel", this.handlerOnWheel);
    }

    ngOnChanges() {
        this.service.onSizeChanged(this.size);
    }

    ngOnDestroy() {
        this.element.nativeElement.removeEventListener("mousewheel", this.handlerOnWheel);
    }

    onWheel($event) {
        this.service.scrollBy($event.deltaY > 0 ? 1 : -1);
    }
}

