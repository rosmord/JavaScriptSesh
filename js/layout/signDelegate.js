import layoutDelegate from "./layoutDelegate";

export default class SignDelegate extends layoutDelegate {
    constructor(g, width, height) {
        super(g, width, height);
    }

    packElement(contentGeometry) {
        // Inner size does not depend on children (ok, there are no children).
    }
}