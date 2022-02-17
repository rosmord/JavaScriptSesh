# Technical notes

 
A note about the result:

We have decided to go for SVG as a rendering technique, as 
it will be more versatile in the end.

**TODO** 
attach to all MDC elements an *delegate* which will 
be in charge of all layout processing.

This will allow us to use inheritance when it's useful. 


## Vocabulary:

An element has two sets of geometrical infomations:
INNER informations, expressed in the internal system of the element.
`inner= {dim: {width: w, height: h}};` 
OUTER informations, which are expressed in the coordinate system of the PARENT element:
`outer= {origin: {x:x, y:y}, dim: {width: w, height: h}};`


packedSize
: the size of the elements, if we completely pack their content.


scale
: from inner to outer.

There could be a INNER origin. We don't know if it's relevant.


## Algorithm

* add spaces where needed
* pack
* scale for max WIDTH
* scale for max HEIGHT
* perform layout ???? (not sure it's needed).
* generate actual graphical representation.

the mdc structure will be decorated by the layout system.
to avoid messing things, all added information will go 
in a `_layout` field.

layout information will be stored in the (...) **(write this!!!)**

##  Strategy

We face a small problem here and there:
when rescaling, we may change the layout of an element.
Recomputing this layout is not that easy, in part because of spaces.

Instead of repetedly having to compute with those spaces, 
we have decided to represent them as elements.
there will be hspaces, vspaces and qspaces, with minimal sizes and
extensibility.

Except in the last pass of layout, we will consider them with their minimal 
extensibility. 


Difference between html layout and svg layout

html layout needs UNITS and uses different solutions:
a) positioning for 
