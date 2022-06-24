import AbstractVerticalDelegate from './abstractVerticalDelegate.js'

export default class VerticalDelegate extends AbstractVerticalDelegate {
    constructor(g) {
        super(g, 0, 0);
    }

    resizeVertically(maxW, maxH) {
        if (this.group.content) {
            this.group.content.forEach(c => c.layout.resizeVertically(maxW, maxH));
        }        // now fix if needed.
        let currentH = this.inner.height;
        if (currentH > maxH) {
            let scale = maxH / this.getInnerGeometry().getHeight();
            this.setScale(scale);
        }
        this.pack();
    }

    fixSpacing(parentSize) {
        super.fixSpacing(parentSize);
        let parentHeight = parentSize.getHeight();
        let myHeight = this.getOuterGeometry().getHeight();
        if (parentHeight > myHeight && this.group.content) {
            let spaces = this.group.content.filter(c => c.type === "space");
            if (spaces.length > 0) {
                let spaceHeight = (parentHeight - myHeight) / (this.scale * spaces.length);
                spaces.forEach(sp => sp.layout.extraHeight = spaceHeight);
            }
            this.pack();
        }
    }
}