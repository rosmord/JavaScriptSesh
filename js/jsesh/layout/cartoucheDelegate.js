import AbstractHorizontalDelegate from "./abstractHorizontalDelegate";

export default class CartoucheDelegate extends AbstractHorizontalDelegate {
    constructor(g) {
        super(g, 0, 0);
    }

    resizeHorizontally(maxW, maxH) {
        // NO-OP
    }

    // Note : NoHScale is a property which is inherited 
    // by the element's ANCESTORS.

    packElement(childrenGeometry) {
        this.inner = {
            noHScale: true,
            width: childrenGeometry.getWidth(),
            height: childrenGeometry.getHeight()
        }
    }

}