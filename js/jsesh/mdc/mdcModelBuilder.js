import mdcParser from "./mdcParser.js";

export {MDCModelBuilder}
/**
 * Parses a mdc String and returns a simple representation of its content.
 * @param {string} mdcString
 * @returns {undefined}
 **/

class MDCModelBuilder {
    buildMDCObject(mdcString) {
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

}