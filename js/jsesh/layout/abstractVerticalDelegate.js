import LayoutDelegate from "./layoutDelegate";

export default class AbstractVerticalDelegate extends LayoutDelegate {
    constructor(g, width, height) {
        super(g, width, height);
    }

    nextPos(currentPos, i) {
        let g = this.group.content[i];
        let geom = g.layout.getOuterGeometry();
        return {
            x: currentPos.x,
            y: currentPos.y + geom.getHeight()
        };
    }

}