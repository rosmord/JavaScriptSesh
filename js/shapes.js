export {
    SimpleRectangle, 
    LayoutRectangle
}

/**
 * A basic rectangle, used in computations.
 * @type type
 */
 class SimpleRectangle {
    constructor(x, y, width, height) {
        this.minX = x;
        this.minY = y;
        this.maxX = x + width;
        this.maxY = y + height;
    }

    getMinX() {
        return this.minX;
    }

    getMinY() {
        return this.minY;
    }

    getMaxX() {
        return this.maxX;
    }

    getMaxY() {
        return this.maxY;
    }

    getWidth() {
        return this.maxX - this.minX;
    }

    getHeight() {
        return this.maxY - this.minY;
    }
}

/**
 * A representation of a rectangular zone which can be extended by adding elements.
 * The zone can also be empty, in which case it has no coordinates at all.
 * @type type
 */
class LayoutRectangle {

    constructor(firstRect) {
        if (firstRect !== undefined) {
            this.add(firstRect);
        }

    }

    isEmpty() {
        return this.minX === undefined;
    }

    getMinX() {
        return this.minX;
    }

    getMinY() {
        return this.minY;
    }

    getMaxX() {
        return this.maxX;
    }

    getMaxY() {
        return this.maxY;
    }

    getHeight() {
        return this.maxY - this.minY;
    }

    getWidth() {
        return this.maxX - this.minX;
    }

    /**
     * Adds a rectangle (with a x,y and width, height data).
     * @param {type} rect
     * @returns {undefined}
     */
    add(rect) {
        if (this.isEmpty()) {
            this.minX = rect.getMinX();
            this.minY = rect.getMinY();
            this.maxX = rect.getMaxX();
            this.maxY = rect.getMaxY();
        } else {
            if (this.minX > rect.getMinX()) {
                this.minX = rect.getMinX();
            }
            if (this.minY > rect.getMinY()) {
                this.minY = rect.getMinY();
            }
            if (this.maxX < rect.getMaxX()) {
                this.maxX = rect.getMaxX();
            }
            if (this.maxY < rect.getMaxY()) {
                this.maxY = rect.getMaxY();
            }
        }
    }

}
