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
import {VirtualForListener, VirtualForService} from "./virtualFor.service";

@Component({
    selector: "virtual-scrollbar",
    template: `<div #inner class="inner"></div>`,
    styles: [
        `
            /*:host {*/
            /*display: inline-block;*/
            /*position: relative;*/
            /*background-color: blue;*/
            /*box-sizing: border-box;*/
        /*}*/
        
        .inner {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            min-height: 2em;
            background-color: rgb(200, 200, 200);
        }`
    ]
})
export class VirtualForScrollbarComponent implements VirtualForListener {
    @ViewChild("inner") inner: any;

    private handlerMouseDown;
    private handlerMouseUp;
    private handlerMouseMove;

    private totalHeight;
    private innerHeight;
    private itemHeight;

    private startMousePageY;
    private startInnerOffsetTop;
    private startTop;

    constructor(private elementRef: ElementRef, private service: VirtualForService, private ngZone: NgZone) {
    }

    get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    ngOnInit() {
        this.service.register(this);

        this.handlerMouseDown = ($event)=>this.onMouseDown($event);
        this.handlerMouseUp = ($event)=>this.onMouseUp($event);
        this.handlerMouseMove = ($event)=>this.onMouseMove($event);

        this.inner.nativeElement.addEventListener("mousedown", this.handlerMouseDown);
    }

    vsOnInit() {
        if(this.service.items.length == this.service.all.length) {
            this.inner.nativeElement.style.height = 0;
        }
        else {
            this.inner.nativeElement.style.height = (this.service.items.length / this.service.all.length) * this.elementRef.nativeElement.clientHeight + "px";
        }

        this.innerHeight = this.inner.nativeElement.clientHeight;
        this.totalHeight = this.element.clientHeight;
        this.itemHeight = (this.totalHeight - this.innerHeight) / (this.service.all.length-this.service.size);
    }

    vsOnScroll() {
        const top = (this.totalHeight-this.innerHeight) * (this.service.top / (this.service.all.length-this.service.size));

        this.inner.nativeElement.style.top = top + "px";
    }

    vsOnAllChanged() {
    }

    vsOnSizeChanged() {
    }

    onMouseDown($event) {
        this.ngZone.runOutsideAngular(() => {
            document.addEventListener("mousemove", this.handlerMouseMove);
            document.addEventListener("mouseup", this.handlerMouseUp);
        });

        this.startTop = this.service.top;
        this.startMousePageY = $event.pageY;
        this.startInnerOffsetTop = this.inner.nativeElement.offsetTop;

        $event.preventDefault();
    }

    onMouseUp($event) {
        document.removeEventListener("mousemove", this.handlerMouseMove);
        document.removeEventListener("mouseup", this.handlerMouseUp);
    }

    onMouseMove($event) {
        const rect = this.element.getBoundingClientRect();

        let offsetY = $event.pageY - this.startMousePageY;

        const offset = Math.floor(offsetY / this.itemHeight);

        this.ngZone.run(()=> {
            this.service.scrollTop(this.startTop + offset, this);

            let innerOffsetTop = this.startInnerOffsetTop + offsetY;
            if(innerOffsetTop < 0) {
                innerOffsetTop = 0;
            }
            else if(innerOffsetTop > this.totalHeight - this.innerHeight) {
                innerOffsetTop = this.totalHeight - this.innerHeight;
            }

            this.inner.nativeElement.style.top = innerOffsetTop + "px";
        });
    }
}
