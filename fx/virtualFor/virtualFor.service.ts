export interface VirtualForListener {
    vsOnInit();
    vsOnScroll();
    vsOnSizeChanged();
    vsOnAllChanged();
}

export class VirtualForService {
    private listeners: VirtualForListener[] = [];

    init: boolean;
    all: any[];
    items: any[];
    size: number;
    top: number;

    constructor() {
        this.init = false;
        this.top = 0;
        this.all = null;
        this.items = null;
        this.size = 0;
    }

    scrollBy(steps) {
        this.scrollTop(this.top + steps);
    }

    scrollTop(top, dontNotify = null) {
        if(top < 0) {
            top = 0;
        }
        else if(top + this.size > this.all.length) {
            top = this.all.length - this.size;
        }

        if(this.top == top) {
            return;
        }

        this.top = top;

        this.calcItems();
        this.emit(l => l.vsOnScroll(), dontNotify);
    }

    register(listener: VirtualForListener) {
        this.listeners.push(listener);

        if(this.init) {
            listener.vsOnInit();
        }
    }

    unregister(listener: VirtualForListener) {
        const index = this.listeners.indexOf(listener);
        if(index != -1) {
            this.listeners.splice(index, 1);
        }
    }

    onAllChanged(all: any[]) {
        this.all = all;

        this.calcItems();

        this.ensureInit();

        if(this.init) {
            this.emit(l => l.vsOnAllChanged());
        }
    }

    private ensureInit() {
        if(this.init) {
            return true;
        }

        this.init = this.all && this.items && this.size>0;

        if(this.init) {
            for(let l of this.listeners) {
                this.emit(l => l.vsOnInit());
            }
        }
    }

    onSizeChanged(size: number) {
        this.size = size;

        this.emit(l => l.vsOnSizeChanged());
    }

    private calcItems() {
        this.items = (this.all ? this.all.slice(this.top, this.top + this.size) : []);
    }

    private emit(func: (l:VirtualForListener)=>void, dontNotify = null) {
        for(let l of this.listeners) {
            if(l==dontNotify) {
                continue;
            }

            func(l);
        }
    }
}
