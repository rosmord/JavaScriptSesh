# JavascriptSesh

**JavascriptSesh** is a simple Javascript library for allowing web site
creators to include hieroglyphic texts in their sites.

It's not (yet) a replacement for JSesh (it will be less powerful for a
while, and won't have copy/paste facilities for instance).

A number of similar projects already exist (I know of one for the
"[dedechampo]()" web site), and I am fully open to cooperation.

This project might also be an occasion to provide a simpler version of
the Manuel de Codage (maybe taking ideas from [RES]()), in order to have
something simple to parse.

In this respect, it might also inspire the next version of the MdC
supported by JSesh (note that JSesh will *always* support old files).

The library is ALPHA code. Well, even that is a big word. The Javascript code should be modularized, for instance, and a proper way to configure it should be given. Some steps have been taken in this direction, yet.

The display layout is ugly. I need to improve it a lot (scaling and placing signs, for instance).

However it's usable for simple things, and better than nothing.

As it's relatively unobtrusive, it will not be too difficult to replace it with more advanced versions later.

## Documentation

### Use with Ajax

Note: if your web site use Ajax, the demo example won't work fully. The reason is that, in the example,
the text in the page is transformed when the page is loaded ($(document).ready(....)).

With Ajax, new hieroglyphic texts can appear after that. 

A solution, which will work on recent browsers, is to use MutationObserver. The final script becomes:

        <script>
            // expand hieroglyphic text
            // move this code if useful...
            function replaceAllGlyphs() {
                $(".hieroglyphic-text").not(".hieroglyphs-processed").each(
                        function (i, elt) {
                            try {
                                replaceTextWithHieroglyphs(elt);
                                $(elt).addClass("hieroglyphs-processed");
                            } catch (e) {
                                //alert(e);
                            }
                        }
                )
            }
            $(document).ready(
                    replaceAllGlyphs
                    );
            // from http://stackoverflow.com/questions/2844565/is-there-a-jquery-dom-change-listener
            MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            var observer = new MutationObserver(function (mutations, observer) {
                replaceAllGlyphs();
                // fired when a mutation occurs
                console.log(mutations, observer);
            });

            observer.observe(document, {
                subtree: true,
                attributes: true
                        //...
            });

        </script>



