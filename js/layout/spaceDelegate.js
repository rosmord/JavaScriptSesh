// reminder : spaces:

import layoutDelegate from "./layoutDelegate";

// {type: 'space', minW: 0, minH: 1, growW: 0, growH: 1};
export default class SpaceDelegate extends layoutDelegate {
    constructor(g) {
        super(g, 0, 0);
        this.extraWidth = 0;
        this.extraHeight = 0;
    }

    packElement(childrenGeometry) {
        let g = this.group;
        this.inner.width = g.growW * g.minW + this.extraWidth;
        this.inner.height = g.growH * g.minH + this.extraHeight;
    }    
}