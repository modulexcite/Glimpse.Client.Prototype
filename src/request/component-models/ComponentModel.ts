'use strict';

import { IComponentModel } from './IComponentModel';

export class ComponentModel implements IComponentModel {
    private callbacks: ((model: IComponentModel) => void)[] = [];

    public init(request) {
        // NOTE: No-op.
    }

    public onUpdate(callback: (model: IComponentModel) => void) {
        this.callbacks.push(callback);
    }

    public removeUpdateListener(callback: (model: IComponentModel) => void) {
        const index = this.callbacks.indexOf(callback);

        if (index >= 0) {
            this.callbacks.splice(index, 1);
        }
    }

    protected emitUpdate() {
        const that = this;

        this.callbacks.forEach(callback => {
            callback(that);
        });
    }
}