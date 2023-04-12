/*
    The following Javascript code will search for all elements with class .hieroglyphic-text,
    consider their content as Manuel de codage, and replace it with the proper hieroglyphic text.
*/

import { JSeshRenderer } from "./js/jsesh/jsesh";

const jseshRenderer = new JSeshRenderer()

function replaceAllGlyphs() {
    document.querySelectorAll(".hieroglyphic-text").forEach(
        function (elt) {
            try {
                jseshRenderer.replaceTextWithHieroglyphs(elt, { scale: 1.5 });
            } catch (e) {
                console.log(e);
            }
        }
    );
}
replaceAllGlyphs();
