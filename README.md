Some tests and demos exploring behaviour of Chrome's dev tools timeline panel

## Memory

The DOM Node Count in the Memory panel lists two numbers, both of which
refer to created DOM nodes held in memory, regardless of whether they
have actually been inserted into the DOM. Creating elements via
document.createElement() and fragments via
document.createDocumentFragment() will both impact these numbers.

The first number seems to provide a sort of baseline: the second number
will never fall below the first number, but appears to increase with
creation of new DOM elements and decrease with GC.

## Caveat Developer

I am not a Google chrome developer, nor anything remotely resembling an
expert on garbage collectors or memory profiling. This work was borne
out of a practical need to fix performance issues with some Backbone.js
apps. Corrections, suggestions are most welcome.

## Random notes

It's best to do your debugging/testing when examining memory usage in
incognito mode as this will avoid recording of activity initated by
Chrome extensions (e.g. "timer was fired by Chrome-extension://...").

Over time, the number of DOM nodes, documents, event listeners recorded
in the memory panel will creep up, and won't go back down to what it
"should" be, even when refreshing the page. Opening the page in a new
tab or window seems to be the only thing that will reset these counts
back to their true value.

Make sure to have the option "glue asynchronous events to causese"
selected. This will provide greater detail on memory usage.

## How I got these numbers

- load page
- start recording
- reload 
  - sometimes manually run GC
- stop recording
- drag bars for the timeframe out to encompass the whole time period
  captured

"explicit DOM node count" is attained by

```
document.getElementsByTagName('*').length
```

## test 1

Just a static page.

- explicit DOM node count: 5
- DOM node count: 14-28
- document count: 1-1
- event listener count: 0-0
- sometimes will see GC event, about 200 KB GC'ed

## test 2

Same as test 1, but with some text inside a `P` element.

- explicit DOM node count: 6
- Chrome DOM node count: 17-34
- adding <p>some text</p> increases both numbers by 3
  - two P tags (open/close) plus textNode, presumably
- adding whitespace does nothing

## test 3

This test is redundant.

## test 4

Same as test 2, but adds `id` attribute to `P` element.

- same memory profile as test 2
- explicit DOM node count: 6
- Chrome DOM node count: 17-34

## test 5

Same as test 4, but adds a `SCRIPT` element, with some js that simply
access an element in the DOM and stores a reference to it in a temporary
global variable.

- explicit DOM node count: 7
- Chrome DOM node count: 20-40
  - increase of 3 with addition of `SCRIPT` element

## test 6

Create 10 `P` elements, but don't insert them into the DOM.

- explicit nodes: 7
- Chrome DOM node count: 30-60
  - demontrates that create elements add to Chrome's DOM node count
    despite not being in DOM.

### test 6a

Same as 6, but insert into DOM.

- explicit nodes: 17
- exact same memory profile as 6

### test 6b

Same as 6, but append the nodes to a documentFragment.
  - explicit DOM nodes: 7
  - Chrome DOM node count: 31-62
  - same profile as 6, but extra node for documentFragment
    - demonstrates that documentFragments not in DOM still contribute to
      Chrome's DOM node count.

### test 6c

Same as 6b, but add documentFragment to DOM.

- explicit DOM nodes: 17
- same profile as 6b

### test 6d

Same as 6c, but when inserting documentFragment into the DOM, call with
cloneNode(true). This is the syntax used by John Resig here:
http://ejohn.org/blog/dom-documentfragments/


- explicit DOM nodes: 17
- Chrome DOM node count: 41-83 (42)
  - 11 extra nodes vs. 6b, since we created a clone of the
    documentFragment, which means 10 child + 1 for fragment
  - manually running GC reduces DOM node count back to 41

### test 6e

Same as 6d, but wrap the js in an IIFE `(function() {}())`.

- explicit DOM nodes: 17
- Chrome DOM node count: 30-72 (42)
  - manually running GC reduces DOM node count back to 30
  - `frag` along with its clone, and all children are GC'ed. Similar
    profile to 6b, except there `frag` could not be GC'ed because it's a
global variable.
- one GC event with between .25 and .5 megs GC'ed

### test 6f

Use jQuery to append 10 `<p></p>` to `BODY` element.

- explicit DOM nodes: 18
- Chrome DOM node count: 34-133
  - manually running GC reduces DOM node count back to 34
- one GC event, with between 0.5 and 1.25 megs GC'ed

### test 6g

Same as 6f, but make multiple calls to $.append (usually a performance
no-no).

- explicit DOM nodes: 18
- Chrome DOM node count: 36-128
  - manually running GC reduces DOM count back to 36
- one GC event, with between 0.5 and 1.5 megs GC'ed

## test 8

This is a mini backbone app. Includes jQuery, underscore 1.4.3 and
Backbone 0.9.2. Basically just creates a collection, renders some views
with its models.

Here, Chrome's DOM node count runs up to to about 4x the # of DOM nodes
reported by explicit DOM node count.

- explicit DOM nodes: 517
- Chrome DOM node count: 1682-3677 (1995)
- no GC triggered
  - manual GC reduces DOM node count back down to 1682

### test 8a

Same as test 8, but call `render` twice on useresview, unnecessarily. 

- explicit DOM nodes: 517
- Chrome DOM node count: 1882-5782
  - GC event collects about 2.75 megs
  - additional manual GC results reduces Chrome DOM node count back down
    to 1882

