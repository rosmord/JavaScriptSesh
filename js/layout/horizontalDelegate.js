import AbstractHorizontalDelegate from "./abstractHorizontalDelegate";

export default class HorizontalDelegate extends AbstractHorizontalDelegate {
    constructor(g) {
        super(g, 0, 0);
    }

    resizeHorizontally(maxW, maxH) {
        if (this.group.content) {
            this.group.content.forEach(c => c.layout.resizeHorizontally(maxW, maxH));
        }        // now fix if needed.
        let dims = this.getOuterGeometry();
        let currentW = this.inner.width;
        if (currentW > maxW) {
            let scale = maxW / this.getInnerGeometry().getWidth();
            this.setScale(scale);
        }
        this.pack();
        // now pack for parent to use the right size.
    }

    fixSpacing(parentSize) {
        super.fixSpacing(parentSize);
        let parentWidth = parentSize.getWidth();
        let myWidth = this.getOuterGeometry().getWidth();
        if (parentWidth > myWidth && this.group.content) {
            let spaces = this.group.content.filter(c => c.type === "space");
            if (spaces.length > 0) {
                let spaceWidth = (parentWidth - myWidth) / (this.scale * spaces.length);
                spaces.forEach(sp => sp.layout.extraWidth = spaceWidth);
            }
            this.pack();
        }
    }
}