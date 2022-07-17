/* 
 * Public API of the library for basic manipulation of Manuel de Codage files.
 * 
 * Detail of processing:
 * A) treewalkers builds a specific objet representation of the text.
 * B) This representation is transformed into an element.
 */

// TODO : make the following code into OO code.

import mdcParser from "./mdcParser.js";
import { phoneticCodesMap } from "./phonetic-codes-map.js";
import { layoutFactory } from "./layout/layout.js";

export { replaceTextWithHieroglyphs };

let hieroglyphicSource = "images/glyphs";

let MDC_PREFERENCES = {
    smallHSpace: 2,
    smallVSpace: 2
};

let glyphsInfo = {};

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
        let prune = undefined;
        let toCall = funcMap[mdcObject.type];
        if (toCall) {
            prune = toCall(mdcObject);
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

        // TODO : create 
        function normalizeLig(lig) {
            lig.aux = {
                code: lig.signs.map(s =>
                    phoneticCodesMap[s.code] || s.code
                ).join("_")
            };
            console.log(lig);
        }

        return doOn({ 's': toGardiner, 'lig': normalizeLig }, mdcObject);
    }

    /**
     * Extract glyphs codes from the object
     * @param {type} mdcObject
     * @returns {Array} an array of codes (strings)
     */
    function extractGlyphsCodes(mdcObject) {
        let codes = {};
        doOn({
            's': (m) => codes[m.code] = true,
            'lig': (l) => { codes[l.aux.code] = true; return 'prune'; }
        },
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
                    elt.src = hieroglyphicSource + "/" + code + ".svg";
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
                return { type: 'space', minW: 1, minH: 0, growW: 1, growH: 0 };
            }
            function buildVSpace() {
                return { type: 'space', minW: 0, minH: 1, growW: 0, growH: 1 };
            }
            function buildFillVSpace() {
                return { type: 'space', minW: 0, minH: 0, growW: 0, growH: 1 };
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
                let oldContent = g.content;
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


        function drawCartoucheAround(group) {

            var frame = createElement("svg:path", {
                //width: g.layout.inner.width,
                //height: g.layout.inner.height,
                //d: "m 0,-3 " +  g.layout.inner.width + ", 0",
                d: "M 0,-4 h " + group.layout.inner.width  // top horizontal line
                    + " c 10,0 10," + (group.layout.inner.height + 8) + " 0," + (group.layout.inner.height + 8)
                    + " h -" + group.layout.inner.width
                    + " c -10, 0" + " -10," + -(group.layout.inner.height + 8) + " 0," + -(group.layout.inner.height + 8)
                    + " Z "
                    + "M " + (group.layout.inner.width + 8) + ",-4"
                    + " v " + (group.layout.inner.height + 8)
                ,

                style: "fill: none; color:#000000;stroke:#000000;stroke-width:1"
            });
            return frame;
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
                case 'lig': {
                    let url = hieroglyphicSource + "/" + g.aux.code + ".svg";
                    res = createElement("image", {
                        href: url,
                        width: g.layout.inner.width,
                        height: g.layout.inner.height
                    });
                }
                    break;
                case 's':
                    {
                        let url = hieroglyphicSource + "/" + g.code + ".svg";
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
                        case "[": {
                            let points = [g.layout.inner.width - 1, 1,
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
                        }
                            break;
                        case "]":
                            let points = [1, 1, g.layout.inner.width - 1, 1,
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
                // In fact, we should have a much simpler rendering system : 
                // cartouches would add a kind of frame...
                case 'cartouche':
                    var res = createElement("g", {});
                    res.appendChild(drawCartoucheAround(g));
                    break;
                default:
                    {
                        var res = createElement("g", {});
                    }
                    break;
            }
            if (res && g.content) {
                for (var i = 0; i < g.content.length; i++) {
                    var childElt = createDisplayAux(g.content[i]);
                    if (childElt)
                        res.appendChild(childElt);
                }
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
    let codeSet = extractGlyphsCodes(mdcObject)
    codeSet.push("A1") // A1 must be known to compute line height. currently codeSet is a list...
    console.log(codeSet)
    preloadGlyphs(codeSet).then(
        info => layoutMdcGroup(info, mdcObject)
    ).then(decoratedObject => createDisplay(decoratedObject));
}




/**
 * Parses a mdc String and returns a simple representation of its content.
 * You need to import mdcParser.js first.
 * @param {string} mdcString
 * @returns {undefined}
 **/

function buildMDCObject(mdcString) {
    // aux function used by most groups.
    function buildGroup(type, tree) {
        let l = tree.content.map(c => buildMdc(c));
        return { type: type, content: l };
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
            case 'box':
                return buildGroup('cartouche', tree);
            case 'glyphCode':
                var code = tree.value;
                return { type: 's', code: code };
                break;
            case 'ligature':
                // Note: for 'ligature', we don't produce a content,
                // as the children of the ligature are quite specific - and completely
                // handled by the ligature itself.
                return {
                    type: 'lig',
                    signs: tree.content.map(c => buildMdc(c))
                };
            case 'symbol':
                switch (tree.value) {
                    case '..':
                        return { type: 'symbol', code: "fullSpace" };
                        break;
                    case '.':
                        return { type: 'symbol', code: "halfSpace" };
                        break;
                    case '//':
                        return { type: 'symbol', code: "fullShade" };
                        break;
                    case '[[':
                        return { type: 'symbol', code: "[" };
                        break;
                    case ']]':
                        return { type: 'symbol', code: "]" };
                        break;
                    default:
                        throw "unknown code " + tree.value;
                }
                break;
            default:
                throw "unknown code " + tree.value;
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


