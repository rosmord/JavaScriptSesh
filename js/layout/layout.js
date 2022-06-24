/**
 * Classes dealing with glyphs layout.
 * Not part of the public API.
 */

export {
    layoutFactory, LayoutDelegate
};

import LayoutDelegate from './layoutDelegate.js';
import VerticalDelegate from './verticalDelegate.js';
import LineDelegate from './lineDelegate.js';
import HorizontalDelegate from './horizontalDelegate.js'
import CartoucheDelegate from './cartoucheDelegate.js'
import SignDelegate from './signDelegate.js'
import SpaceDelegate from './spaceDelegate.js'
import LigatureDelegate from './ligatureDelegate.js'

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



