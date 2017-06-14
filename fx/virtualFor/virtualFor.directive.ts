import {Directive, ElementRef, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef} from "@angular/core";
import {VirtualForListener, VirtualForService} from "./virtualFor.service";

@Directive({
    selector: "[virtualFor]",
})
export class VirtualForDirective implements VirtualForListener {
    @Input("virtualForOf") items: any[];

    private views: EmbeddedViewRef<any>[];

    constructor(private element: ElementRef,
                private viewContainerRef: ViewContainerRef,
                private templateRef: TemplateRef<any>,
                private service: VirtualForService) {
        this.views = [];
    }

    ngOnInit() {
        this.service.register(this);
    }

    ngOnChanges() {
        this.service.onAllChanged(this.items);
    }

    vsOnInit() {
        let index = 0;

        for(let item of this.service.items) {
            const context = {
                $implicit: item,
                index: index++,
            };

            const view = this.viewContainerRef.createEmbeddedView(this.templateRef, context);

            this.views.push(view);
        }
    }

    vsOnAllChanged() {
        if(this.service.items.length < this.views.length) {
            for(let i=this.service.items.length; i<this.views.length; i++) {
                this.views[i].destroy();
            }

            this.views.splice(this.service.items.length, this.views.length-this.service.items.length);
        }
        else if(this.service.items.length > this.views.length) {
            for(let i=this.views.length; i<this.service.items.length; i++) {
                const context = {};
                const view = this.viewContainerRef.createEmbeddedView(this.templateRef, context);
                this.views.push(view);
            }
        }

        for(let i=0; i<this.service.items.length; i++) {
            this.views[i].context.$implicit = this.service.items[i];
            this.views[i].context.index = this.service.top + i;
        }
    }

    vsOnScroll() {
        for(let i=0; i<this.service.items.length; i++) {
            this.views[i].context.$implicit = this.service.items[i];
            this.views[i].context.index = this.service.top + i;
        }
    }

    vsOnSizeChanged() {
        if(this.service.size == this.views.length) {
            return;
        }

        if(this.service.size < this.views.length) {
            for(let i=this.service.size; i<this.views.length; i++) {
                this.views[i].destroy();
            }

            this.views.splice(this.service.size, this.views.length-this.service.size);
        }
        else {
            for(let i=this.views.length; i<this.service.size; i++) {
                const context = {
                    $implicit: this.service.items[i],
                    index: this.service.top + i,
                };

                const view = this.viewContainerRef.createEmbeddedView(this.templateRef, context);

                this.views.push(view);
            }
        }
    }
}
