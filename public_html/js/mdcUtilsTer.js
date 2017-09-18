/* 
 * Library for basic manipulation of Manuel de Codage files.
 * Improved MdC Utils.
 * 
 * Use a queue to load graphical elements.
 * 
 * SVG display with rescaling and the like.
 * 
 * TODO : improve structure to embed everything nicely in a 
 * minimal number of functions...
 * 
 * Detail of processing:
 * A) treewalkers builds a specific objet representation of the text.
 * B) This representation is transformed into an element.
 */

var hieroglyphicSource = "images/glyphs";
var MDC_PREFERENCES = {
    smallHSpace: 2,
    smallVSpace: 2
};
var phoneticCodesMap = {
    "mSa": "A12",
    "xr": "A15",
    "Xrd": "A17",
    "sr": "A21",
    "mniw": "A33",
    "qiz": "A38",
    "iry": "A47",
    "Sps": "A50",
    "Spsi": "A51",
    "x": "Aa1",
    "Hp": "Aa5",
    "qn": "Aa8",
    "mAa": "Aa11",
    "M": "Aa15",
    "im": "Aa13",
    "gs": "Aa13",
    "sA": "Aa17",
    "apr": "Aa20",
    "wDa": "Aa21",
    "nD": "Aa27",
    "qd": "Aa28",
    "Xkr": "Aa30",
    "msi": "B3",
    "DHwty": "C3",
    "Xnmw": "C4",
    "inpw": "C6",
    "stX": "C7",
    "mnw": "C8",
    "mAat": "C10",
    "HH": "C11",
    "tp": "D1",
    "Hr": "D2",
    "Sny": "D3",
    "ir": "D4",
    "rmi": "D9",
    "wDAt": "D10",
    "fnD": "D19",
    "r": "D21",
    "rA": "D21",
    "spt": "D24",
    "spty": "D25",
    "mnD": "D27",
    "kA": "D28",
    "aHA": "D34",
    "a": "D36",
    "Dsr": "D45",
    "d": "D46",
    "Dba": "D50",
    "mt": "D52",
    "rd": "D56",
    "sbq": "D56",
    "gH": "D56",
    "gHs": "D56",
    "b": "D58",
    "ab": "D59",
    "wab": "D60",
    "sAH": "D61",
    "zzmt": "E6",
    "zAb": "E17",
    "mAi": "E22",
    "rw": "E23",
    "l": "E23",
    "Aby": "E24",
    "wn": "E34",
    "HAt": "F4",
    "SsA": "F5",
    "wsr": "F12",
    "wp": "F13",
    "db": "F16",
    "Hw": "F18",
    "bH": "F18",
    "ns": "F20",
    "idn": "F21",
    "msDr": "F21",
    "sDm": "F21",
    "DrD": "F21",
    "pH": "F22",
    "kfA": "F22",
    "xpS": "F23",
    "wHm": "F25",
    "Xn": "F26",
    "sti": "F29",
    "Sd": "F30",
    "ms": "F31",
    "X": "F32",
    "sd": "F33",
    "ib": "F34",
    "nfr": "F35",
    "zmA": "F36",
    "imAx": "F39",
    "Aw": "F40",
    "spr": "F42",
    "iwa": "F44",
    "isw": "F44",
    "pXr": "F46",
    "qAb": "F46",
    "A": "G1",
    "AA": "G2",
    "tyw": "G4",
    "mwt": "G14",
    "nbty": "G16",
    "m": "G17",
    "mm": "G18",
    "nH": "G21",
    "Db": "G22",
    "rxyt": "G23",
    "Ax": "G25",
    "dSr": "G27",
    "gm": "G28",
    "bA": "G29",
    "baHi": "G32",
    "aq": "G35",
    "wr": "G36",
    "gb": "G38",
    "zA": "G39",
    "pA": "G40",
    "xn": "G41",
    "wSA": "G42",
    "w": "G43",
    "ww": "G44",
    "mAw": "G46",
    "TA": "G47",
    "snD": "G54",
    "wSm": "H2",
    "pAq": "H3",
    "Sw": "H6",
    "aSA": "I1",
    "Styw": "I2",
    "mzH": "I3",
    "sbk": "I4",
    "sAq": "I5",
    "km": "I6",
    "Hfn": "I8",
    "f": "I9",
    "D": "I10",
    "DD": "I11",
    "in": "K1",
    "ad": "K3",
    "XA": "K4",
    "bz": "K5",
    "nSmt": "K6",
    "xpr": "L1",
    "bit": "L2",
    "srqt": "L7",
    "iAm": "M1",
    "Hn": "M2",
    "xt": "M3",
    "rnp": "M4",
    "tr": "M6",
    "SA": "M8",
    "zSn": "M9",
    "wdn": "M11",
    "xA": "M12",
    "wAD": "M13",
    "HA": "M16",
    "i": "M17",
    "ii": "M18",
    "sxt": "M20",
    "sm": "M21",
    "sw": "M23",
    "rsw": "M24",
    "Sma": "M26",
    "nDm": "M29",
    "bnr": "M30",
    "bdt": "M34",
    "Dr": "M36",
    "iz": "M40",
    "pt": "N1",
    "iAdt": "N4",
    "idt": "N4",
    "ra": "N5",
    "zw": "N5",
    "hrw": "N5",
    "Hnmmt": "N8",
    "pzD": "N9",
    "Abd": "N11",
    "iaH": "N11",
    "dwA": "N14",
    "sbA": "N14",
    "dwAt": "N15",
    "tA": "N16",
    "iw": "N18",
    "wDb": "N20",
    "spAt": "N24",
    "xAst": "N25",
    "Dw": "N26",
    "Axt": "N27",
    "xa": "N28",
    "q": "N29",
    "iAt": "N30",
    "n": "N35",
    "mw": "N35A",
    "S": "N37",
    "Sm": "N40",
    "id": "N42",
    "pr": "O1",
    "h": "O4",
    "Hwt": "O6",
    "aH": "O11",
    "wsxt": "O15",
    "kAr": "O18",
    "zH": "O22",
    "txn": "O25",
    "iwn": "O28",
    "aA": "O29",
    "zxnt": "O30",
    "z": "O34",
    "zb": "O35",
    "inb": "O36",
    "Szp": "O42",
    "ipt": "O45",
    "nxn": "O47",
    "niwt": "O49",
    "zp": "O50",
    "Snwt": "O51",
    "aAv": "O29v",
    "wHa": "P4",
    "TAw": "P5",
    "nfw": "P5",
    "aHa": "P6",
    "xrw": "P8",
    "st": "Q1",
    "wz": "Q2",
    "p": "Q3",
    "qrsw": "Q6",
    "qrs": "Q6",
    "xAwt": "R1",
    "xAt": "R1",
    "Htp": "R4",
    "kAp": "R5",
    "kp": "R5",
    "snTr": "R7",
    "nTr": "R8",
    "bd": "R9",
    "dd": "R11",
    "Dd": "R11",
    "imnt": "R14",
    "iAb": "R15",
    "wx": "R16",
    "xm": "R22",
    "HDt": "S1",
    "N": "S3",
    "dSrt": "S3",
    "sxmty": "S6",
    "xprS": "S7",
    "Atf": "S8",
    "Swty": "S9",
    "mDH": "S10",
    "wsx": "S11",
    "nbw": "S12",
    "tHn": "S15",
    "THn": "S15",
    "mnit": "S18",
    "sDAw": "S19",
    "xtm": "S20",
    "sT": "S22",
    "dmD": "S23",
    "Tz": "S24",
    "Sndyt": "S26",
    "mnxt": "S27",
    "s": "S29",
    "sf": "S30",
    "siA": "S32",
    "Tb": "S33",
    "anx": "S34",
    "Swt": "S35",
    "xw": "S37",
    "HqA": "S38",
    "awt": "S39",
    "wAs": "S40",
    "Dam": "S41",
    "abA": "S42",
    "sxm": "S42",
    "xrp": "S42",
    "md": "S43",
    "Ams": "S44",
    "nxxw": "S45",
    "HD": "T3",
    "HDD": "T6",
    "pd": "T9",
    "pD": "T10",
    "zin": "T11",
    "zwn": "T11",
    "sXr": "T11",
    "Ai": "T12",
    "Ar": "T12",
    "rwd": "T12",
    "rwD": "T12",
    "rs": "T13",
    "qmA": "T14",
    "wrrt": "T17",
    "Sms": "T18",
    "qs": "T19",
    "wa": "T21",
    "sn": "T22",
    "iH": "T24",
    "DbA": "T25",
    "Xr": "T28",
    "nmt": "T29",
    "sSm": "T31",
    "nm": "T34",
    "mA": "U1",
    "mr": "U6",
    "it": "U10",
    "HqAt": "U11",
    "hb": "U13",
    "Sna": "U13",
    "tm": "U15",
    "biA": "U16",
    "grg": "U17",
    "stp": "U21",
    "mnx": "U22",
    "Ab": "U23",
    "Hmt": "U24",
    "wbA": "U26",
    "DA": "U28",
    "rtH": "U31",
    "zmn": "U32",
    "ti": "U33",
    "xsf": "U34",
    "Hm": "U36",
    "mxAt": "U38",
    "St": "V1",
    "Snt": "V1",
    "100": "V1",
    "sTA": "V2",
    "sTAw": "V3",
    "wA": "V4",
    "snT": "V5",
    "Sn": "V7",
    "arq": "V12",
    "T": "V13",
    "iTi": "V15",
    "mDt": "V19",
    "XAr": "V19",
    "TmA": "V19",
    "10": "V20",
    "mD": "V20",
    "mH": "V22",
    "wD": "V24",
    "aD": "V26",
    "H": "V28",
    "wAH": "V29",
    "sk": "V29",
    "nb": "V30",
    "k": "V31",
    "msn": "V32",
    "sSr": "V33",
    "idr": "V37",
    "bAs": "W2",
    "Hb": "W3",
    "Xnm": "W9",
    "iab": "W10",
    "g": "W11",
    "nst": "W11",
    "Hz": "W14",
    "xnt": "W17",
    "mi": "W19",
    "Hnqt": "W22",
    "nw": "W24",
    "ini": "W25",
    "t": "X1",
    "rdi": "X8",
    "di": "X8",
    "mDAt": "Y1",
    "zS": "Y3",
    "mnhd": "Y3",
    "mn": "Y5",
    "ibA": "Y6",
    "zSSt": "Y8",
    "1": "Z1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "20": "20",
    "30": "30",
    "40": "40",
    "50": "50",
    "200": "200",
    "300": "300",
    "400": "400",
    "500": "500",
    "y": "Z4",
    "W": "Z7",
    "imi": "Z11",
    "wnm": "Z11",
    "`": "Ff1",
    "nr": "H4",
    "R": "D153",
    "K": "S56"
};


var glyphsInfo = {};
//*******************************************************************
//                   Rendering engine.
// A note about the result:
// We have decided to go for SVG as a rendering technique, as 
// it will be more versatile in the end.
// 
// TODO :
//  attach to all MDC elements an *delegate* which will 
//  be in charge of all layout processing.
//  
// This will allow us to use inheritance when it's usefull. 
// 
// 
// Vocabulary:
// packedSize: the size of the elements,
//  if we completely pack their content.
// 
// An element has two sets of geometrical infomations:
// INNER informations, expressed in the internal system of the element.
// inner= {dim: {width: w, height: h}}; 
// OUTER informations, which are expressed in the coordinate system of the PARENT element:
// outer= {origin: {x:x, y:y}, dim: {width: w, height: h}};
// scale: from inner to outer.
// 
// There could be a INNER origin. We don't know if it's relevant.
// 
// 
// Algorithm :
// * add spaces where needed
// * pack
// * scale for max WIDTH
// * scale for max HEIGHT
// * perform layout ???? (not sure it's needed).
// * generate actual graphical representation.
// 
// the mdc structure will be decorated by the layout system.
// to avoid messing things, all added information will go 
// in a _layout field.
// 
// layout information will be stored in the
// Strategy: we face a small problem here and there:
// when rescaling, we may change the layout of an element.
// Recomputing this layout is not that easy, in part because of spaces.
// 
// Instead of repetedly having to compute with those spaces, 
// we have decided to represent them as elements.
// there will be hspaces, vspaces and qspaces, with minimal sizes and
// extensibility.
// 
// Except in the last pass of layout, we will consider them with their minimal 
// extensibility. 
// 
// 
// Difference between html layout and svg layout
// 
// html layout needs UNITS and uses different solutions:
// a) positioning for 
//*******************************************************************

/**
 * A basic rectangle.
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


/**
 * Base class for layout.
 * An object of this class will be attached to each group.
 * @type type
 */
class LayoutDelegate {
    constructor(g, width, height) {
        this.group = g;
        this.inner = {width: width, height: height};
        this.scale = 1.0;
        this.origin = {x: 0, y: 0};
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
        this.origin = {x: x, y: y};
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
        return {x: 0, y: 0};
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
     * Does not pack the children. This method can be called after some modifications
     * on an element to update its packing.
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



class AbstractHorizontalDelegate extends  LayoutDelegate {

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

class AbstractVerticalDelegate extends  LayoutDelegate {
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



function layoutFactory(glyphsInfo, g) {
    switch (g.type) {
        case 'v':
            return new VerticalDelegate(g);
        case 'l':
            return new LineDelegate(g);
        case 'h':
            return new HorizontalDelegate(g);
        case 's':
            var info = glyphsInfo[g.code];
            if (info === undefined) {
                info = {width: 0, height: 0};
            }
            return new SignDelegate(g, info.width, info.height);
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

function renderMdcObjectInto(mdcObject, targetElt, options) {

    /**
     * Applies functions to the various elements in a mdcObject.
     * The functions are stored in a map, which links the type of 
     * the object to the function to call. 
     * if the type is absent from the map, no function is called.
     * If a function returns the string "prune", the children of the element
     * won't be examined.
     * @param {type} funcMap
     * @param {type} mdcObject
     * @returns {undefined}
     */
    function doOn(funcMap, mdcObject) {
        toCall = funcMap[mdcObject.type];
        if (toCall) {
            prune= toCall(mdcObject);
        }
        if (prune !== "prune" && mdcObject.content) {
            mdcObject.content.forEach(
                    (child) => doOn(funcMap, child));

        }
    }

    /**
     * perform a certain operation on all signs in a mdcObject.
     * @param {type} f the function to call (mdcObject => Unit)
     * @param {type} m the mdcObject.
     * @returns {undefined}
     */
    function doOnGlyphs(f, m) {
        switch (m.type) {
            case 'lig':
                break;
            case 's':
                f(m);
                break;
            default:
                if (m.content)
                    m.content.forEach(
                            (child) => doOnGlyphs(f, child));
        }
    }


    /**
     * Normalize all codes in a mdcObject by using Gardiner codes when possible.
     * @param {type} mdcObject
     * @returns {undefined}
     */
    function normalizeCodes(mdcObject) {
        function toGardiner(sign) {
            sign.code = phoneticCodesMap[sign.code] || sign.code;
        }
        
        return doOn({'s': toGardiner }, mdcObject);
    }

    /**
     * Extract glyphs codes from the object
     * @param {type} mdcObject
     * @returns {Array} an array of codes (strings)
     */
    function extractGlyphsCodes(mdcObject) {
        var codes = {A1: true};
        doOnGlyphs(
                (m) => codes[m.code] = true,
                mdcObject
                );
        return Object.keys(codes);
    }

    /**
     * Returns a promise to load all signs informations.
     * Processing should be done depending on this promise.
     * @param {type} codes
     * @returns {Promise}
     */
    function preloadGlyphs(codes) {
        function signSize(code) {
            if (glyphsInfo[code]) {
                return;
            } else {
                return new Promise(function (resolve, reject) {
                    var elt = document.createElement("img");
                    elt.onload = function () {
                        resolve(
                                {
                                    code: code,
                                    width: elt.naturalWidth,
                                    height: elt.naturalHeight
                                });
                    };
                    elt.src = "images/glyphs/" + code + ".svg";
                });
            }
        }
        return Promise.all(codes.map(s => signSize(s)))
                .then(info => {
                    info.forEach(s => {
                        glyphsInfo[s.code] = s;
                    });
                    return glyphsInfo;
                });
    }

    /**
     * Performs the layout of a mdcGroup.
     * Will *decorate* the mdcGroup object by adding layout information to each group.
     * @param {type} glyphsInfo
     * @param {type} mdcGroup
     * @returns {unresolved} Unit
     */
    function layoutMdcGroup(glyphsInfo, mdcGroup) {
        var maxQuadrantHeight = glyphsInfo["A1"].height * 1.001;
        var maxQuadrantWidth = glyphsInfo["A1"].width * 1.3;

        /**
         * Recursively add basic layout information to g.
         * This information is kept in three places :
         * ._inner : inner data, expressed in the reference system of g
         * ._outer : outer data, expressed in the reference system of g's parent
         * Informations for transforming from inner to outer are kept in ._transform.
         * @param {type} g
         * @returns {undefined}
         */
        function decorateElement(g) {
            g.layout = layoutFactory(glyphsInfo, g);
            if (g.content) {
                g.content.forEach(child => decorateElement(child));
            }
        }

        /**
         * Add spaces to an element according to its characteristics.
         * 
         * QUESTION: use one type of space, or hspace, vspace, and space ?
         * @param {type} g
         * @returns {undefined}
         */

        function addSpaces(g) {
            // Recursive call (done first, no need to try to add spaces in spaces)
            if (g.content) {
                g.content.forEach((c) => addSpaces(c));
            }
            // we want each space to be a **different object**.
            // (well, we might try to share spaces in a given environment, 
            // but it would be too tricky in the long run).            
            function buildHSpace() {
                return {type: 'space', minW: 1, minH: 0, growW: 1, growH: 0};
            }
            function buildVSpace() {
                return {type: 'space', minW: 0, minH: 1, growW: 0, growH: 1};
            }
            function buildFillVSpace() {
                return {type: 'space', minW: 0, minH: 0, growW: 0, growH: 1};
            }
            // Setup
            // decide where spaces go
            // decide the type of spaces
            let hasStartSpace = false;
            let hasEndSpace = false;
            let hasInnerSpace = true;
            let outerSpaceFactory = undefined;
            let innerSpaceFactory = undefined;
            // a) decide about the type of spaces (if any)
            switch (g.type) {
                case 'l':
                    innerSpaceFactory = buildHSpace;
                    break;
                case 'h':
                    innerSpaceFactory = buildHSpace;
                    outerSpaceFactory = buildHSpace;
                    break;
                case 'v':
                    innerSpaceFactory = buildVSpace;
                    outerSpaceFactory = buildFillVSpace;
                    break;
                default:
                    break;
            }
            // b) decide about their positions
            switch (g.type) {
                case 'l':
                    // default is ok.
                    break;
                case 'h':
                    if (g.content.length === 1) {
                        hasStartSpace = hasEndSpace = true; // center
                        hasInnerSpace = false;
                    } // else default is ok.
                    break;
                case 'v':
                    if (g.content.length === 1) {
                        hasStartSpace = hasEndSpace = true; // center
                        hasInnerSpace = false;
                    } // else default is ok.
                    break;
                case 's':
                    hasStartSpace = false;
                    hasEndSpace = false;
                    hasInnerSpace = false;
                    break;
                case 'symbol':
                    hasStartSpace = hasEndSpace = false;
                    hasInnerSpace = false;
                default:
                    hasInnerSpace = false;
                    break;
            }
            if (hasInnerSpace && g.content.length > 1) {
                oldContent = g.content;
                g.content = [oldContent[0]];
                for (var i = 1; i < oldContent.length; i++) {
                    g.content.push(innerSpaceFactory());
                    g.content.push(oldContent[i]);
                }
            }
            if (hasStartSpace) {
                g.content.unshift(outerSpaceFactory());
            }
            if (hasEndSpace) {
                g.content.push(outerSpaceFactory());
            }
        }


        addSpaces(mdcGroup);

        decorateElement(mdcGroup);

        mdcGroup.layout.deepPack();

        mdcGroup.layout.resizeHorizontally(maxQuadrantWidth, maxQuadrantHeight);

        mdcGroup.layout.resizeVertically(maxQuadrantWidth, maxQuadrantHeight);

        mdcGroup.layout.fixSpacing(mdcGroup.layout.getInnerGeometry());
        return mdcGroup;
    }

    /**
     * Create and return an element displaying g.
     * @param {type} g
     * @returns {undefined}
     */
    function createDisplay(g) {
        console.log("ICI !!!!");
        const SVG_NS = "http://www.w3.org/2000/svg";
        const XLINK_NS = "http://www.w3.org/1999/xlink";
        // Auxiliary function for element creation.
        function createElement(tag, attributes) {
            const res = document.createElementNS(SVG_NS, tag);
            for (var key in attributes) {
                var val = attributes[key];
                if (key === "href") {
                    res.setAttributeNS(XLINK_NS, key, val);
                } else if (key === "xmlns") {
                    res.setAttribute(key, val);
                } else {
                    res.setAttributeNS(null, key, val);
                }
            }
            return res;
        }


        let globalGeom = g.layout.getOuterGeometry();

        const svgRoot = createElement("svg", {
            viewBox: "0 0 " + (globalGeom.getWidth() + 2) + " " + (globalGeom.getHeight() + 2),
            width: (globalGeom.getWidth() + 2) * globalScale,
            height: (globalGeom.getHeight() + 2) * globalScale,
            xmlns: SVG_NS
        });
        /**
         * Perform a transformation.
         * action is a function which takes an empty transform,
         * and sets it to the desired transform.
         * @param {type} elt the element to transform
         * @param {type} action takes an empty transform as parameter.
         * @returns {undefined} nothing.
         */
        function doTransformAux(elt, action) {
            const base = elt.transform.baseVal;
            var transform = svgRoot.createSVGTransform();
            action(transform);
            base.appendItem(transform);
        }

        function rotate(elt, angle) {
            doTransformAux(elt, base => base.setRotate(angle, 0, 0));
        }

        function translate(elt, x, y) {
            doTransformAux(elt, base => base.setTranslate(x, y));
        }

        function scale(elt, scale) {
            doTransformAux(elt, base => base.setScale(scale, scale));
        }


        /**
         * Creates and return an element (or null if none is to be created).
         * @param {type} g
         * @returns {Element|renderMdcObjectInto.createDisplay.createElement.res|renderMdcObjectInto.createDisplay.createDisplayAux.res}
         */
        function createDisplayAux(g) {
            var res;
            switch (g.type) {
                case 'space':
                    return null;
                case 's':
                    {
                        url = "images/glyphs/" + g.code + ".svg";
                        // Note : in svg 1.1, width and height are mandatory.
                        // in svg 1.2, not. 
                        // Chrome can work without width and height, not safari 
                        // or Firefox.
                        res = createElement("image", {
                            href: url,
                            width: g.layout.inner.width,
                            height: g.layout.inner.height
                        });
                    }
                    break;
                case "symbol":
                    switch (g.code) {
                        case "[":
                            points = [g.layout.inner.width - 1, 1,
                                1, 1,
                                1, g.layout.inner.height - 1,
                                g.layout.inner.width - 1, g.layout.inner.height - 1
                            ];
                            res = createElement("polyline", {
                                points: points.join(" "),
                                width: g.layout.inner.width,
                                height: g.layout.inner.height,
                                style: "fill: none;stroke:black;stroke-width:1"
                            });
                            break;
                        case "]":
                            points = [1, 1, g.layout.inner.width - 1, 1,
                                g.layout.inner.width - 1, g.layout.inner.height - 1,
                                1, g.layout.inner.height - 1
                            ];
                            res = createElement("polyline", {
                                points: points.join(" "),
                                width: g.layout.inner.width,
                                height: g.layout.inner.height,
                                style: "fill: none;stroke:black;stroke-width:1"
                            });
                            break;
                        case "fullShade":
                            res = createElement("rect", {
                                width: g.layout.inner.width,
                                height: g.layout.inner.height,
                                style: "fill:rgb(100,100,100)"
                            });
                            break;
                        default:
                            return null;
                    }
                    break;
                default:
                    {
                        var res = createElement("g", {});
                        if (g.content) {
                            for (var i = 0; i < g.content.length; i++) {
                                var childElt = createDisplayAux(g.content[i]);
                                if (childElt)
                                    res.appendChild(childElt);
                            }
                        }
                    }
                    break;
            }
            let origin = g.layout.getOrigin();
            translate(res, origin.x, origin.y);
            scale(res, g.layout.getScale());
            return res;
        }
        // Clear current content
        while (targetElt.firstChild) {
            targetElt.removeChild(targetElt.firstChild);
        }
        var newChild = createDisplayAux(g);
        if (newChild) {
            svgRoot.appendChild(newChild);
        }
        targetElt.appendChild(svgRoot);
    }

    if (options === undefined) {
        options = {};
    }
    let globalScale = parseFloat(options["scale"] || "1");
    normalizeCodes(mdcObject);
    preloadGlyphs(extractGlyphsCodes(mdcObject)).then(
            glyphsInfo => layoutMdcGroup(glyphsInfo, mdcObject)
    ).then(decoratedObject => createDisplay(decoratedObject));
}




/**
 * Parses a mdc String and returns a simple representation of its content.
 * You need to import mdcParser.js first.
 * @param {type} mdcString
 * @returns {undefined} */

function buildMDCObject(mdcString) {
    // aux function used by most groups.
    function buildGroup(type, tree) {
        l = tree.content.map(c => buildMdc(c));
        return {type: type, content: l};
    }

    function buildMdc(tree) {
        if (!tree.type)
            throw "missing code";
        switch (tree.type) {
            case 'text':
                return buildGroup('l', tree);
                break;
            case "quadrant":
                return buildGroup('v', tree);
                break;
            case "hbox":
                return buildGroup('h', tree);
                break;
            case "subQuadrant":
                return buildGroup('v', tree);
                break;
            case 'glyphCode':
                var code = tree.value;
                return {type: 's', code: code};
                break;
            case 'ligature':
                return {
                    type: 'lig',
                    content: tree.content.map(c => buildMdc(c))
                };
            case 'symbol':
                switch (tree.value) {
                    case '..':
                        return {type: 'symbol', code: "fullSpace"};
                        break;
                    case '.':
                        return {type: 'symbol', code: "halfSpace"};
                        break;
                    case '//':
                        return {type: 'symbol', code: "fullShade"};
                        break;
                    case '[[':
                        return {type: 'symbol', code: "["};
                        break;
                    case ']]':
                        return {type: 'symbol', code: "]"};
                        break;
                    default:
                        throw "unknown code";
                }
                break;
            default:
                throw "unknown code";
        }
    }
    let r = mdcParser.parse(mdcString);
    return buildMdc(r);
}

/*
 * Replace the text content of an element (div for instance) 
 * with the corresponding hieroglyphs.
 * <p> Will mark element with an additional class, hieroglyphs-processed,
 * which can be used to avoid processing the data twice.
 * @param {Element} elt the HTML DOM element containing the text.
 * @param {type} options
 * @returns {undefined} */
function replaceTextWithHieroglyphs(elt, options) {
    let g = buildMDCObject(elt.textContent);
    console.log(JSON.stringify(g));
    renderMdcObjectInto(g, elt, options);
}