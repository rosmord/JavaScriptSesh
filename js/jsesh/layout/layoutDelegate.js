/** 
 * Base class for layout.
 * An object of this class will be attached to each group.
 * @type type
 */

import {LayoutRectangle, SimpleRectangle} from './shapes'

 export default class layoutDelegate {
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

