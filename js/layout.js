/**
 * Classes dealing with glyphs layout.
 * Not part of the public API.
 */

export {
    layoutFactory, LayoutDelegate
}

import { LayoutRectangle, SimpleRectangle } from "./shapes.js";

// We hide the various layout classes behind the factory.

function layoutFactory(glyphsInfo, g) {
    switch (g.type) {
        case 'v':
            return new VerticalDelegate(g);
        case 'l':
            return new LineDelegate(g);
        case 'h':
            return new HorizontalDelegate(g);
        case 'cartouche':
            return new CartoucheDelegate(g);
        case 's':
            var info = glyphsInfo[g.code];
            if (info === undefined) {
                info = { width: 0, height: 0 };
            }
            return new SignDelegate(g, info.width, info.height);
        case 'lig':
            var info = glyphsInfo[g.aux.code];
            if (info === undefined) {
                info = { width: 0, height: 0 };
            }
            return new LigatureDelegate(g, info.width, info.height);
        case 'symbol':
            switch (g.code) {
                case "fullSpace":
                    return new SignDelegate(g, glyphsInfo["A1"].width, glyphsInfo["A1"].height);
                case "halfSpace":
                    return new SignDelegate(g, glyphsInfo["A1"].width / 2, glyphsInfo["A1"].height / 2);
                case "fullShade":
                    return new SignDelegate(g, glyphsInfo["A1"].width, glyphsInfo["A1"].height);
                case "[":
                    return new SignDelegate(g, glyphsInfo["A1"].width / 2, glyphsInfo["A1"].height);
                case "]":
                    return new SignDelegate(g, glyphsInfo["A1"].width / 2, glyphsInfo["A1"].height);
            }
        case 'space':
            return new SpaceDelegate(g);
    }
}
/**
 * Base class for layout.
 * An object of this class will be attached to each group.
 * @type type
 */
class LayoutDelegate {
    constructor(g, width, height) {
        this.group = g;
        this.inner = { width: width, height: height };
        this.scale = 1.0;
        this.origin = { x: 0, y: 0 };
    }

    /**
     * Backlink to the group.
     * @returns {unresolved}
     */
    getGroup() {
        return this.group;
    }

    /**
     * Return the original translation before drawing this sign.
     * Expressed in terms of the PARENT's coordinates system.
     * @returns {LayoutDelegate.origin}
     */
    getOrigin() {
        return this.origin;
    }

    setOrigin(x, y) {
        this.origin = { x: x, y: y };
    }

    /**
     * Returns the scale used to transform the inner coordinates into the parent coordinate system.
     * For instance, an element of inner height 1, with a scale of 2, will have an outer height of 2.
     * @returns {Number}
     */
    getScale() {
        return this.scale;
    }

    setScale(newScale) {
        this.scale = newScale;
    }

    getInnerGeometry() {
        return new SimpleRectangle(0, 0, this.inner.width, this.inner.height);
    }

    getOuterGeometry() {
        let w = this.inner.width * this.scale;
        let h = this.inner.height * this.scale;
        return new SimpleRectangle(this.origin.x,
            this.origin.y, w, h);
    }

    /**
     * position of first child.
     * (can be overiden) 
     * @returns {LayoutDelegate.nullFirstPos.mdcUtilsTerAnonym$12}
     */
    firstPos() {
        return { x: 0, y: 0 };
    }

    nextPos(currentPos, i) {
        throw new TypeError("write me (or error somewhere)");
    }

    /**
     * Update the layout information in a recursive way.
     * @returns {undefined}
     */
    deepPack() {
        let g = this.group;
        if (g.content) {
            g.content.forEach(c => c.layout.deepPack());
        }
        this.pack();
    }
    /**
     * update the layout information for this element  according 
     * to its current transform (i.e. scale) and its children content.
     * 
     * Normally, one would redefine packElement instead of this method.
     * @returns {undefined}
     */
    pack() {
        const g = this.group;
        let contentR = new LayoutRectangle();
        if (g.content && g.content.length > 0) {
            let currentPos = this.firstPos(); // computes the first position in g.
            for (var i = 0; i < g.content.length; i++) {
                let child = g.content[i];
                child.layout.pack();
                child.layout.setOrigin(currentPos.x, currentPos.y); // beware of data sharing !
                currentPos = this.nextPos(currentPos, i);
                contentR.add(child.layout.getOuterGeometry());
            }
        }
        // Finishes the packing. We
        // know the size of the content. 
        // now, we take into account the g element itself.
        // TODO: instead of height and width, we could 
        // pass the content's SHAPE.
        this.packElement(contentR);
    }

    /**
     * Packs the current element, knowing the size of its content.
     * @param {LayoutRectangle} childrenGeometry a description of the space needed for the children.
     */
    packElement(childrenGeometry) {
        this.inner = {
            width: childrenGeometry.getWidth(),
            height: childrenGeometry.getHeight()
        };
    }

    /**
     * Scale horizontal elements so that it's not wider than maxW.
     * @param {type} maxW
     * @param {type} maxH
     * @returns {undefined}
     */
    resizeHorizontally(maxW, maxH) {
        if (this.group.content) {
            this.group.content.forEach(c => c.layout.resizeHorizontally(maxW, maxH));
        }
        this.pack();
    }

    /**
     * Scale vertical elements so that it's not higher than maxH.
     * @param {type} maxW
     * @param {type} maxH
     * @returns {undefined}
     */
    resizeVertically(maxW, maxH) {
        if (this.group.content) {
            this.group.content.forEach(c => c.layout.resizeVertically(maxW, maxH));
        }
        this.pack();
    }

    /*
     * Changes spaces in elements so that they fill the available space.
     * 
     * @param {type} parentSize space available in the parent
     * @returns {undefined}
     */
    fixSpacing(parentSize) {
        if (this.group.content) {
            this.group.content.forEach(c => c.layout.fixSpacing(this.getInnerGeometry()));
        }
        // Normally not needed.
        // this.pack();
    }
}



class AbstractHorizontalDelegate extends LayoutDelegate {

    constructor(g, width, height) {
        super(g, width, height);
    }

    nextPos(currentPos, i) {
        let g = this.group.content[i];
        let geom = g.layout.getOuterGeometry();
        return {
            x: currentPos.x + geom.getWidth(),
            y: currentPos.y
        };
    }

}

class AbstractVerticalDelegate extends LayoutDelegate {
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

class LineDelegate extends AbstractHorizontalDelegate {
    constructor(g) {
        super(g, 0, 0);
    }
}

class CartoucheDelegate extends AbstractHorizontalDelegate {
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


class HorizontalDelegate extends AbstractHorizontalDelegate {
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

class SignDelegate extends LayoutDelegate {
    constructor(g, width, height) {
        super(g, width, height);
    }

    packElement(contentGeometry) {
        // Inner size does not depend on children (ok, there are no children).
    }
}

class LigatureDelegate extends LayoutDelegate {
    constructor(g, width, height) {
        super(g, width, height);
    }

    packElement(contentGeometry) {
        // Inner size does not depend on children (ok, there are no children).
    }
}

class SymbolDelegate extends LayoutDelegate {
    constructor(g, width, height) {
        super(g, width, height);
    }

    packElement(contentGeometry) {
        // Inner size does not depend on children (ok, there are no children).
    }
}

class VerticalDelegate extends AbstractVerticalDelegate {
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

// reminder : spaces:
// {type: 'space', minW: 0, minH: 1, growW: 0, growH: 1};
class SpaceDelegate extends LayoutDelegate {
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
    ;
}

