import LayoutDelegate from "./layoutDelegate";

export default class LigatureDelegate extends LayoutDelegate {
    constructor(g, width, height) {
        super(g, width, height);
    }

    packElement(contentGeometry) {
        // Inner size does not depend on children (ok, there are no children).
    }
}