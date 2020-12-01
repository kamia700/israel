
/* eslint-disable */
/*stylelint-disable*/
'use strict';

// svgforeverybody;
(function () {
  !function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    module.exports = factory() : root.svg4everybody = factory();
  }(this, function() {
    function embed(parent, svg, target, use) {
        if (target) {
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            viewBox && svg.setAttribute("viewBox", viewBox);
            for (// clone the target
            var clone = document.importNode ? document.importNode(target, !0) : target.cloneNode(!0), g = document.createElementNS(svg.namespaceURI || "http://www.w3.org/2000/svg", "g"); clone.childNodes.length; ) {
                g.appendChild(clone.firstChild);
            }
            if (use) {
                for (var i = 0; use.attributes.length > i; i++) {
                    var attr = use.attributes[i];
                    "xlink:href" !== attr.name && "href" !== attr.name && g.setAttribute(attr.name, attr.value);
                }
            }
            fragment.appendChild(g), // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr, use) {
        xhr.onreadystatechange = function() {
            if (4 === xhr.readyState) {
                var cachedDocument = xhr._cachedDocument;
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""),
                cachedDocument.body.innerHTML = xhr.responseText, // ensure domains are the same, otherwise we'll have issues appending the
                cachedDocument.domain !== document.domain && (cachedDocument.domain = document.domain),
                xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
                    // embed the target into the svg
                    embed(item.parent, item.svg, target, use);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            if (numberOfSvgUseElementsToBypass && uses.length - numberOfSvgUseElementsToBypass <= 0) {
                return void requestAnimationFrame(oninterval, 67);
            }
            numberOfSvgUseElementsToBypass = 0;
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
                if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)),
                svg && src) {
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(),
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr, use);
                            } else {
                                embed(parent, svg, document.getElementById(id), use);
                            }
                        } else {
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    ++index;
                }
            }
            requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
        return svg;
    }
    return svg4everybody;
  });
});

// picturefill
(function () {
  /*! picturefill - v3.0.2 - 2016-02-12
  * https://scottjehl.github.io/picturefill/
  * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
  */
  (function (window) {
    var ua = navigator.userAgent;

    if (window.HTMLPictureElement && ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 < 45)) {
      addEventListener("resize", (function () {
        var timer;

        var dummySrc = document.createElement("source");

        var fixRespimg = function (img) {
          var source, sizes;
          var picture = img.parentNode;

          if (picture.nodeName.toUpperCase() === "PICTURE") {
            source = dummySrc.cloneNode();

            picture.insertBefore(source, picture.firstElementChild);
            setTimeout(function () {
              picture.removeChild(source);
            });
          } else if (!img._pfLastSize || img.offsetWidth > img._pfLastSize) {
            img._pfLastSize = img.offsetWidth;
            sizes = img.sizes;
            img.sizes += ",100vw";
            setTimeout(function () {
              img.sizes = sizes;
            });
          }
        };

        var findPictureImgs = function () {
          var i;
          var imgs = document.querySelectorAll("picture > img, img[srcset][sizes]");
          for (i = 0; i < imgs.length; i++) {
            fixRespimg(imgs[i]);
          }
        };
        var onResize = function () {
          clearTimeout(timer);
          timer = setTimeout(findPictureImgs, 99);
        };
        var mq = window.matchMedia && matchMedia("(orientation: landscape)");
        var init = function () {
          onResize();

          if (mq && mq.addListener) {
            mq.addListener(onResize);
          }
        };

        dummySrc.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

        if (/^[c|i]|d$/.test(document.readyState || "")) {
          init();
        } else {
          document.addEventListener("DOMContentLoaded", init);
        }

        return onResize;
      })());
    }
  })(window);

  (function (window, document, undefined) {
    "use strict";

    document.createElement("picture");

    var warn, eminpx, alwaysCheckWDescriptor, evalId;
    var pf = {};
    var isSupportTestReady = false;
    var noop = function () { };
    var image = document.createElement("img");
    var getImgAttr = image.getAttribute;
    var setImgAttr = image.setAttribute;
    var removeImgAttr = image.removeAttribute;
    var docElem = document.documentElement;
    var types = {};
    var cfg = {
      algorithm: ""
    };
    var srcAttr = "data-pfsrc";
    var srcsetAttr = srcAttr + "set";
    var ua = navigator.userAgent;
    var supportAbort = (/rident/).test(ua) || ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 > 35);
    var curSrcProp = "currentSrc";
    var regWDesc = /\s+\+?\d+(e\d+)?w/;
    var regSize = /(\([^)]+\))?\s*(.+)/;
    var setOptions = window.picturefillCFG;

    var baseStyle = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)";
    var fsCss = "font-size:100%!important;";
    var isVwDirty = true;

    var cssCache = {};
    var sizeLengthCache = {};
    var DPR = window.devicePixelRatio;
    var units = {
      px: 1,
      "in": 96
    };
    var anchor = document.createElement("a");
  /*** alreadyRun flag used for setOptions. is it true setOptions will reevaluate
     * @type {boolean}
     */
    var alreadyRun = false;
    var regexLeadingSpaces = /^[ \t\n\r\u000c]+/,
      regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/,
      regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/,
      regexTrailingCommas = /[,]+$/,
      regexNonNegativeInteger = /^\d+$/,

      regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;

    var on = function (obj, evt, fn, capture) {
      if (obj.addEventListener) {
        obj.addEventListener(evt, fn, capture || false);
      } else if (obj.attachEvent) {
        obj.attachEvent("on" + evt, fn);
      }
    };

  /*** simple memoize function:*/

    var memoize = function (fn) {
      var cache = {};
      return function (input) {
        if (!(input in cache)) {
          cache[input] = fn(input);
        }
        return cache[input];
      };
    };

    // UTILITY FUNCTIONS
    function isSpace(c) {
      return (c === "\u0020" || // space
        c === "\u0009" || // horizontal tab
        c === "\u000A" || // new line
        c === "\u000C" || // form feed
        c === "\u000D");  // carriage return
    }

  /**
     * gets a mediaquery and returns a boolean or gets a css length and returns a number
     * @param css mediaqueries or css length
     * @returns {boolean|number}
     *
     * based on: https://gist.github.com/jonathantneal/db4f77009b155f083738
     */
    var evalCSS = (function () {

      var regLength = /^([\d\.]+)(em|vw|px)$/;
      var replace = function () {
        var args = arguments, index = 0, string = args[0];
        while (++index in args) {
          string = string.replace(args[index], args[++index]);
        }
        return string;
      };

      var buildStr = memoize(function (css) {

        return "return " + replace((css || "").toLowerCase(),
          // interpret `and`
          /\band\b/g, "&&",

          // interpret `,`
          /,/g, "||",

          // interpret `min-` as >=
          /min-([a-z-\s]+):/g, "e.$1>=",

          // interpret `max-` as <=
          /max-([a-z-\s]+):/g, "e.$1<=",

          //calc value
          /calc([^)]+)/g, "($1)",

          // interpret css values
          /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)",
          //make eval less evil
          /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/ig, ""
        ) + ";";
      });

      return function (css, length) {
        var parsedLength;
        if (!(css in cssCache)) {
          cssCache[css] = false;
          if (length && (parsedLength = css.match(regLength))) {
            cssCache[css] = parsedLength[1] * units[parsedLength[2]];
          } else {
            /*jshint evil:true */
            try {
              cssCache[css] = new Function("e", buildStr(css))(units);
            } catch (e) { }
            /*jshint evil:false */
          }
        }
        return cssCache[css];
      };
    })();

    var setResolution = function (candidate, sizesattr) {
      if (candidate.w) { // h = means height: || descriptor.type === 'h' do not handle yet...
        candidate.cWidth = pf.calcListLength(sizesattr || "100vw");
        candidate.res = candidate.w / candidate.cWidth;
      } else {
        candidate.res = candidate.d;
      }
      return candidate;
    };

  /**
     *
     * @param opt
     */
    var picturefill = function (opt) {

      if (!isSupportTestReady) { return; }

      var elements, i, plen;

      var options = opt || {};

      if (options.elements && options.elements.nodeType === 1) {
        if (options.elements.nodeName.toUpperCase() === "IMG") {
          options.elements = [options.elements];
        } else {
          options.context = options.elements;
          options.elements = null;
        }
      }

      elements = options.elements || pf.qsa((options.context || document), (options.reevaluate || options.reselect) ? pf.sel : pf.selShort);

      if ((plen = elements.length)) {

        pf.setupRun(options);
        alreadyRun = true;

        // Loop through all elements
        for (i = 0; i < plen; i++) {
          pf.fillImg(elements[i], options);
        }

        pf.teardownRun(options);
      }
    };

  /**
     * outputs a warning for the developer
     * @param {message}
     * @type {Function}
     */
    warn = (window.console && console.warn) ?
      function (message) {
        console.warn(message);
      } :
      noop
      ;

    if (!(curSrcProp in image)) {
      curSrcProp = "src";
    }

    // Add support for standard mime types.
    types["image/jpeg"] = true;
    types["image/gif"] = true;
    types["image/png"] = true;

    function detectTypeSupport(type, typeUri) {
      // based on Modernizr's lossless img-webp test
      // note: asynchronous
      var image = new window.Image();
      image.onerror = function () {
        types[type] = false;
        picturefill();
      };
      image.onload = function () {
        types[type] = image.width === 1;
        picturefill();
      };
      image.src = typeUri;
      return "pending";
    }

    // test svg support
    types["image/svg+xml"] = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");

  /**
     * updates the internal vW property with the current viewport width in px
     */
    function updateMetrics() {

      isVwDirty = false;
      DPR = window.devicePixelRatio;
      cssCache = {};
      sizeLengthCache = {};

      pf.DPR = DPR || 1;

      units.width = Math.max(window.innerWidth || 0, docElem.clientWidth);
      units.height = Math.max(window.innerHeight || 0, docElem.clientHeight);

      units.vw = units.width / 100;
      units.vh = units.height / 100;

      evalId = [units.height, units.width, DPR].join("-");

      units.em = pf.getEmValue();
      units.rem = units.em;
    }

    function chooseLowRes(lowerValue, higherValue, dprValue, isCached) {
      var bonusFactor, tooMuch, bonus, meanDensity;

      //experimental
      if (cfg.algorithm === "saveData") {
        if (lowerValue > 2.7) {
          meanDensity = dprValue + 1;
        } else {
          tooMuch = higherValue - dprValue;
          bonusFactor = Math.pow(lowerValue - 0.6, 1.5);

          bonus = tooMuch * bonusFactor;

          if (isCached) {
            bonus += 0.1 * bonusFactor;
          }

          meanDensity = lowerValue + bonus;
        }
      } else {
        meanDensity = (dprValue > 1) ?
          Math.sqrt(lowerValue * higherValue) :
          lowerValue;
      }

      return meanDensity > dprValue;
    }

    function applyBestCandidate(img) {
      var srcSetCandidates;
      var matchingSet = pf.getSet(img);
      var evaluated = false;
      if (matchingSet !== "pending") {
        evaluated = evalId;
        if (matchingSet) {
          srcSetCandidates = pf.setRes(matchingSet);
          pf.applySetCandidate(srcSetCandidates, img);
        }
      }
      img[pf.ns].evaled = evaluated;
    }

    function ascendingSort(a, b) {
      return a.res - b.res;
    }

    function setSrcToCur(img, src, set) {
      var candidate;
      if (!set && src) {
        set = img[pf.ns].sets;
        set = set && set[set.length - 1];
      }

      candidate = getCandidateForSrc(src, set);

      if (candidate) {
        src = pf.makeUrl(src);
        img[pf.ns].curSrc = src;
        img[pf.ns].curCan = candidate;

        if (!candidate.res) {
          setResolution(candidate, candidate.set.sizes);
        }
      }
      return candidate;
    }

    function getCandidateForSrc(src, set) {
      var i, candidate, candidates;
      if (src && set) {
        candidates = pf.parseSet(set);
        src = pf.makeUrl(src);
        for (i = 0; i < candidates.length; i++) {
          if (src === pf.makeUrl(candidates[i].url)) {
            candidate = candidates[i];
            break;
          }
        }
      }
      return candidate;
    }

    function getAllSourceElements(picture, candidates) {
      var i, len, source, srcset;

      // SPEC mismatch intended for size and perf:
      // actually only source elements preceding the img should be used
      // also note: don't use qsa here, because IE8 sometimes doesn't like source as the key part in a selector
      var sources = picture.getElementsByTagName("source");

      for (i = 0, len = sources.length; i < len; i++) {
        source = sources[i];
        source[pf.ns] = true;
        srcset = source.getAttribute("srcset");

        // if source does not have a srcset attribute, skip
        if (srcset) {
          candidates.push({
            srcset: srcset,
            media: source.getAttribute("media"),
            type: source.getAttribute("type"),
            sizes: source.getAttribute("sizes")
          });
        }
      }
    }

  /**
     * Srcset Parser
     * By Alex Bell |  MIT License
     *
     * @returns Array [{url: _, d: _, w: _, h:_, set:_(????)}, ...]
     *
     * Based super duper closely on the reference algorithm at:
     * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-srcset-attribute
     */

    // 1. Let input be the value passed to this algorithm.
    // (TO-DO : Explain what "set" argument is here. Maybe choose a more
    // descriptive & more searchable name.  Since passing the "set" in really has
    // nothing to do with parsing proper, I would prefer this assignment eventually
    // go in an external fn.)
    function parseSrcset(input, set) {

      function collectCharacters(regEx) {
        var chars,
          match = regEx.exec(input.substring(pos));
        if (match) {
          chars = match[0];
          pos += chars.length;
          return chars;
        }
      }

      var inputLength = input.length,
        url,
        descriptors,
        currentDescriptor,
        state,
        c,

        // 2. Let position be a pointer into input, initially pointing at the start
        //    of the string.
        pos = 0,

        // 3. Let candidates be an initially empty source set.
        candidates = [];

  /**
      * Adds descriptor properties to a candidate, pushes to the candidates array
      * @return undefined
      */
      // (Declared outside of the while loop so that it's only created once.
      // (This fn is defined before it is used, in order to pass JSHINT.
      // Unfortunately this breaks the sequencing of the spec comments. :/ )
      function parseDescriptors() {

        // 9. Descriptor parser: Let error be no.
        var pError = false,

          // 10. Let width be absent.
          // 11. Let density be absent.
          // 12. Let future-compat-h be absent. (We're implementing it now as h)
          w, d, h, i,
          candidate = {},
          desc, lastChar, value, intVal, floatVal;

        // 13. For each descriptor in descriptors, run the appropriate set of steps
        // from the following list:
        for (i = 0; i < descriptors.length; i++) {
          desc = descriptors[i];

          lastChar = desc[desc.length - 1];
          value = desc.substring(0, desc.length - 1);
          intVal = parseInt(value, 10);
          floatVal = parseFloat(value);

          // If the descriptor consists of a valid non-negative integer followed by
          // a U+0077 LATIN SMALL LETTER W character
          if (regexNonNegativeInteger.test(value) && (lastChar === "w")) {

            // If width and density are not both absent, then let error be yes.
            if (w || d) { pError = true; }

            // Apply the rules for parsing non-negative integers to the descriptor.
            // If the result is zero, let error be yes.
            // Otherwise, let width be the result.
            if (intVal === 0) { pError = true; } else { w = intVal; }

            // If the descriptor consists of a valid floating-point number followed by
            // a U+0078 LATIN SMALL LETTER X character
          } else if (regexFloatingPoint.test(value) && (lastChar === "x")) {

            // If width, density and future-compat-h are not all absent, then let error
            // be yes.
            if (w || d || h) { pError = true; }

            // Apply the rules for parsing floating-point number values to the descriptor.
            // If the result is less than zero, let error be yes. Otherwise, let density
            // be the result.
            if (floatVal < 0) { pError = true; } else { d = floatVal; }

            // If the descriptor consists of a valid non-negative integer followed by
            // a U+0068 LATIN SMALL LETTER H character
          } else if (regexNonNegativeInteger.test(value) && (lastChar === "h")) {

            // If height and density are not both absent, then let error be yes.
            if (h || d) { pError = true; }

            // Apply the rules for parsing non-negative integers to the descriptor.
            // If the result is zero, let error be yes. Otherwise, let future-compat-h
            // be the result.
            if (intVal === 0) { pError = true; } else { h = intVal; }

            // Anything else, Let error be yes.
          } else { pError = true; }
        } // (close step 13 for loop)

        // 15. If error is still no, then append a new image source to candidates whose
        // URL is url, associated with a width width if not absent and a pixel
        // density density if not absent. Otherwise, there is a parse error.
        if (!pError) {
          candidate.url = url;

          if (w) { candidate.w = w; }
          if (d) { candidate.d = d; }
          if (h) { candidate.h = h; }
          if (!h && !d && !w) { candidate.d = 1; }
          if (candidate.d === 1) { set.has1x = true; }
          candidate.set = set;

          candidates.push(candidate);
        }
      } // (close parseDescriptors fn)

  /**
      * Tokenizes descriptor properties prior to parsing
      * Returns undefined.
      * (Again, this fn is defined before it is used, in order to pass JSHINT.
      * Unfortunately this breaks the logical sequencing of the spec comments. :/ )
      */
      function tokenize() {

        // 8.1. Descriptor tokeniser: Skip whitespace
        collectCharacters(regexLeadingSpaces);

        // 8.2. Let current descriptor be the empty string.
        currentDescriptor = "";

        // 8.3. Let state be in descriptor.
        state = "in descriptor";

        while (true) {

          // 8.4. Let c be the character at position.
          c = input.charAt(pos);

          //  Do the following depending on the value of state.
          //  For the purpose of this step, "EOF" is a special character representing
          //  that position is past the end of input.

          // In descriptor
          if (state === "in descriptor") {
            // Do the following, depending on the value of c:

            // Space character
            // If current descriptor is not empty, append current descriptor to
            // descriptors and let current descriptor be the empty string.
            // Set state to after descriptor.
            if (isSpace(c)) {
              if (currentDescriptor) {
                descriptors.push(currentDescriptor);
                currentDescriptor = "";
                state = "after descriptor";
              }

              // U+002C COMMA (,)
              // Advance position to the next character in input. If current descriptor
              // is not empty, append current descriptor to descriptors. Jump to the step
              // labeled descriptor parser.
            } else if (c === ",") {
              pos += 1;
              if (currentDescriptor) {
                descriptors.push(currentDescriptor);
              }
              parseDescriptors();
              return;

              // U+0028 LEFT PARENTHESIS (()
              // Append c to current descriptor. Set state to in parens.
            } else if (c === "\u0028") {
              currentDescriptor = currentDescriptor + c;
              state = "in parens";

              // EOF
              // If current descriptor is not empty, append current descriptor to
              // descriptors. Jump to the step labeled descriptor parser.
            } else if (c === "") {
              if (currentDescriptor) {
                descriptors.push(currentDescriptor);
              }
              parseDescriptors();
              return;

              // Anything else
              // Append c to current descriptor.
            } else {
              currentDescriptor = currentDescriptor + c;
            }
            // (end "in descriptor"

            // In parens
          } else if (state === "in parens") {

            // U+0029 RIGHT PARENTHESIS ())
            // Append c to current descriptor. Set state to in descriptor.
            if (c === ")") {
              currentDescriptor = currentDescriptor + c;
              state = "in descriptor";

              // EOF
              // Append current descriptor to descriptors. Jump to the step labeled
              // descriptor parser.
            } else if (c === "") {
              descriptors.push(currentDescriptor);
              parseDescriptors();
              return;

              // Anything else
              // Append c to current descriptor.
            } else {
              currentDescriptor = currentDescriptor + c;
            }

            // After descriptor
          } else if (state === "after descriptor") {

            // Do the following, depending on the value of c:
            // Space character: Stay in this state.
            if (isSpace(c)) {

              // EOF: Jump to the step labeled descriptor parser.
            } else if (c === "") {
              parseDescriptors();
              return;

              // Anything else
              // Set state to in descriptor. Set position to the previous character in input.
            } else {
              state = "in descriptor";
              pos -= 1;

            }
          }

          // Advance position to the next character in input.
          pos += 1;

          // Repeat this step.
        } // (close while true loop)
      }

      // 4. Splitting loop: Collect a sequence of characters that are space
      //    characters or U+002C COMMA characters. If any U+002C COMMA characters
      //    were collected, that is a parse error.
      while (true) {
        collectCharacters(regexLeadingCommasOrSpaces);

        // 5. If position is past the end of input, return candidates and abort these steps.
        if (pos >= inputLength) {
          return candidates; // (we're done, this is the sole return path)
        }

        // 6. Collect a sequence of characters that are not space characters,
        //    and let that be url.
        url = collectCharacters(regexLeadingNotSpaces);

        // 7. Let descriptors be a new empty list.
        descriptors = [];

        // 8. If url ends with a U+002C COMMA character (,), follow these substeps:
        //		(1). Remove all trailing U+002C COMMA characters from url. If this removed
        //         more than one character, that is a parse error.
        if (url.slice(-1) === ",") {
          url = url.replace(regexTrailingCommas, "");
          // (Jump ahead to step 9 to skip tokenization and just push the candidate).
          parseDescriptors();

          //	Otherwise, follow these substeps:
        } else {
          tokenize();
        } // (close else of step 8)

        // 16. Return to the step labeled splitting loop.
      } // (Close of big while loop.)
    }

  /*
    * Sizes Parser
    *
    * By Alex Bell |  MIT License
    *
    * Non-strict but accurate and lightweight JS Parser for the string value <img sizes="here">
    *
    * Reference algorithm at:
    * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-sizes-attribute
    *
    * Most comments are copied in directly from the spec
    * (except for comments in parens).
    *
    * Grammar is:
    * <source-size-list> = <source-size># [ , <source-size-value> ]? | <source-size-value>
    * <source-size> = <media-condition> <source-size-value>
    * <source-size-value> = <length>
    * http://www.w3.org/html/wg/drafts/html/master/embedded-content.html#attr-img-sizes
    *
    * E.g. "(max-width: 30em) 100vw, (max-width: 50em) 70vw, 100vw"
    * or "(min-width: 30em), calc(30vw - 15px)" or just "30vw"
    *
    * Returns the first valid <css-length> with a media condition that evaluates to true,
    * or "100vw" if all valid media conditions evaluate to false.
    *
    */

    function parseSizes(strValue) {

      // (Percentage CSS lengths are not allowed in this case, to avoid confusion:
      // https://html.spec.whatwg.org/multipage/embedded-content.html#valid-source-size-list
      // CSS allows a single optional plus or minus sign:
      // http://www.w3.org/TR/CSS2/syndata.html#numbers
      // CSS is ASCII case-insensitive:
      // http://www.w3.org/TR/CSS2/syndata.html#characters )
      // Spec allows exponential notation for <number> type:
      // http://dev.w3.org/csswg/css-values/#numbers
      var regexCssLengthWithUnits = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i;

      // (This is a quick and lenient test. Because of optional unlimited-depth internal
      // grouping parens and strict spacing rules, this could get very complicated.)
      var regexCssCalc = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;

      var i;
      var unparsedSizesList;
      var unparsedSizesListLength;
      var unparsedSize;
      var lastComponentValue;
      var size;

      // UTILITY FUNCTIONS

      //  (Toy CSS parser. The goals here are:
      //  1) expansive test coverage without the weight of a full CSS parser.
      //  2) Avoiding regex wherever convenient.
      //  Quick tests: http://jsfiddle.net/gtntL4gr/3/
      //  Returns an array of arrays.)
      function parseComponentValues(str) {
        var chrctr;
        var component = "";
        var componentArray = [];
        var listArray = [];
        var parenDepth = 0;
        var pos = 0;
        var inComment = false;

        function pushComponent() {
          if (component) {
            componentArray.push(component);
            component = "";
          }
        }

        function pushComponentArray() {
          if (componentArray[0]) {
            listArray.push(componentArray);
            componentArray = [];
          }
        }

        // (Loop forwards from the beginning of the string.)
        while (true) {
          chrctr = str.charAt(pos);

          if (chrctr === "") { // ( End of string reached.)
            pushComponent();
            pushComponentArray();
            return listArray;
          } else if (inComment) {
            if ((chrctr === "*") && (str[pos + 1] === "/")) { // (At end of a comment.)
              inComment = false;
              pos += 2;
              pushComponent();
              continue;
            } else {
              pos += 1; // (Skip all characters inside comments.)
              continue;
            }
          } else if (isSpace(chrctr)) {
            // (If previous character in loop was also a space, or if
            // at the beginning of the string, do not add space char to
            // component.)
            if ((str.charAt(pos - 1) && isSpace(str.charAt(pos - 1))) || !component) {
              pos += 1;
              continue;
            } else if (parenDepth === 0) {
              pushComponent();
              pos += 1;
              continue;
            } else {
              // (Replace any space character with a plain space for legibility.)
              chrctr = " ";
            }
          } else if (chrctr === "(") {
            parenDepth += 1;
          } else if (chrctr === ")") {
            parenDepth -= 1;
          } else if (chrctr === ",") {
            pushComponent();
            pushComponentArray();
            pos += 1;
            continue;
          } else if ((chrctr === "/") && (str.charAt(pos + 1) === "*")) {
            inComment = true;
            pos += 2;
            continue;
          }

          component = component + chrctr;
          pos += 1;
        }
      }

      function isValidNonNegativeSourceSizeValue(s) {
        if (regexCssLengthWithUnits.test(s) && (parseFloat(s) >= 0)) { return true; }
        if (regexCssCalc.test(s)) { return true; }
        // ( http://www.w3.org/TR/CSS2/syndata.html#numbers says:
        // "-0 is equivalent to 0 and is not a negative number." which means that
        // unitless zero and unitless negative zero must be accepted as special cases.)
        if ((s === "0") || (s === "-0") || (s === "+0")) { return true; }
        return false;
      }

      // When asked to parse a sizes attribute from an element, parse a
      // comma-separated list of component values from the value of the element's
      // sizes attribute (or the empty string, if the attribute is absent), and let
      // unparsed sizes list be the result.
      // http://dev.w3.org/csswg/css-syntax/#parse-comma-separated-list-of-component-values

      unparsedSizesList = parseComponentValues(strValue);
      unparsedSizesListLength = unparsedSizesList.length;

      // For each unparsed size in unparsed sizes list:
      for (i = 0; i < unparsedSizesListLength; i++) {
        unparsedSize = unparsedSizesList[i];

        // 1. Remove all consecutive <whitespace-token>s from the end of unparsed size.
        // ( parseComponentValues() already omits spaces outside of parens. )

        // If unparsed size is now empty, that is a parse error; continue to the next
        // iteration of this algorithm.
        // ( parseComponentValues() won't push an empty array. )

        // 2. If the last component value in unparsed size is a valid non-negative
        // <source-size-value>, let size be its value and remove the component value
        // from unparsed size. Any CSS function other than the calc() function is
        // invalid. Otherwise, there is a parse error; continue to the next iteration
        // of this algorithm.
        // http://dev.w3.org/csswg/css-syntax/#parse-component-value
        lastComponentValue = unparsedSize[unparsedSize.length - 1];

        if (isValidNonNegativeSourceSizeValue(lastComponentValue)) {
          size = lastComponentValue;
          unparsedSize.pop();
        } else {
          continue;
        }

        // 3. Remove all consecutive <whitespace-token>s from the end of unparsed
        // size. If unparsed size is now empty, return size and exit this algorithm.
        // If this was not the last item in unparsed sizes list, that is a parse error.
        if (unparsedSize.length === 0) {
          return size;
        }

        // 4. Parse the remaining component values in unparsed size as a
        // <media-condition>. If it does not parse correctly, or it does parse
        // correctly but the <media-condition> evaluates to false, continue to the
        // next iteration of this algorithm.
        // (Parsing all possible compound media conditions in JS is heavy, complicated,
        // and the payoff is unclear. Is there ever an situation where the
        // media condition parses incorrectly but still somehow evaluates to true?
        // Can we just rely on the browser/polyfill to do it?)
        unparsedSize = unparsedSize.join(" ");
        if (!(pf.matchesMedia(unparsedSize))) {
          continue;
        }

        // 5. Return size and exit this algorithm.
        return size;
      }

      // If the above algorithm exhausts unparsed sizes list without returning a
      // size value, return 100vw.
      return "100vw";
    }

    // namespace
    pf.ns = ("pf" + new Date().getTime()).substr(0, 9);

    // srcset support test
    pf.supSrcset = "srcset" in image;
    pf.supSizes = "sizes" in image;
    pf.supPicture = !!window.HTMLPictureElement;

    // UC browser does claim to support srcset and picture, but not sizes,
    // this extended test reveals the browser does support nothing
    if (pf.supSrcset && pf.supPicture && !pf.supSizes) {
      (function (image2) {
        image.srcset = "data:,a";
        image2.src = "data:,a";
        pf.supSrcset = image.complete === image2.complete;
        pf.supPicture = pf.supSrcset && pf.supPicture;
      })(document.createElement("img"));
    }

    // Safari9 has basic support for sizes, but does't expose the `sizes` idl attribute
    if (pf.supSrcset && !pf.supSizes) {

      (function () {
        var width2 = "data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==";
        var width1 = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
        var img = document.createElement("img");
        var test = function () {
          var width = img.width;

          if (width === 2) {
            pf.supSizes = true;
          }

          alwaysCheckWDescriptor = pf.supSrcset && !pf.supSizes;

          isSupportTestReady = true;
          // force async
          setTimeout(picturefill);
        };

        img.onload = test;
        img.onerror = test;
        img.setAttribute("sizes", "9px");

        img.srcset = width1 + " 1w," + width2 + " 9w";
        img.src = width1;
      })();

    } else {
      isSupportTestReady = true;
    }

    // using pf.qsa instead of dom traversing does scale much better,
    // especially on sites mixing responsive and non-responsive images
    pf.selShort = "picture>img,img[srcset]";
    pf.sel = pf.selShort;
    pf.cfg = cfg;

  /**
     * Shortcut property for `devicePixelRatio` ( for easy overriding in tests )
     */
    pf.DPR = (DPR || 1);
    pf.u = units;

    // container of supported mime types that one might need to qualify before using
    pf.types = types;

    pf.setSize = noop;

  /**
     * Gets a string and returns the absolute URL
     * @param src
     * @returns {String} absolute URL
     */

    pf.makeUrl = memoize(function (src) {
      anchor.href = src;
      return anchor.href;
    });

  /**
     * Gets a DOM element or document and a selctor and returns the found matches
     * Can be extended with jQuery/Sizzle for IE7 support
     * @param context
     * @param sel
     * @returns {NodeList|Array}
     */
    pf.qsa = function (context, sel) {
      return ("querySelector" in context) ? context.querySelectorAll(sel) : [];
    };

  /**
     * Shortcut method for matchMedia ( for easy overriding in tests )
     * wether native or pf.mMQ is used will be decided lazy on first call
     * @returns {boolean}
     */
    pf.matchesMedia = function () {
      if (window.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches) {
        pf.matchesMedia = function (media) {
          return !media || (matchMedia(media).matches);
        };
      } else {
        pf.matchesMedia = pf.mMQ;
      }

      return pf.matchesMedia.apply(this, arguments);
    };

  /**
     * A simplified matchMedia implementation for IE8 and IE9
     * handles only min-width/max-width with px or em values
     * @param media
     * @returns {boolean}
     */
    pf.mMQ = function (media) {
      return media ? evalCSS(media) : true;
    };

  /**
     * Returns the calculated length in css pixel from the given sourceSizeValue
     * http://dev.w3.org/csswg/css-values-3/#length-value
     * intended Spec mismatches:
     * * Does not check for invalid use of CSS functions
     * * Does handle a computed length of 0 the same as a negative and therefore invalid value
     * @param sourceSizeValue
     * @returns {Number}
     */
    pf.calcLength = function (sourceSizeValue) {

      var value = evalCSS(sourceSizeValue, true) || false;
      if (value < 0) {
        value = false;
      }

      return value;
    };

  /**
     * Takes a type string and checks if its supported
     */

    pf.supportsType = function (type) {
      return (type) ? types[type] : true;
    };

  /**
     * Parses a sourceSize into mediaCondition (media) and sourceSizeValue (length)
     * @param sourceSizeStr
     * @returns {*}
     */
    pf.parseSize = memoize(function (sourceSizeStr) {
      var match = (sourceSizeStr || "").match(regSize);
      return {
        media: match && match[1],
        length: match && match[2]
      };
    });

    pf.parseSet = function (set) {
      if (!set.cands) {
        set.cands = parseSrcset(set.srcset, set);
      }
      return set.cands;
    };

  /**
     * returns 1em in css px for html/body default size
     * function taken from respondjs
     * @returns {*|number}
     */
    pf.getEmValue = function () {
      var body;
      if (!eminpx && (body = document.body)) {
        var div = document.createElement("div"),
          originalHTMLCSS = docElem.style.cssText,
          originalBodyCSS = body.style.cssText;

        div.style.cssText = baseStyle;

        // 1em in a media query is the value of the default font size of the browser
        // reset docElem and body to ensure the correct value is returned
        docElem.style.cssText = fsCss;
        body.style.cssText = fsCss;

        body.appendChild(div);
        eminpx = div.offsetWidth;
        body.removeChild(div);

        //also update eminpx before returning
        eminpx = parseFloat(eminpx, 10);

        // restore the original values
        docElem.style.cssText = originalHTMLCSS;
        body.style.cssText = originalBodyCSS;

      }
      return eminpx || 16;
    };

  /**
     * Takes a string of sizes and returns the width in pixels as a number
     */
    pf.calcListLength = function (sourceSizeListStr) {
      // Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
      //
      //                           or (min-width:30em) calc(30% - 15px)
      if (!(sourceSizeListStr in sizeLengthCache) || cfg.uT) {
        var winningLength = pf.calcLength(parseSizes(sourceSizeListStr));

        sizeLengthCache[sourceSizeListStr] = !winningLength ? units.width : winningLength;
      }

      return sizeLengthCache[sourceSizeListStr];
    };

  /**
     * Takes a candidate object with a srcset property in the form of url/
     * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
     *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
     *     "images/pic-small.png"
     * Get an array of image candidates in the form of
     *      {url: "/foo/bar.png", resolution: 1}
     * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
     * If sizes is specified, res is calculated
     */
    pf.setRes = function (set) {
      var candidates;
      if (set) {

        candidates = pf.parseSet(set);

        for (var i = 0, len = candidates.length; i < len; i++) {
          setResolution(candidates[i], set.sizes);
        }
      }
      return candidates;
    };

    pf.setRes.res = setResolution;

    pf.applySetCandidate = function (candidates, img) {
      if (!candidates.length) { return; }
      var candidate,
        i,
        j,
        length,
        bestCandidate,
        curSrc,
        curCan,
        candidateSrc,
        abortCurSrc;

      var imageData = img[pf.ns];
      var dpr = pf.DPR;

      curSrc = imageData.curSrc || img[curSrcProp];

      curCan = imageData.curCan || setSrcToCur(img, curSrc, candidates[0].set);

      // if we have a current source, we might either become lazy or give this source some advantage
      if (curCan && curCan.set === candidates[0].set) {

        // if browser can abort image request and the image has a higher pixel density than needed
        // and this image isn't downloaded yet, we skip next part and try to save bandwidth
        abortCurSrc = (supportAbort && !img.complete && curCan.res - 0.1 > dpr);

        if (!abortCurSrc) {
          curCan.cached = true;

          // if current candidate is "best", "better" or "okay",
          // set it to bestCandidate
          if (curCan.res >= dpr) {
            bestCandidate = curCan;
          }
        }
      }

      if (!bestCandidate) {

        candidates.sort(ascendingSort);

        length = candidates.length;
        bestCandidate = candidates[length - 1];

        for (i = 0; i < length; i++) {
          candidate = candidates[i];
          if (candidate.res >= dpr) {
            j = i - 1;

            // we have found the perfect candidate,
            // but let's improve this a little bit with some assumptions ;-)
            if (candidates[j] &&
              (abortCurSrc || curSrc !== pf.makeUrl(candidate.url)) &&
              chooseLowRes(candidates[j].res, candidate.res, dpr, candidates[j].cached)) {

              bestCandidate = candidates[j];

            } else {
              bestCandidate = candidate;
            }
            break;
          }
        }
      }

      if (bestCandidate) {

        candidateSrc = pf.makeUrl(bestCandidate.url);

        imageData.curSrc = candidateSrc;
        imageData.curCan = bestCandidate;

        if (candidateSrc !== curSrc) {
          pf.setSrc(img, bestCandidate);
        }
        pf.setSize(img);
      }
    };

    pf.setSrc = function (img, bestCandidate) {
      var origWidth;
      img.src = bestCandidate.url;

      // although this is a specific Safari issue, we don't want to take too much different code paths
      if (bestCandidate.set.type === "image/svg+xml") {
        origWidth = img.style.width;
        img.style.width = (img.offsetWidth + 1) + "px";

        // next line only should trigger a repaint
        // if... is only done to trick dead code removal
        if (img.offsetWidth + 1) {
          img.style.width = origWidth;
        }
      }
    };

    pf.getSet = function (img) {
      var i, set, supportsType;
      var match = false;
      var sets = img[pf.ns].sets;

      for (i = 0; i < sets.length && !match; i++) {
        set = sets[i];

        if (!set.srcset || !pf.matchesMedia(set.media) || !(supportsType = pf.supportsType(set.type))) {
          continue;
        }

        if (supportsType === "pending") {
          set = supportsType;
        }

        match = set;
        break;
      }

      return match;
    };

    pf.parseSets = function (element, parent, options) {
      var srcsetAttribute, imageSet, isWDescripor, srcsetParsed;

      var hasPicture = parent && parent.nodeName.toUpperCase() === "PICTURE";
      var imageData = element[pf.ns];

      if (imageData.src === undefined || options.src) {
        imageData.src = getImgAttr.call(element, "src");
        if (imageData.src) {
          setImgAttr.call(element, srcAttr, imageData.src);
        } else {
          removeImgAttr.call(element, srcAttr);
        }
      }

      if (imageData.srcset === undefined || options.srcset || !pf.supSrcset || element.srcset) {
        srcsetAttribute = getImgAttr.call(element, "srcset");
        imageData.srcset = srcsetAttribute;
        srcsetParsed = true;
      }

      imageData.sets = [];

      if (hasPicture) {
        imageData.pic = true;
        getAllSourceElements(parent, imageData.sets);
      }

      if (imageData.srcset) {
        imageSet = {
          srcset: imageData.srcset,
          sizes: getImgAttr.call(element, "sizes")
        };

        imageData.sets.push(imageSet);

        isWDescripor = (alwaysCheckWDescriptor || imageData.src) && regWDesc.test(imageData.srcset || "");

        // add normal src as candidate, if source has no w descriptor
        if (!isWDescripor && imageData.src && !getCandidateForSrc(imageData.src, imageSet) && !imageSet.has1x) {
          imageSet.srcset += ", " + imageData.src;
          imageSet.cands.push({
            url: imageData.src,
            d: 1,
            set: imageSet
          });
        }

      } else if (imageData.src) {
        imageData.sets.push({
          srcset: imageData.src,
          sizes: null
        });
      }

      imageData.curCan = null;
      imageData.curSrc = undefined;

      // if img has picture or the srcset was removed or has a srcset and does not support srcset at all
      // or has a w descriptor (and does not support sizes) set support to false to evaluate
      imageData.supported = !(hasPicture || (imageSet && !pf.supSrcset) || (isWDescripor && !pf.supSizes));

      if (srcsetParsed && pf.supSrcset && !imageData.supported) {
        if (srcsetAttribute) {
          setImgAttr.call(element, srcsetAttr, srcsetAttribute);
          element.srcset = "";
        } else {
          removeImgAttr.call(element, srcsetAttr);
        }
      }

      if (imageData.supported && !imageData.srcset && ((!imageData.src && element.src) || element.src !== pf.makeUrl(imageData.src))) {
        if (imageData.src === null) {
          element.removeAttribute("src");
        } else {
          element.src = imageData.src;
        }
      }

      imageData.parsed = true;
    };

    pf.fillImg = function (element, options) {
      var imageData;
      var extreme = options.reselect || options.reevaluate;

      // expando for caching data on the img
      if (!element[pf.ns]) {
        element[pf.ns] = {};
      }

      imageData = element[pf.ns];

      // if the element has already been evaluated, skip it
      // unless `options.reevaluate` is set to true ( this, for example,
      // is set to true when running `picturefill` on `resize` ).
      if (!extreme && imageData.evaled === evalId) {
        return;
      }

      if (!imageData.parsed || options.reevaluate) {
        pf.parseSets(element, element.parentNode, options);
      }

      if (!imageData.supported) {
        applyBestCandidate(element);
      } else {
        imageData.evaled = evalId;
      }
    };

    pf.setupRun = function () {
      if (!alreadyRun || isVwDirty || (DPR !== window.devicePixelRatio)) {
        updateMetrics();
      }
    };

    // If picture is supported, well, that's awesome.
    if (pf.supPicture) {
      picturefill = noop;
      pf.fillImg = noop;
    } else {

      // Set up picture polyfill by polling the document
      (function () {
        var isDomReady;
        var regReady = window.attachEvent ? /d$|^c/ : /d$|^c|^i/;

        var run = function () {
          var readyState = document.readyState || "";

          timerId = setTimeout(run, readyState === "loading" ? 200 : 999);
          if (document.body) {
            pf.fillImgs();
            isDomReady = isDomReady || regReady.test(readyState);
            if (isDomReady) {
              clearTimeout(timerId);
            }

          }
        };

        var timerId = setTimeout(run, document.body ? 9 : 99);

        // Also attach picturefill on resize and readystatechange
        // http://modernjavascript.blogspot.com/2013/08/building-better-debounce.html
        var debounce = function (func, wait) {
          var timeout, timestamp;
          var later = function () {
            var last = (new Date()) - timestamp;

            if (last < wait) {
              timeout = setTimeout(later, wait - last);
            } else {
              timeout = null;
              func();
            }
          };

          return function () {
            timestamp = new Date();

            if (!timeout) {
              timeout = setTimeout(later, wait);
            }
          };
        };
        var lastClientWidth = docElem.clientHeight;
        var onResize = function () {
          isVwDirty = Math.max(window.innerWidth || 0, docElem.clientWidth) !== units.width || docElem.clientHeight !== lastClientWidth;
          lastClientWidth = docElem.clientHeight;
          if (isVwDirty) {
            pf.fillImgs();
          }
        };

        on(window, "resize", debounce(onResize, 99));
        on(document, "readystatechange", run);
      })();
    }

    pf.picturefill = picturefill;
    //use this internally for easy monkey patching/performance testing
    pf.fillImgs = picturefill;
    pf.teardownRun = noop;

    /* expose methods for testing */
    picturefill._ = pf;

    window.picturefillCFG = {
      pf: pf,
      push: function (args) {
        var name = args.shift();
        if (typeof pf[name] === "function") {
          pf[name].apply(pf, args);
        } else {
          cfg[name] = args[0];
          if (alreadyRun) {
            pf.fillImgs({ reselect: true });
          }
        }
      }
    };

    while (setOptions && setOptions.length) {
      window.picturefillCFG.push(setOptions.shift());
    }

    /* expose picturefill */
    window.picturefill = picturefill;

    /* expose picturefill */
    if (typeof module === "object" && typeof module.exports === "object") {
      // CommonJS, just export
      module.exports = picturefill;
    } else if (typeof define === "function" && define.amd) {
      // AMD support
      define("picturefill", function () { return picturefill; });
    }

    // IE8 evals this sync, so it must be the last thing we do
    if (!pf.supPicture) {
      types["image/webp"] = detectTypeSupport("image/webp", "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==");
    }

  })(window, document);
});

// mask
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.IMask = {}));
  }(this, (function (exports) { 'use strict';

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
      return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var check = function (it) {
      return it && it.Math == Math && it;
    };

    var global_1 = // eslint-disable-next-line no-undef
    check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func
    Function('return this')();

    var fails = function (exec) {
      try {
        return !!exec();
      } catch (error) {
        return true;
      }
    };

    var descriptors = !fails(function () {
      return Object.defineProperty({}, 1, {
        get: function () {
          return 7;
        }
      })[1] != 7;
    });

    var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

    var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
      1: 2
    }, 1); // `Object.prototype.propertyIsEnumerable` method implementation
    // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

    var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
      var descriptor = getOwnPropertyDescriptor(this, V);
      return !!descriptor && descriptor.enumerable;
    } : nativePropertyIsEnumerable;

    var objectPropertyIsEnumerable = {
      f: f
    };

    var createPropertyDescriptor = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value
      };
    };

    var toString = {}.toString;

    var classofRaw = function (it) {
      return toString.call(it).slice(8, -1);
    };

    var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

    var indexedObject = fails(function () {
      // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
      // eslint-disable-next-line no-prototype-builtins
      return !Object('z').propertyIsEnumerable(0);
    }) ? function (it) {
      return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
    } : Object;

    // `RequireObjectCoercible` abstract operation
    // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
    var requireObjectCoercible = function (it) {
      if (it == undefined) throw TypeError("Can't call method on " + it);
      return it;
    };

    // toObject with fallback for non-array-like ES3 strings

    var toIndexedObject = function (it) {
      return indexedObject(requireObjectCoercible(it));
    };

    var isObject = function (it) {
      return typeof it === 'object' ? it !== null : typeof it === 'function';
    };


    var toPrimitive = function (input, PREFERRED_STRING) {
      if (!isObject(input)) return input;
      var fn, val;
      if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
      if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
      if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
      throw TypeError("Can't convert object to primitive value");
    };

    var hasOwnProperty = {}.hasOwnProperty;

    var has = function (it, key) {
      return hasOwnProperty.call(it, key);
    };

    var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

    var EXISTS = isObject(document$1) && isObject(document$1.createElement);

    var documentCreateElement = function (it) {
      return EXISTS ? document$1.createElement(it) : {};
    };

    // Thank's IE8 for his funny defineProperty


    var ie8DomDefine = !descriptors && !fails(function () {
      return Object.defineProperty(documentCreateElement('div'), 'a', {
        get: function () {
          return 7;
        }
      }).a != 7;
    });

    var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

    var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
      O = toIndexedObject(O);
      P = toPrimitive(P, true);
      if (ie8DomDefine) try {
        return nativeGetOwnPropertyDescriptor(O, P);
      } catch (error) {
        /* empty */
      }
      if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
    };

    var objectGetOwnPropertyDescriptor = {
      f: f$1
    };

    var anObject = function (it) {
      if (!isObject(it)) {
        throw TypeError(String(it) + ' is not an object');
      }

      return it;
    };

    var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
    // https://tc39.github.io/ecma262/#sec-object.defineproperty

    var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
      anObject(O);
      P = toPrimitive(P, true);
      anObject(Attributes);
      if (ie8DomDefine) try {
        return nativeDefineProperty(O, P, Attributes);
      } catch (error) {
        /* empty */
      }
      if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
      if ('value' in Attributes) O[P] = Attributes.value;
      return O;
    };

    var objectDefineProperty = {
      f: f$2
    };

    var createNonEnumerableProperty = descriptors ? function (object, key, value) {
      return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
    } : function (object, key, value) {
      object[key] = value;
      return object;
    };

    var setGlobal = function (key, value) {
      try {
        createNonEnumerableProperty(global_1, key, value);
      } catch (error) {
        global_1[key] = value;
      }

      return value;
    };

    var SHARED = '__core-js_shared__';
    var store = global_1[SHARED] || setGlobal(SHARED, {});
    var sharedStore = store;

    var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

    if (typeof sharedStore.inspectSource != 'function') {
      sharedStore.inspectSource = function (it) {
        return functionToString.call(it);
      };
    }

    var inspectSource = sharedStore.inspectSource;

    var WeakMap = global_1.WeakMap;
    var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

    var shared = createCommonjsModule(function (module) {
    (module.exports = function (key, value) {
      return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
    })('versions', []).push({
      version: '3.6.4',
      mode:  'global',
      copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
    });
    });

    var id = 0;
    var postfix = Math.random();

    var uid = function (key) {
      return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
    };

    var keys = shared('keys');

    var sharedKey = function (key) {
      return keys[key] || (keys[key] = uid(key));
    };

    var hiddenKeys = {};

    var WeakMap$1 = global_1.WeakMap;
    var set, get, has$1;

    var enforce = function (it) {
      return has$1(it) ? get(it) : set(it, {});
    };

    var getterFor = function (TYPE) {
      return function (it) {
        var state;

        if (!isObject(it) || (state = get(it)).type !== TYPE) {
          throw TypeError('Incompatible receiver, ' + TYPE + ' required');
        }

        return state;
      };
    };

    if (nativeWeakMap) {
      var store$1 = new WeakMap$1();
      var wmget = store$1.get;
      var wmhas = store$1.has;
      var wmset = store$1.set;

      set = function (it, metadata) {
        wmset.call(store$1, it, metadata);
        return metadata;
      };

      get = function (it) {
        return wmget.call(store$1, it) || {};
      };

      has$1 = function (it) {
        return wmhas.call(store$1, it);
      };
    } else {
      var STATE = sharedKey('state');
      hiddenKeys[STATE] = true;

      set = function (it, metadata) {
        createNonEnumerableProperty(it, STATE, metadata);
        return metadata;
      };

      get = function (it) {
        return has(it, STATE) ? it[STATE] : {};
      };

      has$1 = function (it) {
        return has(it, STATE);
      };
    }

    var internalState = {
      set: set,
      get: get,
      has: has$1,
      enforce: enforce,
      getterFor: getterFor
    };

    var redefine = createCommonjsModule(function (module) {
    var getInternalState = internalState.get;
    var enforceInternalState = internalState.enforce;
    var TEMPLATE = String(String).split('String');
    (module.exports = function (O, key, value, options) {
      var unsafe = options ? !!options.unsafe : false;
      var simple = options ? !!options.enumerable : false;
      var noTargetGet = options ? !!options.noTargetGet : false;

      if (typeof value == 'function') {
        if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
        enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
      }

      if (O === global_1) {
        if (simple) O[key] = value;else setGlobal(key, value);
        return;
      } else if (!unsafe) {
        delete O[key];
      } else if (!noTargetGet && O[key]) {
        simple = true;
      }

      if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, 'toString', function toString() {
      return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
    });
    });

    var path = global_1;

    var aFunction = function (variable) {
      return typeof variable == 'function' ? variable : undefined;
    };

    var getBuiltIn = function (namespace, method) {
      return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
    };

    var ceil = Math.ceil;
    var floor = Math.floor; // `ToInteger` abstract operation
    // https://tc39.github.io/ecma262/#sec-tointeger

    var toInteger = function (argument) {
      return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
    };

    var min = Math.min; // `ToLength` abstract operation
    // https://tc39.github.io/ecma262/#sec-tolength

    var toLength = function (argument) {
      return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
    };

    var max = Math.max;
    var min$1 = Math.min; // Helper for a popular repeating case of the spec:

    var toAbsoluteIndex = function (index, length) {
      var integer = toInteger(index);
      return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
    };

    // `Array.prototype.{ indexOf, includes }` methods implementation


    var createMethod = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        var O = toIndexedObject($this);
        var length = toLength(O.length);
        var index = toAbsoluteIndex(fromIndex, length);
        var value; // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare

        if (IS_INCLUDES && el != el) while (length > index) {
          value = O[index++]; // eslint-disable-next-line no-self-compare

          if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
        } else for (; length > index; index++) {
          if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
        }
        return !IS_INCLUDES && -1;
      };
    };

    var arrayIncludes = {
      includes: createMethod(true),
      indexOf: createMethod(false)
    };

    var indexOf = arrayIncludes.indexOf;



    var objectKeysInternal = function (object, names) {
      var O = toIndexedObject(object);
      var i = 0;
      var result = [];
      var key;

      for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key); // Don't enum bug & hidden keys


      while (names.length > i) if (has(O, key = names[i++])) {
        ~indexOf(result, key) || result.push(key);
      }

      return result;
    };

    // IE8- don't enum bug keys
    var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

    var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

    var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
      return objectKeysInternal(O, hiddenKeys$1);
    };

    var objectGetOwnPropertyNames = {
      f: f$3
    };

    var f$4 = Object.getOwnPropertySymbols;

    var objectGetOwnPropertySymbols = {
      f: f$4
    };


    var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
      var keys = objectGetOwnPropertyNames.f(anObject(it));
      var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
      return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
    };

    var copyConstructorProperties = function (target, source) {
      var keys = ownKeys(source);
      var defineProperty = objectDefineProperty.f;
      var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
      }
    };

    var replacement = /#|\.prototype\./;

    var isForced = function (feature, detection) {
      var value = data[normalize(feature)];
      return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
    };

    var normalize = isForced.normalize = function (string) {
      return String(string).replace(replacement, '.').toLowerCase();
    };

    var data = isForced.data = {};
    var NATIVE = isForced.NATIVE = 'N';
    var POLYFILL = isForced.POLYFILL = 'P';
    var isForced_1 = isForced;

    var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;

    var _export = function (options, source) {
      var TARGET = options.target;
      var GLOBAL = options.global;
      var STATIC = options.stat;
      var FORCED, target, key, targetProperty, sourceProperty, descriptor;

      if (GLOBAL) {
        target = global_1;
      } else if (STATIC) {
        target = global_1[TARGET] || setGlobal(TARGET, {});
      } else {
        target = (global_1[TARGET] || {}).prototype;
      }

      if (target) for (key in source) {
        sourceProperty = source[key];

        if (options.noTargetGet) {
          descriptor = getOwnPropertyDescriptor$1(target, key);
          targetProperty = descriptor && descriptor.value;
        } else targetProperty = target[key];

        FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

        if (!FORCED && targetProperty !== undefined) {
          if (typeof sourceProperty === typeof targetProperty) continue;
          copyConstructorProperties(sourceProperty, targetProperty);
        } // add a flag to not completely full polyfills


        if (options.sham || targetProperty && targetProperty.sham) {
          createNonEnumerableProperty(sourceProperty, 'sham', true);
        } // extend global


        redefine(target, key, sourceProperty, options);
      }
    };


    var objectKeys = Object.keys || function keys(O) {
      return objectKeysInternal(O, enumBugKeys);
    };


    var toObject = function (argument) {
      return Object(requireObjectCoercible(argument));
    };

    var nativeAssign = Object.assign;
    var defineProperty = Object.defineProperty; // `Object.assign` method
    // https://tc39.github.io/ecma262/#sec-object.assign

    var objectAssign = !nativeAssign || fails(function () {
      // should have correct order of operations (Edge bug)
      if (descriptors && nativeAssign({
        b: 1
      }, nativeAssign(defineProperty({}, 'a', {
        enumerable: true,
        get: function () {
          defineProperty(this, 'b', {
            value: 3,
            enumerable: false
          });
        }
      }), {
        b: 2
      })).b !== 1) return true; // should work with symbols and should have deterministic property order (V8 bug)

      var A = {};
      var B = {}; // eslint-disable-next-line no-undef

      var symbol = Symbol();
      var alphabet = 'abcdefghijklmnopqrst';
      A[symbol] = 7;
      alphabet.split('').forEach(function (chr) {
        B[chr] = chr;
      });
      return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
    }) ? function assign(target, source) {
      // eslint-disable-line no-unused-vars
      var T = toObject(target);
      var argumentsLength = arguments.length;
      var index = 1;
      var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
      var propertyIsEnumerable = objectPropertyIsEnumerable.f;

      while (argumentsLength > index) {
        var S = indexedObject(arguments[index++]);
        var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
        var length = keys.length;
        var j = 0;
        var key;

        while (length > j) {
          key = keys[j++];
          if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
        }
      }

      return T;
    } : nativeAssign;


    _export({
      target: 'Object',
      stat: true,
      forced: Object.assign !== objectAssign
    }, {
      assign: objectAssign
    });


    var stringRepeat = ''.repeat || function repeat(count) {
      var str = String(requireObjectCoercible(this));
      var result = '';
      var n = toInteger(count);
      if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');

      for (; n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;

      return result;
    };

    // https://github.com/tc39/proposal-string-pad-start-end






    var ceil$1 = Math.ceil; // `String.prototype.{ padStart, padEnd }` methods implementation

    var createMethod$1 = function (IS_END) {
      return function ($this, maxLength, fillString) {
        var S = String(requireObjectCoercible($this));
        var stringLength = S.length;
        var fillStr = fillString === undefined ? ' ' : String(fillString);
        var intMaxLength = toLength(maxLength);
        var fillLen, stringFiller;
        if (intMaxLength <= stringLength || fillStr == '') return S;
        fillLen = intMaxLength - stringLength;
        stringFiller = stringRepeat.call(fillStr, ceil$1(fillLen / fillStr.length));
        if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
        return IS_END ? S + stringFiller : stringFiller + S;
      };
    };

    var stringPad = {
      start: createMethod$1(false),
      end: createMethod$1(true)
    };

    var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';
    var stringPadWebkitBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(engineUserAgent);
    var $padEnd = stringPad.end;

    // `String.prototype.padEnd` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.padend


    _export({
      target: 'String',
      proto: true,
      forced: stringPadWebkitBug
    }, {
      padEnd: function padEnd(maxLength
      /* , fillString = ' ' */
      ) {
        return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
      }
    });

    var $padStart = stringPad.start;


    _export({
      target: 'String',
      proto: true,
      forced: stringPadWebkitBug
    }, {
      padStart: function padStart(maxLength
      /* , fillString = ' ' */
      ) {
        return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
      }
    });



    _export({
      target: 'String',
      proto: true
    }, {
      repeat: stringRepeat
    });


    _export({
      global: true
    }, {
      globalThis: global_1
    });

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
          return typeof obj;
        };
      } else {
        _typeof = function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;

      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }

      return target;
    }

    function _objectWithoutProperties(source, excluded) {
      if (source == null) return {};

      var target = _objectWithoutPropertiesLoose(source, excluded);

      var key, i;

      if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

        for (i = 0; i < sourceSymbolKeys.length; i++) {
          key = sourceSymbolKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
          target[key] = source[key];
        }
      }

      return target;
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    function _possibleConstructorReturn(self, call) {
      if (call && (typeof call === "object" || typeof call === "function")) {
        return call;
      }

      return _assertThisInitialized(self);
    }

    function _superPropBase(object, property) {
      while (!Object.prototype.hasOwnProperty.call(object, property)) {
        object = _getPrototypeOf(object);
        if (object === null) break;
      }

      return object;
    }

    function _get(target, property, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
      } else {
        _get = function _get(target, property, receiver) {
          var base = _superPropBase(target, property);

          if (!base) return;
          var desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.get) {
            return desc.get.call(receiver);
          }

          return desc.value;
        };
      }

      return _get(target, property, receiver || target);
    }

    function set$1(target, property, value, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.set) {
        set$1 = Reflect.set;
      } else {
        set$1 = function set(target, property, value, receiver) {
          var base = _superPropBase(target, property);

          var desc;

          if (base) {
            desc = Object.getOwnPropertyDescriptor(base, property);

            if (desc.set) {
              desc.set.call(receiver, value);
              return true;
            } else if (!desc.writable) {
              return false;
            }
          }

          desc = Object.getOwnPropertyDescriptor(receiver, property);

          if (desc) {
            if (!desc.writable) {
              return false;
            }

            desc.value = value;
            Object.defineProperty(receiver, property, desc);
          } else {
            _defineProperty(receiver, property, value);
          }

          return true;
        };
      }

      return set$1(target, property, value, receiver);
    }

    function _set(target, property, value, receiver, isStrict) {
      var s = set$1(target, property, value, receiver || target);

      if (!s && isStrict) {
        throw new Error('failed to set property');
      }

      return value;
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArrayLimit(arr, i) {
      if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
        return;
      }

      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }

    /** Checks if value is string */
    function isString(str) {
      return typeof str === 'string' || str instanceof String;
    }
    /**
      Direction
      @prop {string} NONE
      @prop {string} LEFT
      @prop {string} FORCE_LEFT
      @prop {string} RIGHT
      @prop {string} FORCE_RIGHT
    */

    var DIRECTION = {
      NONE: 'NONE',
      LEFT: 'LEFT',
      FORCE_LEFT: 'FORCE_LEFT',
      RIGHT: 'RIGHT',
      FORCE_RIGHT: 'FORCE_RIGHT'
    };
    /** */

    function forceDirection(direction) {
      switch (direction) {
        case DIRECTION.LEFT:
          return DIRECTION.FORCE_LEFT;

        case DIRECTION.RIGHT:
          return DIRECTION.FORCE_RIGHT;

        default:
          return direction;
      }
    }
    /** Escapes regular expression control chars */

    function escapeRegExp(str) {
      return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
    } // cloned from https://github.com/epoberezkin/fast-deep-equal with small changes

    function objectIncludes(b, a) {
      if (a === b) return true;
      var arrA = Array.isArray(a),
          arrB = Array.isArray(b),
          i;

      if (arrA && arrB) {
        if (a.length != b.length) return false;

        for (i = 0; i < a.length; i++) {
          if (!objectIncludes(a[i], b[i])) return false;
        }

        return true;
      }

      if (arrA != arrB) return false;

      if (a && b && _typeof(a) === 'object' && _typeof(b) === 'object') {
        var dateA = a instanceof Date,
            dateB = b instanceof Date;
        if (dateA && dateB) return a.getTime() == b.getTime();
        if (dateA != dateB) return false;
        var regexpA = a instanceof RegExp,
            regexpB = b instanceof RegExp;
        if (regexpA && regexpB) return a.toString() == b.toString();
        if (regexpA != regexpB) return false;
        var keys = Object.keys(a); // if (keys.length !== Object.keys(b).length) return false;

        for (i = 0; i < keys.length; i++) {
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        }

        for (i = 0; i < keys.length; i++) {
          if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
        }

        return true;
      } else if (a && b && typeof a === 'function' && typeof b === 'function') {
        return a.toString() === b.toString();
      }

      return false;
    }

    var ActionDetails =
    function () {

      function ActionDetails(value, cursorPos, oldValue, oldSelection) {
        _classCallCheck(this, ActionDetails);

        this.value = value;
        this.cursorPos = cursorPos;
        this.oldValue = oldValue;
        this.oldSelection = oldSelection; // double check if left part was changed (autofilling, other non-standard input triggers)

        while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
          --this.oldSelection.start;
        }
      }
      /**
        Start changing position
        @readonly
      */


      _createClass(ActionDetails, [{
        key: "startChangePos",
        get: function get() {
          return Math.min(this.cursorPos, this.oldSelection.start);
        }
        /**
          Inserted symbols count
          @readonly
        */

      }, {
        key: "insertedCount",
        get: function get() {
          return this.cursorPos - this.startChangePos;
        }
        /**
          Inserted symbols
          @readonly
        */

      }, {
        key: "inserted",
        get: function get() {
          return this.value.substr(this.startChangePos, this.insertedCount);
        }
        /**
          Removed symbols count
          @readonly
        */

      }, {
        key: "removedCount",
        get: function get() {
          // Math.max for opposite operation
          return Math.max(this.oldSelection.end - this.startChangePos || // for Delete
          this.oldValue.length - this.value.length, 0);
        }
        /**
          Removed symbols
          @readonly
        */

      }, {
        key: "removed",
        get: function get() {
          return this.oldValue.substr(this.startChangePos, this.removedCount);
        }
        /**
          Unchanged head symbols
          @readonly
        */

      }, {
        key: "head",
        get: function get() {
          return this.value.substring(0, this.startChangePos);
        }
        /**
          Unchanged tail symbols
          @readonly
        */

      }, {
        key: "tail",
        get: function get() {
          return this.value.substring(this.startChangePos + this.insertedCount);
        }
        /**
          Remove direction
          @readonly
        */

      }, {
        key: "removeDirection",
        get: function get() {
          if (!this.removedCount || this.insertedCount) return DIRECTION.NONE; // align right if delete at right or if range removed (event with backspace)

          return this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos ? DIRECTION.RIGHT : DIRECTION.LEFT;
        }
      }]);

      return ActionDetails;
    }();

    /**
      Provides details of changing model value
      @param {Object} [details]
      @param {string} [details.inserted] - Inserted symbols
      @param {boolean} [details.skip] - Can skip chars
      @param {number} [details.removeCount] - Removed symbols count
      @param {number} [details.tailShift] - Additional offset if any changes occurred before tail
    */
    var ChangeDetails =
    /*#__PURE__*/
    function () {
      function ChangeDetails(details) {
        _classCallCheck(this, ChangeDetails);

        Object.assign(this, {
          inserted: '',
          rawInserted: '',
          skip: false,
          tailShift: 0
        }, details);
      }
      /**
        Aggregate changes
        @returns {ChangeDetails} `this`
      */


      _createClass(ChangeDetails, [{
        key: "aggregate",
        value: function aggregate(details) {
          this.rawInserted += details.rawInserted;
          this.skip = this.skip || details.skip;
          this.inserted += details.inserted;
          this.tailShift += details.tailShift;
          return this;
        }
        /** Total offset considering all changes */

      }, {
        key: "offset",
        get: function get() {
          return this.tailShift + this.inserted.length;
        }
      }]);

      return ChangeDetails;
    }();

    /** Provides details of continuous extracted tail */
    var ContinuousTailDetails =
    /*#__PURE__*/
    function () {
      /** Tail value as string */

      /** Tail start position */

      /** Start position */
      function ContinuousTailDetails() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var stop = arguments.length > 2 ? arguments[2] : undefined;

        _classCallCheck(this, ContinuousTailDetails);

        this.value = value;
        this.from = from;
        this.stop = stop;
      }

      _createClass(ContinuousTailDetails, [{
        key: "toString",
        value: function toString() {
          return this.value;
        }
      }, {
        key: "extend",
        value: function extend(tail) {
          this.value += String(tail);
        }
      }, {
        key: "appendTo",
        value: function appendTo(masked) {
          return masked.append(this.toString(), {
            tail: true
          }).aggregate(masked._appendPlaceholder());
        }
      }, {
        key: "shiftBefore",
        value: function shiftBefore(pos) {
          if (this.from >= pos || !this.value.length) return '';
          var shiftChar = this.value[0];
          this.value = this.value.slice(1);
          return shiftChar;
        }
      }, {
        key: "state",
        get: function get() {
          return {
            value: this.value,
            from: this.from,
            stop: this.stop
          };
        },
        set: function set(state) {
          Object.assign(this, state);
        }
      }]);

      return ContinuousTailDetails;
    }();

    /**
     * Applies mask on element.
     * @constructor
     * @param {HTMLInputElement|HTMLTextAreaElement|MaskElement} el - Element to apply mask
     * @param {Object} opts - Custom mask options
     * @return {InputMask}
     */
    function IMask(el) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // currently available only for input-like elements
      return new IMask.InputMask(el, opts);
    }

    /** Supported mask type */

    /** Provides common masking stuff */
    var Masked =
    /*#__PURE__*/
    function () {
      // $Shape<MaskedOptions>; TODO after fix https://github.com/facebook/flow/issues/4773

      /** @type {Mask} */

      function Masked(opts) {
        _classCallCheck(this, Masked);

        this._value = '';

        this._update(Object.assign({}, Masked.DEFAULTS, {}, opts));

        this.isInitialized = true;
      }
      /** Sets and applies new options */


      _createClass(Masked, [{
        key: "updateOptions",
        value: function updateOptions(opts) {
          if (!Object.keys(opts).length) return;
          this.withValueRefresh(this._update.bind(this, opts));
        }
        /**
          Sets new options
          @protected
        */

      }, {
        key: "_update",
        value: function _update(opts) {
          Object.assign(this, opts);
        }
        /** Mask state */

      }, {
        key: "reset",

        /** Resets value */
        value: function reset() {
          this._value = '';
        }
        /** */

      }, {
        key: "resolve",

        /** Resolve new value */
        value: function resolve(value) {
          this.reset();
          this.append(value, {
            input: true
          }, '');
          this.doCommit();
          return this.value;
        }
        /** */

      }, {
        key: "nearestInputPos",

        /** Finds nearest input position in direction */
        value: function nearestInputPos(cursorPos, direction) {
          return cursorPos;
        }
        /** Extracts value in range considering flags */

      }, {
        key: "extractInput",
        value: function extractInput() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
          return this.value.slice(fromPos, toPos);
        }
        /** Extracts tail in range */

      }, {
        key: "extractTail",
        value: function extractTail() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
          return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
        }
        /** Appends tail */
        // $FlowFixMe no ideas

      }, {
        key: "appendTail",
        value: function appendTail(tail) {
          if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
          return tail.appendTo(this);
        }
        /** Appends char */

      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw(ch) {
          var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          ch = this.doPrepare(ch, flags);
          if (!ch) return new ChangeDetails();
          this._value += ch;
          return new ChangeDetails({
            inserted: ch,
            rawInserted: ch
          });
        }
        /** Appends char */

      }, {
        key: "_appendChar",
        value: function _appendChar(ch) {
          var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var checkTail = arguments.length > 2 ? arguments[2] : undefined;
          var consistentState = this.state;

          var details = this._appendCharRaw(ch, flags);

          if (details.inserted) {
            var consistentTail;
            var appended = this.doValidate(flags) !== false;

            if (appended && checkTail != null) {
              // validation ok, check tail
              var beforeTailState = this.state;

              if (this.overwrite) {
                consistentTail = checkTail.state;
                checkTail.shiftBefore(this.value.length);
              }

              var tailDetails = this.appendTail(checkTail);
              appended = tailDetails.rawInserted === checkTail.toString(); // if ok, rollback state after tail

              if (appended && tailDetails.inserted) this.state = beforeTailState;
            } // revert all if something went wrong


            if (!appended) {
              details = new ChangeDetails();
              this.state = consistentState;
              if (checkTail && consistentTail) checkTail.state = consistentTail;
            }
          }

          return details;
        }
        /** Appends optional placeholder at end */

      }, {
        key: "_appendPlaceholder",
        value: function _appendPlaceholder() {
          return new ChangeDetails();
        }
        /** Appends symbols considering flags */
        // $FlowFixMe no ideas

      }, {
        key: "append",
        value: function append(str, flags, tail) {
          if (!isString(str)) throw new Error('value should be string');
          var details = new ChangeDetails();
          var checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
          if (flags.tail) flags._beforeTailState = this.state;

          for (var ci = 0; ci < str.length; ++ci) {
            details.aggregate(this._appendChar(str[ci], flags, checkTail));
          } // append tail but aggregate only tailShift


          if (checkTail != null) {
            details.tailShift += this.appendTail(checkTail).tailShift; // TODO it's a good idea to clear state after appending ends
            // but it causes bugs when one append calls another (when dynamic dispatch set rawInputValue)
            // this._resetBeforeTailState();
          }

          return details;
        }
        /** */

      }, {
        key: "remove",
        value: function remove() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
          this._value = this.value.slice(0, fromPos) + this.value.slice(toPos);
          return new ChangeDetails();
        }
        /** Calls function and reapplies current value */

      }, {
        key: "withValueRefresh",
        value: function withValueRefresh(fn) {
          if (this._refreshing || !this.isInitialized) return fn();
          this._refreshing = true;
          var rawInput = this.rawInputValue;
          var value = this.value;
          var ret = fn();
          this.rawInputValue = rawInput; // append lost trailing chars at end

          if (this.value !== value && value.indexOf(this.value) === 0) {
            this.append(value.slice(this.value.length), {}, '');
          }

          delete this._refreshing;
          return ret;
        }
        /** */

      }, {
        key: "runIsolated",
        value: function runIsolated(fn) {
          if (this._isolated || !this.isInitialized) return fn(this);
          this._isolated = true;
          var state = this.state;
          var ret = fn(this);
          this.state = state;
          delete this._isolated;
          return ret;
        }
        /**
          Prepares string before mask processing
          @protected
        */

      }, {
        key: "doPrepare",
        value: function doPrepare(str) {
          var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          return this.prepare ? this.prepare(str, this, flags) : str;
        }
        /**
          Validates if value is acceptable
          @protected
        */

      }, {
        key: "doValidate",
        value: function doValidate(flags) {
          return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
        }
        /**
          Does additional processing in the end of editing
          @protected
        */

      }, {
        key: "doCommit",
        value: function doCommit() {
          if (this.commit) this.commit(this.value, this);
        }
        /** */

      }, {
        key: "doFormat",
        value: function doFormat(value) {
          return this.format ? this.format(value, this) : value;
        }
        /** */

      }, {
        key: "doParse",
        value: function doParse(str) {
          return this.parse ? this.parse(str, this) : str;
        }
        /** */

      }, {
        key: "splice",
        value: function splice(start, deleteCount, inserted, removeDirection) {
          var tailPos = start + deleteCount;
          var tail = this.extractTail(tailPos);
          var startChangePos = this.nearestInputPos(start, removeDirection);
          var changeDetails = new ChangeDetails({
            tailShift: startChangePos - start // adjust tailShift if start was aligned

          }).aggregate(this.remove(startChangePos)).aggregate(this.append(inserted, {
            input: true
          }, tail));
          return changeDetails;
        }
      }, {
        key: "state",
        get: function get() {
          return {
            _value: this.value
          };
        },
        set: function set(state) {
          this._value = state._value;
        }
      }, {
        key: "value",
        get: function get() {
          return this._value;
        },
        set: function set(value) {
          this.resolve(value);
        }
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this.value;
        },
        set: function set(value) {
          this.reset();
          this.append(value, {}, '');
          this.doCommit();
        }
        /** */

      }, {
        key: "typedValue",
        get: function get() {
          return this.doParse(this.value);
        },
        set: function set(value) {
          this.value = this.doFormat(value);
        }
        /** Value that includes raw user input */

      }, {
        key: "rawInputValue",
        get: function get() {
          return this.extractInput(0, this.value.length, {
            raw: true
          });
        },
        set: function set(value) {
          this.reset();
          this.append(value, {
            raw: true
          }, '');
          this.doCommit();
        }
        /** */

      }, {
        key: "isComplete",
        get: function get() {
          return true;
        }
      }]);

      return Masked;
    }();
    Masked.DEFAULTS = {
      format: function format(v) {
        return v;
      },
      parse: function parse(v) {
        return v;
      }
    };
    IMask.Masked = Masked;

    /** Get Masked class by mask type */

    function maskedClass(mask) {
      if (mask == null) {
        throw new Error('mask property should be defined');
      } // $FlowFixMe


      if (mask instanceof RegExp) return IMask.MaskedRegExp; // $FlowFixMe

      if (isString(mask)) return IMask.MaskedPattern; // $FlowFixMe

      if (mask instanceof Date || mask === Date) return IMask.MaskedDate; // $FlowFixMe

      if (mask instanceof Number || typeof mask === 'number' || mask === Number) return IMask.MaskedNumber; // $FlowFixMe

      if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic; // $FlowFixMe

      if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask; // $FlowFixMe

      if (mask instanceof Function) return IMask.MaskedFunction; // $FlowFixMe

      if (mask instanceof IMask.Masked) return mask.constructor;
      console.warn('Mask not found for mask', mask); // eslint-disable-line no-console
      // $FlowFixMe

      return IMask.Masked;
    }
    /** Creates new {@link Masked} depending on mask type */

    function createMask(opts) {
      // $FlowFixMe
      if (IMask.Masked && opts instanceof IMask.Masked) return opts;
      opts = Object.assign({}, opts);
      var mask = opts.mask; // $FlowFixMe

      if (IMask.Masked && mask instanceof IMask.Masked) return mask;
      var MaskedClass = maskedClass(mask);
      if (!MaskedClass) throw new Error('Masked class is not found for provided mask, appropriate module needs to be import manually before creating mask.');
      return new MaskedClass(opts);
    }
    IMask.createMask = createMask;

    var DEFAULT_INPUT_DEFINITIONS = {
      '0': /\d/,
      'a': /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
      // http://stackoverflow.com/a/22075070
      '*': /./
    };
    /** */

    var PatternInputDefinition =
    /*#__PURE__*/
    function () {
      /** */

      /** */

      /** */

      /** */

      /** */

      /** */
      function PatternInputDefinition(opts) {
        _classCallCheck(this, PatternInputDefinition);

        var mask = opts.mask,
            blockOpts = _objectWithoutProperties(opts, ["mask"]);

        this.masked = createMask({
          mask: mask
        });
        Object.assign(this, blockOpts);
      }

      _createClass(PatternInputDefinition, [{
        key: "reset",
        value: function reset() {
          this._isFilled = false;
          this.masked.reset();
        }
      }, {
        key: "remove",
        value: function remove() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

          if (fromPos === 0 && toPos >= 1) {
            this._isFilled = false;
            return this.masked.remove(fromPos, toPos);
          }

          return new ChangeDetails();
        }
      }, {
        key: "_appendChar",
        value: function _appendChar(str) {
          var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          if (this._isFilled) return new ChangeDetails();
          var state = this.masked.state; // simulate input

          var details = this.masked._appendChar(str, flags);

          if (details.inserted && this.doValidate(flags) === false) {
            details.inserted = details.rawInserted = '';
            this.masked.state = state;
          }

          if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
            details.inserted = this.placeholderChar;
          }

          details.skip = !details.inserted && !this.isOptional;
          this._isFilled = Boolean(details.inserted);
          return details;
        }
      }, {
        key: "append",
        value: function append() {
          var _this$masked;

          return (_this$masked = this.masked).append.apply(_this$masked, arguments);
        }
      }, {
        key: "_appendPlaceholder",
        value: function _appendPlaceholder() {
          var details = new ChangeDetails();
          if (this._isFilled || this.isOptional) return details;
          this._isFilled = true;
          details.inserted = this.placeholderChar;
          return details;
        }
      }, {
        key: "extractTail",
        value: function extractTail() {
          var _this$masked2;

          return (_this$masked2 = this.masked).extractTail.apply(_this$masked2, arguments);
        }
      }, {
        key: "appendTail",
        value: function appendTail() {
          var _this$masked3;

          return (_this$masked3 = this.masked).appendTail.apply(_this$masked3, arguments);
        }
      }, {
        key: "extractInput",
        value: function extractInput() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
          var flags = arguments.length > 2 ? arguments[2] : undefined;
          return this.masked.extractInput(fromPos, toPos, flags);
        }
      }, {
        key: "nearestInputPos",
        value: function nearestInputPos(cursorPos) {
          var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
          var minPos = 0;
          var maxPos = this.value.length;
          var boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);

          switch (direction) {
            case DIRECTION.LEFT:
            case DIRECTION.FORCE_LEFT:
              return this.isComplete ? boundPos : minPos;

            case DIRECTION.RIGHT:
            case DIRECTION.FORCE_RIGHT:
              return this.isComplete ? boundPos : maxPos;

            case DIRECTION.NONE:
            default:
              return boundPos;
          }
        }
      }, {
        key: "doValidate",
        value: function doValidate() {
          var _this$masked4, _this$parent;

          return (_this$masked4 = this.masked).doValidate.apply(_this$masked4, arguments) && (!this.parent || (_this$parent = this.parent).doValidate.apply(_this$parent, arguments));
        }
      }, {
        key: "doCommit",
        value: function doCommit() {
          this.masked.doCommit();
        }
      }, {
        key: "value",
        get: function get() {
          return this.masked.value || (this._isFilled && !this.isOptional ? this.placeholderChar : '');
        }
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this.masked.unmaskedValue;
        }
      }, {
        key: "isComplete",
        get: function get() {
          return Boolean(this.masked.value) || this.isOptional;
        }
      }, {
        key: "state",
        get: function get() {
          return {
            masked: this.masked.state,
            _isFilled: this._isFilled
          };
        },
        set: function set(state) {
          this.masked.state = state.masked;
          this._isFilled = state._isFilled;
        }
      }]);

      return PatternInputDefinition;
    }();

    var PatternFixedDefinition =
    /*#__PURE__*/
    function () {
      /** */

      /** */

      /** */

      /** */
      function PatternFixedDefinition(opts) {
        _classCallCheck(this, PatternFixedDefinition);

        Object.assign(this, opts);
        this._value = '';
      }

      _createClass(PatternFixedDefinition, [{
        key: "reset",
        value: function reset() {
          this._isRawInput = false;
          this._value = '';
        }
      }, {
        key: "remove",
        value: function remove() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
          this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
          if (!this._value) this._isRawInput = false;
          return new ChangeDetails();
        }
      }, {
        key: "nearestInputPos",
        value: function nearestInputPos(cursorPos) {
          var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
          var minPos = 0;
          var maxPos = this._value.length;

          switch (direction) {
            case DIRECTION.LEFT:
            case DIRECTION.FORCE_LEFT:
              return minPos;

            case DIRECTION.NONE:
            case DIRECTION.RIGHT:
            case DIRECTION.FORCE_RIGHT:
            default:
              return maxPos;
          }
        }
      }, {
        key: "extractInput",
        value: function extractInput() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
          var flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || '';
        }
      }, {
        key: "_appendChar",
        value: function _appendChar(str) {
          var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var details = new ChangeDetails();
          if (this._value) return details;
          var appended = this.char === str[0];
          var isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && !flags.tail;
          if (isResolved) details.rawInserted = this.char;
          this._value = details.inserted = this.char;
          this._isRawInput = isResolved && (flags.raw || flags.input);
          return details;
        }
      }, {
        key: "_appendPlaceholder",
        value: function _appendPlaceholder() {
          var details = new ChangeDetails();
          if (this._value) return details;
          this._value = details.inserted = this.char;
          return details;
        }
      }, {
        key: "extractTail",
        value: function extractTail() {
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
          return new ContinuousTailDetails('');
        } // $FlowFixMe no ideas

      }, {
        key: "appendTail",
        value: function appendTail(tail) {
          if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
          return tail.appendTo(this);
        }
      }, {
        key: "append",
        value: function append(str, flags, tail) {
          var details = this._appendChar(str, flags);

          if (tail != null) {
            details.tailShift += this.appendTail(tail).tailShift;
          }

          return details;
        }
      }, {
        key: "doCommit",
        value: function doCommit() {}
      }, {
        key: "value",
        get: function get() {
          return this._value;
        }
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this.isUnmasking ? this.value : '';
        }
      }, {
        key: "isComplete",
        get: function get() {
          return true;
        }
      }, {
        key: "state",
        get: function get() {
          return {
            _value: this._value,
            _isRawInput: this._isRawInput
          };
        },
        set: function set(state) {
          Object.assign(this, state);
        }
      }]);

      return PatternFixedDefinition;
    }();

    var ChunksTailDetails =
    /*#__PURE__*/
    function () {
      /** */
      function ChunksTailDetails() {
        var chunks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        _classCallCheck(this, ChunksTailDetails);

        this.chunks = chunks;
        this.from = from;
      }

      _createClass(ChunksTailDetails, [{
        key: "toString",
        value: function toString() {
          return this.chunks.map(String).join('');
        } // $FlowFixMe no ideas

      }, {
        key: "extend",
        value: function extend(tailChunk) {
          if (!String(tailChunk)) return;
          if (isString(tailChunk)) tailChunk = new ContinuousTailDetails(String(tailChunk));
          var lastChunk = this.chunks[this.chunks.length - 1];
          var extendLast = lastChunk && ( // if stops are same or tail has no stop
          lastChunk.stop === tailChunk.stop || tailChunk.stop == null) && // if tail chunk goes just after last chunk
          tailChunk.from === lastChunk.from + lastChunk.toString().length;

          if (tailChunk instanceof ContinuousTailDetails) {
            // check the ability to extend previous chunk
            if (extendLast) {
              // extend previous chunk
              lastChunk.extend(tailChunk.toString());
            } else {
              // append new chunk
              this.chunks.push(tailChunk);
            }
          } else if (tailChunk instanceof ChunksTailDetails) {
            if (tailChunk.stop == null) {
              // unwrap floating chunks to parent, keeping `from` pos
              var firstTailChunk;

              while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
                firstTailChunk = tailChunk.chunks.shift();
                firstTailChunk.from += tailChunk.from;
                this.extend(firstTailChunk);
              }
            } // if tail chunk still has value


            if (tailChunk.toString()) {
              // if chunks contains stops, then popup stop to container
              tailChunk.stop = tailChunk.blockIndex;
              this.chunks.push(tailChunk);
            }
          }
        }
      }, {
        key: "appendTo",
        value: function appendTo(masked) {
          // $FlowFixMe
          if (!(masked instanceof IMask.MaskedPattern)) {
            var tail = new ContinuousTailDetails(this.toString());
            return tail.appendTo(masked);
          }

          var details = new ChangeDetails();

          for (var ci = 0; ci < this.chunks.length && !details.skip; ++ci) {
            var chunk = this.chunks[ci];

            var lastBlockIter = masked._mapPosToBlock(masked.value.length);

            var stop = chunk.stop;
            var chunkBlock = void 0;

            if (stop != null && ( // if block not found or stop is behind lastBlock
            !lastBlockIter || lastBlockIter.index <= stop)) {
              if (chunk instanceof ChunksTailDetails || // for continuous block also check if stop is exist
              masked._stops.indexOf(stop) >= 0) {
                details.aggregate(masked._appendPlaceholder(stop));
              }

              chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
            }

            if (chunkBlock) {
              var tailDetails = chunkBlock.appendTail(chunk);
              tailDetails.skip = false; // always ignore skip, it will be set on last

              details.aggregate(tailDetails);
              masked._value += tailDetails.inserted; // get not inserted chars

              var remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
              if (remainChars) details.aggregate(masked.append(remainChars, {
                tail: true
              }));
            } else {
              details.aggregate(masked.append(chunk.toString(), {
                tail: true
              }));
            }
          }
          return details;
        }
      }, {
        key: "shiftBefore",
        value: function shiftBefore(pos) {
          if (this.from >= pos || !this.chunks.length) return '';
          var chunkShiftPos = pos - this.from;
          var ci = 0;

          while (ci < this.chunks.length) {
            var chunk = this.chunks[ci];
            var shiftChar = chunk.shiftBefore(chunkShiftPos);

            if (chunk.toString()) {
              // chunk still contains value
              // but not shifted - means no more available chars to shift
              if (!shiftChar) break;
              ++ci;
            } else {
              // clean if chunk has no value
              this.chunks.splice(ci, 1);
            }

            if (shiftChar) return shiftChar;
          }

          return '';
        }
      }, {
        key: "state",
        get: function get() {
          return {
            chunks: this.chunks.map(function (c) {
              return c.state;
            }),
            from: this.from,
            stop: this.stop,
            blockIndex: this.blockIndex
          };
        },
        set: function set(state) {
          var chunks = state.chunks,
              props = _objectWithoutProperties(state, ["chunks"]);

          Object.assign(this, props);
          this.chunks = chunks.map(function (cstate) {
            var chunk = "chunks" in cstate ? new ChunksTailDetails() : new ContinuousTailDetails(); // $FlowFixMe already checked above

            chunk.state = cstate;
            return chunk;
          });
        }
      }]);

      return ChunksTailDetails;
    }();

    /** Masking by RegExp */

    var MaskedRegExp =
    /*#__PURE__*/
    function (_Masked) {
      _inherits(MaskedRegExp, _Masked);

      function MaskedRegExp() {
        _classCallCheck(this, MaskedRegExp);

        return _possibleConstructorReturn(this, _getPrototypeOf(MaskedRegExp).apply(this, arguments));
      }

      _createClass(MaskedRegExp, [{
        key: "_update",

        /**
          @override
          @param {Object} opts
        */
        value: function _update(opts) {
          if (opts.mask) opts.validate = function (value) {
            return value.search(opts.mask) >= 0;
          };

          _get(_getPrototypeOf(MaskedRegExp.prototype), "_update", this).call(this, opts);
        }
      }]);

      return MaskedRegExp;
    }(Masked);
    IMask.MaskedRegExp = MaskedRegExp;

    /**
      Pattern mask
      @param {Object} opts
      @param {Object} opts.blocks
      @param {Object} opts.definitions
      @param {string} opts.placeholderChar
      @param {boolean} opts.lazy
    */
    var MaskedPattern =
    /*#__PURE__*/
    function (_Masked) {
      _inherits(MaskedPattern, _Masked);

      /** */

      /** */

      /** Single char for empty input */

      /** Show placeholder only when needed */
      function MaskedPattern() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, MaskedPattern);

        // TODO type $Shape<MaskedPatternOptions>={} does not work
        opts.definitions = Object.assign({}, DEFAULT_INPUT_DEFINITIONS, opts.definitions);
        return _possibleConstructorReturn(this, _getPrototypeOf(MaskedPattern).call(this, Object.assign({}, MaskedPattern.DEFAULTS, {}, opts)));
      }
      /**
        @override
        @param {Object} opts
      */


      _createClass(MaskedPattern, [{
        key: "_update",
        value: function _update() {
          var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          opts.definitions = Object.assign({}, this.definitions, opts.definitions);

          _get(_getPrototypeOf(MaskedPattern.prototype), "_update", this).call(this, opts);

          this._rebuildMask();
        }
        /** */

      }, {
        key: "_rebuildMask",
        value: function _rebuildMask() {
          var _this = this;

          var defs = this.definitions;
          this._blocks = [];
          this._stops = [];
          this._maskedBlocks = {};
          var pattern = this.mask;
          if (!pattern || !defs) return;
          var unmaskingBlock = false;
          var optionalBlock = false;

          for (var i = 0; i < pattern.length; ++i) {
            if (this.blocks) {
              var _ret = function () {
                var p = pattern.slice(i);
                var bNames = Object.keys(_this.blocks).filter(function (bName) {
                  return p.indexOf(bName) === 0;
                }); // order by key length

                bNames.sort(function (a, b) {
                  return b.length - a.length;
                }); // use block name with max length

                var bName = bNames[0];

                if (bName) {
                  var maskedBlock = createMask(Object.assign({
                    parent: _this,
                    lazy: _this.lazy,
                    placeholderChar: _this.placeholderChar,
                    overwrite: _this.overwrite
                  }, _this.blocks[bName]));

                  if (maskedBlock) {
                    _this._blocks.push(maskedBlock); // store block index


                    if (!_this._maskedBlocks[bName]) _this._maskedBlocks[bName] = [];

                    _this._maskedBlocks[bName].push(_this._blocks.length - 1);
                  }

                  i += bName.length - 1;
                  return "continue";
                }
              }();

              if (_ret === "continue") continue;
            }

            var char = pattern[i];

            var _isInput = char in defs;

            if (char === MaskedPattern.STOP_CHAR) {
              this._stops.push(this._blocks.length);

              continue;
            }

            if (char === '{' || char === '}') {
              unmaskingBlock = !unmaskingBlock;
              continue;
            }

            if (char === '[' || char === ']') {
              optionalBlock = !optionalBlock;
              continue;
            }

            if (char === MaskedPattern.ESCAPE_CHAR) {
              ++i;
              char = pattern[i];
              if (!char) break;
              _isInput = false;
            }

            var def = _isInput ? new PatternInputDefinition({
              parent: this,
              lazy: this.lazy,
              placeholderChar: this.placeholderChar,
              mask: defs[char],
              isOptional: optionalBlock
            }) : new PatternFixedDefinition({
              char: char,
              isUnmasking: unmaskingBlock
            });

            this._blocks.push(def);
          }
        }
        /**
          @override
        */

      }, {
        key: "reset",

        /**
          @override
        */
        value: function reset() {
          _get(_getPrototypeOf(MaskedPattern.prototype), "reset", this).call(this);

          this._blocks.forEach(function (b) {
            return b.reset();
          });
        }
        /**
          @override
        */

      }, {
        key: "doCommit",

        /**
          @override
        */
        value: function doCommit() {
          this._blocks.forEach(function (b) {
            return b.doCommit();
          });

          _get(_getPrototypeOf(MaskedPattern.prototype), "doCommit", this).call(this);
        }
        /**
          @override
        */

      }, {
        key: "appendTail",

        /**
          @override
        */
        value: function appendTail(tail) {
          return _get(_getPrototypeOf(MaskedPattern.prototype), "appendTail", this).call(this, tail).aggregate(this._appendPlaceholder());
        }
        /**
          @override
        */

      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw(ch) {
          var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          ch = this.doPrepare(ch, flags);

          var blockIter = this._mapPosToBlock(this.value.length);

          var details = new ChangeDetails();
          if (!blockIter) return details;

          for (var bi = blockIter.index;; ++bi) {
            var _block = this._blocks[bi];
            if (!_block) break;

            var blockDetails = _block._appendChar(ch, flags);

            var skip = blockDetails.skip;
            details.aggregate(blockDetails);
            if (skip || blockDetails.rawInserted) break; // go next char
          }

          return details;
        }
        /**
          @override
        */

      }, {
        key: "extractTail",
        value: function extractTail() {
          var _this2 = this;

          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
          var chunkTail = new ChunksTailDetails();
          if (fromPos === toPos) return chunkTail;

          this._forEachBlocksInRange(fromPos, toPos, function (b, bi, bFromPos, bToPos) {
            var blockChunk = b.extractTail(bFromPos, bToPos);
            blockChunk.stop = _this2._findStopBefore(bi);
            blockChunk.from = _this2._blockStartPos(bi);
            if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
            chunkTail.extend(blockChunk);
          });

          return chunkTail;
        }
        /**
          @override
        */

      }, {
        key: "extractInput",
        value: function extractInput() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
          var flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          if (fromPos === toPos) return '';
          var input = '';

          this._forEachBlocksInRange(fromPos, toPos, function (b, _, fromPos, toPos) {
            input += b.extractInput(fromPos, toPos, flags);
          });

          return input;
        }
      }, {
        key: "_findStopBefore",
        value: function _findStopBefore(blockIndex) {
          var stopBefore;

          for (var si = 0; si < this._stops.length; ++si) {
            var stop = this._stops[si];
            if (stop <= blockIndex) stopBefore = stop;else break;
          }

          return stopBefore;
        }
        /** Appends placeholder depending on laziness */

      }, {
        key: "_appendPlaceholder",
        value: function _appendPlaceholder(toBlockIndex) {
          var _this3 = this;

          var details = new ChangeDetails();
          if (this.lazy && toBlockIndex == null) return details;

          var startBlockIter = this._mapPosToBlock(this.value.length);

          if (!startBlockIter) return details;
          var startBlockIndex = startBlockIter.index;
          var endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;

          this._blocks.slice(startBlockIndex, endBlockIndex).forEach(function (b) {
            if (!b.lazy || toBlockIndex != null) {
              // $FlowFixMe `_blocks` may not be present
              var args = b._blocks != null ? [b._blocks.length] : [];

              var bDetails = b._appendPlaceholder.apply(b, args);

              _this3._value += bDetails.inserted;
              details.aggregate(bDetails);
            }
          });

          return details;
        }
        /** Finds block in pos */

      }, {
        key: "_mapPosToBlock",
        value: function _mapPosToBlock(pos) {
          var accVal = '';

          for (var bi = 0; bi < this._blocks.length; ++bi) {
            var _block2 = this._blocks[bi];
            var blockStartPos = accVal.length;
            accVal += _block2.value;

            if (pos <= accVal.length) {
              return {
                index: bi,
                offset: pos - blockStartPos
              };
            }
          }
        }
        /** */

      }, {
        key: "_blockStartPos",
        value: function _blockStartPos(blockIndex) {
          return this._blocks.slice(0, blockIndex).reduce(function (pos, b) {
            return pos += b.value.length;
          }, 0);
        }
        /** */

      }, {
        key: "_forEachBlocksInRange",
        value: function _forEachBlocksInRange(fromPos) {
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
          var fn = arguments.length > 2 ? arguments[2] : undefined;

          var fromBlockIter = this._mapPosToBlock(fromPos);

          if (fromBlockIter) {
            var toBlockIter = this._mapPosToBlock(toPos); // process first block


            var isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
            var fromBlockStartPos = fromBlockIter.offset;
            var fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].value.length;
            fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);

            if (toBlockIter && !isSameBlock) {
              // process intermediate blocks
              for (var bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
                fn(this._blocks[bi], bi, 0, this._blocks[bi].value.length);
              } // process last block


              fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
            }
          }
        }
        /**
          @override
        */

      }, {
        key: "remove",
        value: function remove() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

          var removeDetails = _get(_getPrototypeOf(MaskedPattern.prototype), "remove", this).call(this, fromPos, toPos);

          this._forEachBlocksInRange(fromPos, toPos, function (b, _, bFromPos, bToPos) {
            removeDetails.aggregate(b.remove(bFromPos, bToPos));
          });

          return removeDetails;
        }
        /**
          @override
        */

      }, {
        key: "nearestInputPos",
        value: function nearestInputPos(cursorPos) {
          var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
          // TODO refactor - extract alignblock
          var beginBlockData = this._mapPosToBlock(cursorPos) || {
            index: 0,
            offset: 0
          };
          var beginBlockOffset = beginBlockData.offset,
              beginBlockIndex = beginBlockData.index;
          var beginBlock = this._blocks[beginBlockIndex];
          if (!beginBlock) return cursorPos;
          var beginBlockCursorPos = beginBlockOffset; // if position inside block - try to adjust it

          if (beginBlockCursorPos !== 0 && beginBlockCursorPos < beginBlock.value.length) {
            beginBlockCursorPos = beginBlock.nearestInputPos(beginBlockOffset, forceDirection(direction));
          }

          var cursorAtRight = beginBlockCursorPos === beginBlock.value.length;
          var cursorAtLeft = beginBlockCursorPos === 0; //  cursor is INSIDE first block (not at bounds)

          if (!cursorAtLeft && !cursorAtRight) return this._blockStartPos(beginBlockIndex) + beginBlockCursorPos;
          var searchBlockIndex = cursorAtRight ? beginBlockIndex + 1 : beginBlockIndex;

          if (direction === DIRECTION.NONE) {
            // NONE direction used to calculate start input position if no chars were removed
            // FOR NONE:
            // -
            // input|any
            // ->
            //  any|input
            // <-
            //  filled-input|any
            // check if first block at left is input
            if (searchBlockIndex > 0) {
              var blockIndexAtLeft = searchBlockIndex - 1;
              var blockAtLeft = this._blocks[blockIndexAtLeft];
              var blockInputPos = blockAtLeft.nearestInputPos(0, DIRECTION.NONE); // is input

              if (!blockAtLeft.value.length || blockInputPos !== blockAtLeft.value.length) {
                return this._blockStartPos(searchBlockIndex);
              }
            } // ->


            var firstInputAtRight = searchBlockIndex;

            for (var bi = firstInputAtRight; bi < this._blocks.length; ++bi) {
              var blockAtRight = this._blocks[bi];

              var _blockInputPos = blockAtRight.nearestInputPos(0, DIRECTION.NONE);

              if (!blockAtRight.value.length || _blockInputPos !== blockAtRight.value.length) {
                return this._blockStartPos(bi) + _blockInputPos;
              }
            } // <-
            // find first non-fixed symbol


            for (var _bi = searchBlockIndex - 1; _bi >= 0; --_bi) {
              var _block3 = this._blocks[_bi];

              var _blockInputPos2 = _block3.nearestInputPos(0, DIRECTION.NONE); // is input


              if (!_block3.value.length || _blockInputPos2 !== _block3.value.length) {
                return this._blockStartPos(_bi) + _block3.value.length;
              }
            }

            return cursorPos;
          }

          if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
            // -
            //  any|filled-input
            // <-
            //  any|first not empty is not-len-aligned
            //  not-0-aligned|any
            // ->
            //  any|not-len-aligned or end
            // check if first block at right is filled input
            var firstFilledBlockIndexAtRight;

            for (var _bi2 = searchBlockIndex; _bi2 < this._blocks.length; ++_bi2) {
              if (this._blocks[_bi2].value) {
                firstFilledBlockIndexAtRight = _bi2;
                break;
              }
            }

            if (firstFilledBlockIndexAtRight != null) {
              var filledBlock = this._blocks[firstFilledBlockIndexAtRight];

              var _blockInputPos3 = filledBlock.nearestInputPos(0, DIRECTION.RIGHT);

              if (_blockInputPos3 === 0 && filledBlock.unmaskedValue.length) {
                // filled block is input
                return this._blockStartPos(firstFilledBlockIndexAtRight) + _blockInputPos3;
              }
            } // <-
            // find this vars


            var firstFilledInputBlockIndex = -1;
            var firstEmptyInputBlockIndex; // TODO consider nested empty inputs

            for (var _bi3 = searchBlockIndex - 1; _bi3 >= 0; --_bi3) {
              var _block4 = this._blocks[_bi3];

              var _blockInputPos4 = _block4.nearestInputPos(_block4.value.length, DIRECTION.FORCE_LEFT);

              if (!_block4.value || _blockInputPos4 !== 0) firstEmptyInputBlockIndex = _bi3;

              if (_blockInputPos4 !== 0) {
                if (_blockInputPos4 !== _block4.value.length) {
                  // aligned inside block - return immediately
                  return this._blockStartPos(_bi3) + _blockInputPos4;
                } else {
                  // found filled
                  firstFilledInputBlockIndex = _bi3;
                  break;
                }
              }
            }

            if (direction === DIRECTION.LEFT) {
              // try find first empty input before start searching position only when not forced
              for (var _bi4 = firstFilledInputBlockIndex + 1; _bi4 <= Math.min(searchBlockIndex, this._blocks.length - 1); ++_bi4) {
                var _block5 = this._blocks[_bi4];

                var _blockInputPos5 = _block5.nearestInputPos(0, DIRECTION.NONE);

                var blockAlignedPos = this._blockStartPos(_bi4) + _blockInputPos5;

                if (blockAlignedPos > cursorPos) break; // if block is not lazy input

                if (_blockInputPos5 !== _block5.value.length) return blockAlignedPos;
              }
            } // process overflow


            if (firstFilledInputBlockIndex >= 0) {
              return this._blockStartPos(firstFilledInputBlockIndex) + this._blocks[firstFilledInputBlockIndex].value.length;
            } // for lazy if has aligned left inside fixed and has came to the start - use start position


            if (direction === DIRECTION.FORCE_LEFT || this.lazy && !this.extractInput() && !isInput(this._blocks[searchBlockIndex])) {
              return 0;
            }

            if (firstEmptyInputBlockIndex != null) {
              return this._blockStartPos(firstEmptyInputBlockIndex);
            } // find first input


            for (var _bi5 = searchBlockIndex; _bi5 < this._blocks.length; ++_bi5) {
              var _block6 = this._blocks[_bi5];

              var _blockInputPos6 = _block6.nearestInputPos(0, DIRECTION.NONE); // is input


              if (!_block6.value.length || _blockInputPos6 !== _block6.value.length) {
                return this._blockStartPos(_bi5) + _blockInputPos6;
              }
            }

            return 0;
          }

          if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
            // ->
            //  any|not-len-aligned and filled
            //  any|not-len-aligned
            // <-
            //  not-0-aligned or start|any
            var firstInputBlockAlignedIndex;
            var firstInputBlockAlignedPos;

            for (var _bi6 = searchBlockIndex; _bi6 < this._blocks.length; ++_bi6) {
              var _block7 = this._blocks[_bi6];

              var _blockInputPos7 = _block7.nearestInputPos(0, DIRECTION.NONE);

              if (_blockInputPos7 !== _block7.value.length) {
                firstInputBlockAlignedPos = this._blockStartPos(_bi6) + _blockInputPos7;
                firstInputBlockAlignedIndex = _bi6;
                break;
              }
            }

            if (firstInputBlockAlignedIndex != null && firstInputBlockAlignedPos != null) {
              for (var _bi7 = firstInputBlockAlignedIndex; _bi7 < this._blocks.length; ++_bi7) {
                var _block8 = this._blocks[_bi7];

                var _blockInputPos8 = _block8.nearestInputPos(0, DIRECTION.FORCE_RIGHT);

                if (_blockInputPos8 !== _block8.value.length) {
                  return this._blockStartPos(_bi7) + _blockInputPos8;
                }
              }

              return direction === DIRECTION.FORCE_RIGHT ? this.value.length : firstInputBlockAlignedPos;
            }

            for (var _bi8 = Math.min(searchBlockIndex, this._blocks.length - 1); _bi8 >= 0; --_bi8) {
              var _block9 = this._blocks[_bi8];

              var _blockInputPos9 = _block9.nearestInputPos(_block9.value.length, DIRECTION.LEFT);

              if (_blockInputPos9 !== 0) {
                var alignedPos = this._blockStartPos(_bi8) + _blockInputPos9;

                if (alignedPos >= cursorPos) return alignedPos;
                break;
              }
            }
          }

          return cursorPos;
        }
        /** Get block by name */

      }, {
        key: "maskedBlock",
        value: function maskedBlock(name) {
          return this.maskedBlocks(name)[0];
        }
        /** Get all blocks by name */

      }, {
        key: "maskedBlocks",
        value: function maskedBlocks(name) {
          var _this4 = this;

          var indices = this._maskedBlocks[name];
          if (!indices) return [];
          return indices.map(function (gi) {
            return _this4._blocks[gi];
          });
        }
      }, {
        key: "state",
        get: function get() {
          return Object.assign({}, _get(_getPrototypeOf(MaskedPattern.prototype), "state", this), {
            _blocks: this._blocks.map(function (b) {
              return b.state;
            })
          });
        },
        set: function set(state) {
          var _blocks = state._blocks,
              maskedState = _objectWithoutProperties(state, ["_blocks"]);

          this._blocks.forEach(function (b, bi) {
            return b.state = _blocks[bi];
          });

          _set(_getPrototypeOf(MaskedPattern.prototype), "state", maskedState, this, true);
        }
      }, {
        key: "isComplete",
        get: function get() {
          return this._blocks.every(function (b) {
            return b.isComplete;
          });
        }
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this._blocks.reduce(function (str, b) {
            return str += b.unmaskedValue;
          }, '');
        },
        set: function set(unmaskedValue) {
          _set(_getPrototypeOf(MaskedPattern.prototype), "unmaskedValue", unmaskedValue, this, true);
        }
        /**
          @override
        */

      }, {
        key: "value",
        get: function get() {
          // TODO return _value when not in change?
          return this._blocks.reduce(function (str, b) {
            return str += b.value;
          }, '');
        },
        set: function set(value) {
          _set(_getPrototypeOf(MaskedPattern.prototype), "value", value, this, true);
        }
      }]);

      return MaskedPattern;
    }(Masked);
    MaskedPattern.DEFAULTS = {
      lazy: true,
      placeholderChar: '_'
    };
    MaskedPattern.STOP_CHAR = '`';
    MaskedPattern.ESCAPE_CHAR = '\\';
    MaskedPattern.InputDefinition = PatternInputDefinition;
    MaskedPattern.FixedDefinition = PatternFixedDefinition;

    function isInput(block) {
      if (!block) return false;
      var value = block.value;
      return !value || block.nearestInputPos(0, DIRECTION.NONE) !== value.length;
    }

    IMask.MaskedPattern = MaskedPattern;

    /** Pattern which accepts ranges */

    var MaskedRange =
    /*#__PURE__*/
    function (_MaskedPattern) {
      _inherits(MaskedRange, _MaskedPattern);

      function MaskedRange() {
        _classCallCheck(this, MaskedRange);

        return _possibleConstructorReturn(this, _getPrototypeOf(MaskedRange).apply(this, arguments));
      }

      _createClass(MaskedRange, [{
        key: "_update",

        /**
          @override
        */
        value: function _update(opts) {
          // TODO type
          opts = Object.assign({
            to: this.to || 0,
            from: this.from || 0
          }, opts);
          var maxLength = String(opts.to).length;
          if (opts.maxLength != null) maxLength = Math.max(maxLength, opts.maxLength);
          opts.maxLength = maxLength;
          var fromStr = String(opts.from).padStart(maxLength, '0');
          var toStr = String(opts.to).padStart(maxLength, '0');
          var sameCharsCount = 0;

          while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) {
            ++sameCharsCount;
          }

          opts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, '\\0') + '0'.repeat(maxLength - sameCharsCount);

          _get(_getPrototypeOf(MaskedRange.prototype), "_update", this).call(this, opts);
        }
        /**
          @override
        */

      }, {
        key: "boundaries",
        value: function boundaries(str) {
          var minstr = '';
          var maxstr = '';

          var _ref = str.match(/^(\D*)(\d*)(\D*)/) || [],
              _ref2 = _slicedToArray(_ref, 3),
              placeholder = _ref2[1],
              num = _ref2[2];

          if (num) {
            minstr = '0'.repeat(placeholder.length) + num;
            maxstr = '9'.repeat(placeholder.length) + num;
          }

          minstr = minstr.padEnd(this.maxLength, '0');
          maxstr = maxstr.padEnd(this.maxLength, '9');
          return [minstr, maxstr];
        }
        /**
          @override
        */

      }, {
        key: "doPrepare",
        value: function doPrepare(str) {
          var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          str = _get(_getPrototypeOf(MaskedRange.prototype), "doPrepare", this).call(this, str, flags).replace(/\D/g, '');
          if (!this.autofix) return str;
          var fromStr = String(this.from).padStart(this.maxLength, '0');
          var toStr = String(this.to).padStart(this.maxLength, '0');
          var val = this.value;
          var prepStr = '';

          for (var ci = 0; ci < str.length; ++ci) {
            var nextVal = val + prepStr + str[ci];

            var _this$boundaries = this.boundaries(nextVal),
                _this$boundaries2 = _slicedToArray(_this$boundaries, 2),
                minstr = _this$boundaries2[0],
                maxstr = _this$boundaries2[1];

            if (Number(maxstr) < this.from) prepStr += fromStr[nextVal.length - 1];else if (Number(minstr) > this.to) prepStr += toStr[nextVal.length - 1];else prepStr += str[ci];
          }

          return prepStr;
        }
        /**
          @override
        */

      }, {
        key: "doValidate",
        value: function doValidate() {
          var _get2;

          var str = this.value;
          var firstNonZero = str.search(/[^0]/);
          if (firstNonZero === -1 && str.length <= this._matchFrom) return true;

          var _this$boundaries3 = this.boundaries(str),
              _this$boundaries4 = _slicedToArray(_this$boundaries3, 2),
              minstr = _this$boundaries4[0],
              maxstr = _this$boundaries4[1];

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return this.from <= Number(maxstr) && Number(minstr) <= this.to && (_get2 = _get(_getPrototypeOf(MaskedRange.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args));
        }
      }, {
        key: "_matchFrom",

        /**
          Optionally sets max length of pattern.
          Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
        */

        /** Min bound */

        /** Max bound */

        /** */
        get: function get() {
          return this.maxLength - String(this.from).length;
        }
      }, {
        key: "isComplete",
        get: function get() {
          return _get(_getPrototypeOf(MaskedRange.prototype), "isComplete", this) && Boolean(this.value);
        }
      }]);

      return MaskedRange;
    }(MaskedPattern);
    IMask.MaskedRange = MaskedRange;

    /** Date mask */

    var MaskedDate =
    /*#__PURE__*/
    function (_MaskedPattern) {
      _inherits(MaskedDate, _MaskedPattern);

      /** Pattern mask for date according to {@link MaskedDate#format} */

      /** Start date */

      /** End date */

      /** */

      /**
        @param {Object} opts
      */
      function MaskedDate(opts) {
        _classCallCheck(this, MaskedDate);

        return _possibleConstructorReturn(this, _getPrototypeOf(MaskedDate).call(this, Object.assign({}, MaskedDate.DEFAULTS, {}, opts)));
      }
      /**
        @override
      */


      _createClass(MaskedDate, [{
        key: "_update",
        value: function _update(opts) {
          if (opts.mask === Date) delete opts.mask;
          if (opts.pattern) opts.mask = opts.pattern;
          var blocks = opts.blocks;
          opts.blocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS()); // adjust year block

          if (opts.min) opts.blocks.Y.from = opts.min.getFullYear();
          if (opts.max) opts.blocks.Y.to = opts.max.getFullYear();

          if (opts.min && opts.max && opts.blocks.Y.from === opts.blocks.Y.to) {
            opts.blocks.m.from = opts.min.getMonth() + 1;
            opts.blocks.m.to = opts.max.getMonth() + 1;

            if (opts.blocks.m.from === opts.blocks.m.to) {
              opts.blocks.d.from = opts.min.getDate();
              opts.blocks.d.to = opts.max.getDate();
            }
          }

          Object.assign(opts.blocks, blocks); // add autofix

          Object.keys(opts.blocks).forEach(function (bk) {
            var b = opts.blocks[bk];
            if (!('autofix' in b)) b.autofix = opts.autofix;
          });

          _get(_getPrototypeOf(MaskedDate.prototype), "_update", this).call(this, opts);
        }
        /**
          @override
        */

      }, {
        key: "doValidate",
        value: function doValidate() {
          var _get2;

          var date = this.date;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return (_get2 = _get(_getPrototypeOf(MaskedDate.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args)) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
        }
        /** Checks if date is exists */

      }, {
        key: "isDateExist",
        value: function isDateExist(str) {
          return this.format(this.parse(str, this), this).indexOf(str) >= 0;
        }
        /** Parsed Date */

      }, {
        key: "date",
        get: function get() {
          return this.typedValue;
        },
        set: function set(date) {
          this.typedValue = date;
        }
        /**
          @override
        */

      }, {
        key: "typedValue",
        get: function get() {
          return this.isComplete ? _get(_getPrototypeOf(MaskedDate.prototype), "typedValue", this) : null;
        },
        set: function set(value) {
          _set(_getPrototypeOf(MaskedDate.prototype), "typedValue", value, this, true);
        }
      }]);

      return MaskedDate;
    }(MaskedPattern);
    MaskedDate.DEFAULTS = {
      pattern: 'd{.}`m{.}`Y',
      format: function format(date) {
        var day = String(date.getDate()).padStart(2, '0');
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var year = date.getFullYear();
        return [day, month, year].join('.');
      },
      parse: function parse(str) {
        var _str$split = str.split('.'),
            _str$split2 = _slicedToArray(_str$split, 3),
            day = _str$split2[0],
            month = _str$split2[1],
            year = _str$split2[2];

        return new Date(year, month - 1, day);
      }
    };

    MaskedDate.GET_DEFAULT_BLOCKS = function () {
      return {
        d: {
          mask: MaskedRange,
          from: 1,
          to: 31,
          maxLength: 2
        },
        m: {
          mask: MaskedRange,
          from: 1,
          to: 12,
          maxLength: 2
        },
        Y: {
          mask: MaskedRange,
          from: 1900,
          to: 9999
        }
      };
    };

    IMask.MaskedDate = MaskedDate;

    /**
      Generic element API to use with mask
      @interface
    */
    var MaskElement =
    /*#__PURE__*/
    function () {
      function MaskElement() {
        _classCallCheck(this, MaskElement);
      }

      _createClass(MaskElement, [{
        key: "select",

        /** Safely sets element selection */
        value: function select(start, end) {
          if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd) return;

          try {
            this._unsafeSelect(start, end);
          } catch (e) {}
        }
        /** Should be overriden in subclasses */

      }, {
        key: "_unsafeSelect",
        value: function _unsafeSelect(start, end) {}
        /** Should be overriden in subclasses */

      }, {
        key: "bindEvents",

        /** Should be overriden in subclasses */
        value: function bindEvents(handlers) {}
        /** Should be overriden in subclasses */

      }, {
        key: "unbindEvents",
        value: function unbindEvents() {}
      }, {
        key: "selectionStart",

        /** */

        /** */

        /** */

        /** Safely returns selection start */
        get: function get() {
          var start;

          try {
            start = this._unsafeSelectionStart;
          } catch (e) {}

          return start != null ? start : this.value.length;
        }
        /** Safely returns selection end */

      }, {
        key: "selectionEnd",
        get: function get() {
          var end;

          try {
            end = this._unsafeSelectionEnd;
          } catch (e) {}

          return end != null ? end : this.value.length;
        }
      }, {
        key: "isActive",
        get: function get() {
          return false;
        }
      }]);

      return MaskElement;
    }();
    IMask.MaskElement = MaskElement;

    /** Bridge between HTMLElement and {@link Masked} */

    var HTMLMaskElement =
    /*#__PURE__*/
    function (_MaskElement) {
      _inherits(HTMLMaskElement, _MaskElement);

      /** Mapping between HTMLElement events and mask internal events */

      /** HTMLElement to use mask on */

      /**
        @param {HTMLInputElement|HTMLTextAreaElement} input
      */
      function HTMLMaskElement(input) {
        var _this;

        _classCallCheck(this, HTMLMaskElement);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(HTMLMaskElement).call(this));
        _this.input = input;
        _this._handlers = {};
        return _this;
      }
      /** */
      // $FlowFixMe https://github.com/facebook/flow/issues/2839


      _createClass(HTMLMaskElement, [{
        key: "_unsafeSelect",

        /**
          Sets HTMLElement selection
          @override
        */
        value: function _unsafeSelect(start, end) {
          this.input.setSelectionRange(start, end);
        }
        /**
          HTMLElement value
          @override
        */

      }, {
        key: "bindEvents",

        /**
          Binds HTMLElement events to mask internal events
          @override
        */
        value: function bindEvents(handlers) {
          var _this2 = this;

          Object.keys(handlers).forEach(function (event) {
            return _this2._toggleEventHandler(HTMLMaskElement.EVENTS_MAP[event], handlers[event]);
          });
        }
        /**
          Unbinds HTMLElement events to mask internal events
          @override
        */

      }, {
        key: "unbindEvents",
        value: function unbindEvents() {
          var _this3 = this;

          Object.keys(this._handlers).forEach(function (event) {
            return _this3._toggleEventHandler(event);
          });
        }
        /** */

      }, {
        key: "_toggleEventHandler",
        value: function _toggleEventHandler(event, handler) {
          if (this._handlers[event]) {
            this.input.removeEventListener(event, this._handlers[event]);
            delete this._handlers[event];
          }

          if (handler) {
            this.input.addEventListener(event, handler);
            this._handlers[event] = handler;
          }
        }
      }, {
        key: "rootElement",
        get: function get() {
          return this.input.getRootNode ? this.input.getRootNode() : document;
        }
        /**
          Is element in focus
          @readonly
        */

      }, {
        key: "isActive",
        get: function get() {
          //$FlowFixMe
          return this.input === this.rootElement.activeElement;
        }
        /**
          Returns HTMLElement selection start
          @override
        */

      }, {
        key: "_unsafeSelectionStart",
        get: function get() {
          return this.input.selectionStart;
        }
        /**
          Returns HTMLElement selection end
          @override
        */

      }, {
        key: "_unsafeSelectionEnd",
        get: function get() {
          return this.input.selectionEnd;
        }
      }, {
        key: "value",
        get: function get() {
          return this.input.value;
        },
        set: function set(value) {
          this.input.value = value;
        }
      }]);

      return HTMLMaskElement;
    }(MaskElement);
    HTMLMaskElement.EVENTS_MAP = {
      selectionChange: 'keydown',
      input: 'input',
      drop: 'drop',
      click: 'click',
      focus: 'focus',
      commit: 'blur'
    };
    IMask.HTMLMaskElement = HTMLMaskElement;

    var HTMLContenteditableMaskElement =
    /*#__PURE__*/
    function (_HTMLMaskElement) {
      _inherits(HTMLContenteditableMaskElement, _HTMLMaskElement);

      function HTMLContenteditableMaskElement() {
        _classCallCheck(this, HTMLContenteditableMaskElement);

        return _possibleConstructorReturn(this, _getPrototypeOf(HTMLContenteditableMaskElement).apply(this, arguments));
      }

      _createClass(HTMLContenteditableMaskElement, [{
        key: "_unsafeSelect",

        /**
          Sets HTMLElement selection
          @override
        */
        value: function _unsafeSelect(start, end) {
          if (!this.rootElement.createRange) return;
          var range = this.rootElement.createRange();
          range.setStart(this.input.firstChild || this.input, start);
          range.setEnd(this.input.lastChild || this.input, end);
          var root = this.rootElement;
          var selection = root.getSelection && root.getSelection();

          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
        /**
          HTMLElement value
          @override
        */

      }, {
        key: "_unsafeSelectionStart",

        /**
          Returns HTMLElement selection start
          @override
        */
        get: function get() {
          var root = this.rootElement;
          var selection = root.getSelection && root.getSelection();
          return selection && selection.anchorOffset;
        }
        /**
          Returns HTMLElement selection end
          @override
        */

      }, {
        key: "_unsafeSelectionEnd",
        get: function get() {
          var root = this.rootElement;
          var selection = root.getSelection && root.getSelection();
          return selection && this._unsafeSelectionStart + String(selection).length;
        }
      }, {
        key: "value",
        get: function get() {
          // $FlowFixMe
          return this.input.textContent;
        },
        set: function set(value) {
          this.input.textContent = value;
        }
      }]);

      return HTMLContenteditableMaskElement;
    }(HTMLMaskElement);
    IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;

    /** Listens to element events and controls changes between element and {@link Masked} */

    var InputMask =
    /*#__PURE__*/
    function () {
      /**
        View element
        @readonly
      */

      /**
        Internal {@link Masked} model
        @readonly
      */

      /**
        @param {MaskElement|HTMLInputElement|HTMLTextAreaElement} el
        @param {Object} opts
      */
      function InputMask(el, opts) {
        _classCallCheck(this, InputMask);

        this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' ? new HTMLContenteditableMaskElement(el) : new HTMLMaskElement(el);
        this.masked = createMask(opts);
        this._listeners = {};
        this._value = '';
        this._unmaskedValue = '';
        this._saveSelection = this._saveSelection.bind(this);
        this._onInput = this._onInput.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onDrop = this._onDrop.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onClick = this._onClick.bind(this);
        this.alignCursor = this.alignCursor.bind(this);
        this.alignCursorFriendly = this.alignCursorFriendly.bind(this);

        this._bindEvents(); // refresh


        this.updateValue();

        this._onChange();
      }
      /** Read or update mask */


      _createClass(InputMask, [{
        key: "maskEquals",
        value: function maskEquals(mask) {
          return mask == null || mask === this.masked.mask || mask === Date && this.masked instanceof MaskedDate;
        }
      }, {
        key: "_bindEvents",

        /**
          Starts listening to element events
          @protected
        */
        value: function _bindEvents() {
          this.el.bindEvents({
            selectionChange: this._saveSelection,
            input: this._onInput,
            drop: this._onDrop,
            click: this._onClick,
            focus: this._onFocus,
            commit: this._onChange
          });
        }
        /**
          Stops listening to element events
          @protected
         */

      }, {
        key: "_unbindEvents",
        value: function _unbindEvents() {
          if (this.el) this.el.unbindEvents();
        }
        /**
          Fires custom event
          @protected
         */

      }, {
        key: "_fireEvent",
        value: function _fireEvent(ev) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var listeners = this._listeners[ev];
          if (!listeners) return;
          listeners.forEach(function (l) {
            return l.apply(void 0, args);
          });
        }
        /**
          Current selection start
          @readonly
        */

      }, {
        key: "_saveSelection",

        /**
          Stores current selection
          @protected
        */
        value: function _saveSelection()
        /* ev */
        {
          if (this.value !== this.el.value) {
            console.warn('Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.'); // eslint-disable-line no-console
          }

          this._selection = {
            start: this.selectionStart,
            end: this.cursorPos
          };
        }
        /** Syncronizes model value from view */

      }, {
        key: "updateValue",
        value: function updateValue() {
          this.masked.value = this.el.value;
          this._value = this.masked.value;
        }
        /** Syncronizes view from model value, fires change events */

      }, {
        key: "updateControl",
        value: function updateControl() {
          var newUnmaskedValue = this.masked.unmaskedValue;
          var newValue = this.masked.value;
          var isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;
          this._unmaskedValue = newUnmaskedValue;
          this._value = newValue;
          if (this.el.value !== newValue) this.el.value = newValue;
          if (isChanged) this._fireChangeEvents();
        }
        /** Updates options with deep equal check, recreates @{link Masked} model if mask type changes */

      }, {
        key: "updateOptions",
        value: function updateOptions(opts) {
          var mask = opts.mask,
              restOpts = _objectWithoutProperties(opts, ["mask"]);

          var updateMask = !this.maskEquals(mask);
          var updateOpts = !objectIncludes(this.masked, restOpts);
          if (updateMask) this.mask = mask;
          if (updateOpts) this.masked.updateOptions(restOpts);
          if (updateMask || updateOpts) this.updateControl();
        }
        /** Updates cursor */

      }, {
        key: "updateCursor",
        value: function updateCursor(cursorPos) {
          if (cursorPos == null) return;
          this.cursorPos = cursorPos; // also queue change cursor for mobile browsers

          this._delayUpdateCursor(cursorPos);
        }
        /**
          Delays cursor update to support mobile browsers
          @private
        */

      }, {
        key: "_delayUpdateCursor",
        value: function _delayUpdateCursor(cursorPos) {
          var _this = this;

          this._abortUpdateCursor();

          this._changingCursorPos = cursorPos;
          this._cursorChanging = setTimeout(function () {
            if (!_this.el) return; // if was destroyed

            _this.cursorPos = _this._changingCursorPos;

            _this._abortUpdateCursor();
          }, 10);
        }
        /**
          Fires custom events
          @protected
        */

      }, {
        key: "_fireChangeEvents",
        value: function _fireChangeEvents() {
          this._fireEvent('accept', this._inputEvent);

          if (this.masked.isComplete) this._fireEvent('complete', this._inputEvent);
        }
        /**
          Aborts delayed cursor update
          @private
        */

      }, {
        key: "_abortUpdateCursor",
        value: function _abortUpdateCursor() {
          if (this._cursorChanging) {
            clearTimeout(this._cursorChanging);
            delete this._cursorChanging;
          }
        }
        /** Aligns cursor to nearest available position */

      }, {
        key: "alignCursor",
        value: function alignCursor() {
          this.cursorPos = this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT);
        }
        /** Aligns cursor only if selection is empty */

      }, {
        key: "alignCursorFriendly",
        value: function alignCursorFriendly() {
          if (this.selectionStart !== this.cursorPos) return; // skip if range is selected

          this.alignCursor();
        }
        /** Adds listener on custom event */

      }, {
        key: "on",
        value: function on(ev, handler) {
          if (!this._listeners[ev]) this._listeners[ev] = [];

          this._listeners[ev].push(handler);

          return this;
        }
        /** Removes custom event listener */

      }, {
        key: "off",
        value: function off(ev, handler) {
          if (!this._listeners[ev]) return this;

          if (!handler) {
            delete this._listeners[ev];
            return this;
          }

          var hIndex = this._listeners[ev].indexOf(handler);

          if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
          return this;
        }
        /** Handles view input event */

      }, {
        key: "_onInput",
        value: function _onInput(e) {
          this._inputEvent = e;

          this._abortUpdateCursor(); // fix strange IE behavior


          if (!this._selection) return this.updateValue();
          var details = new ActionDetails( // new state
          this.el.value, this.cursorPos, // old state
          this.value, this._selection);
          var oldRawValue = this.masked.rawInputValue;
          var offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection).offset; // force align in remove direction only if no input chars were removed
          // otherwise we still need to align with NONE (to get out from fixed symbols for instance)

          var removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
          var cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
          this.updateControl();
          this.updateCursor(cursorPos);
          delete this._inputEvent;
        }
        /** Handles view change event and commits model value */

      }, {
        key: "_onChange",
        value: function _onChange() {
          if (this.value !== this.el.value) {
            this.updateValue();
          }

          this.masked.doCommit();
          this.updateControl();

          this._saveSelection();
        }
        /** Handles view drop event, prevents by default */

      }, {
        key: "_onDrop",
        value: function _onDrop(ev) {
          ev.preventDefault();
          ev.stopPropagation();
        }
        /** Restore last selection on focus */

      }, {
        key: "_onFocus",
        value: function _onFocus(ev) {
          this.alignCursorFriendly();
        }
        /** Restore last selection on focus */

      }, {
        key: "_onClick",
        value: function _onClick(ev) {
          this.alignCursorFriendly();
        }
        /** Unbind view events and removes element reference */

      }, {
        key: "destroy",
        value: function destroy() {
          this._unbindEvents(); // $FlowFixMe why not do so?


          this._listeners.length = 0; // $FlowFixMe

          delete this.el;
        }
      }, {
        key: "mask",
        get: function get() {
          return this.masked.mask;
        },
        set: function set(mask) {
          if (this.maskEquals(mask)) return;

          if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
            this.masked.updateOptions({
              mask: mask
            });
            return;
          }

          var masked = createMask({
            mask: mask
          });
          masked.unmaskedValue = this.masked.unmaskedValue;
          this.masked = masked;
        }
        /** Raw value */

      }, {
        key: "value",
        get: function get() {
          return this._value;
        },
        set: function set(str) {
          this.masked.value = str;
          this.updateControl();
          this.alignCursor();
        }
        /** Unmasked value */

      }, {
        key: "unmaskedValue",
        get: function get() {
          return this._unmaskedValue;
        },
        set: function set(str) {
          this.masked.unmaskedValue = str;
          this.updateControl();
          this.alignCursor();
        }
        /** Typed unmasked value */

      }, {
        key: "typedValue",
        get: function get() {
          return this.masked.typedValue;
        },
        set: function set(val) {
          this.masked.typedValue = val;
          this.updateControl();
          this.alignCursor();
        }
      }, {
        key: "selectionStart",
        get: function get() {
          return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
        }
        /** Current cursor position */

      }, {
        key: "cursorPos",
        get: function get() {
          return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
        },
        set: function set(pos) {
          if (!this.el || !this.el.isActive) return;
          this.el.select(pos, pos);

          this._saveSelection();
        }
      }]);

      return InputMask;
    }();
    IMask.InputMask = InputMask;

    /** Pattern which validates enum values */

    var MaskedEnum =
    /*#__PURE__*/
    function (_MaskedPattern) {
      _inherits(MaskedEnum, _MaskedPattern);

      function MaskedEnum() {
        _classCallCheck(this, MaskedEnum);

        return _possibleConstructorReturn(this, _getPrototypeOf(MaskedEnum).apply(this, arguments));
      }

      _createClass(MaskedEnum, [{
        key: "_update",

        /**
          @override
          @param {Object} opts
        */
        value: function _update(opts) {
          // TODO type
          if (opts.enum) opts.mask = '*'.repeat(opts.enum[0].length);

          _get(_getPrototypeOf(MaskedEnum.prototype), "_update", this).call(this, opts);
        }
        /**
          @override
        */

      }, {
        key: "doValidate",
        value: function doValidate() {
          var _this = this,
              _get2;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return this.enum.some(function (e) {
            return e.indexOf(_this.unmaskedValue) >= 0;
          }) && (_get2 = _get(_getPrototypeOf(MaskedEnum.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args));
        }
      }]);

      return MaskedEnum;
    }(MaskedPattern);
    IMask.MaskedEnum = MaskedEnum;

    /**
      Number mask
      @param {Object} opts
      @param {string} opts.radix - Single char
      @param {string} opts.thousandsSeparator - Single char
      @param {Array<string>} opts.mapToRadix - Array of single chars
      @param {number} opts.min
      @param {number} opts.max
      @param {number} opts.scale - Digits after point
      @param {boolean} opts.signed - Allow negative
      @param {boolean} opts.normalizeZeros - Flag to remove leading and trailing zeros in the end of editing
      @param {boolean} opts.padFractionalZeros - Flag to pad trailing zeros after point in the end of editing
    */
    var MaskedNumber =
    /*#__PURE__*/
    function (_Masked) {
      _inherits(MaskedNumber, _Masked);

      /** Single char */

      /** Single char */

      /** Array of single chars */

      /** */

      /** */

      /** Digits after point */

      /** */

      /** Flag to remove leading and trailing zeros in the end of editing */

      /** Flag to pad trailing zeros after point in the end of editing */
      function MaskedNumber(opts) {
        _classCallCheck(this, MaskedNumber);

        return _possibleConstructorReturn(this, _getPrototypeOf(MaskedNumber).call(this, Object.assign({}, MaskedNumber.DEFAULTS, {}, opts)));
      }
      /**
        @override
      */


      _createClass(MaskedNumber, [{
        key: "_update",
        value: function _update(opts) {
          _get(_getPrototypeOf(MaskedNumber.prototype), "_update", this).call(this, opts);

          this._updateRegExps();
        }
        /** */

      }, {
        key: "_updateRegExps",
        value: function _updateRegExps() {
          // use different regexp to process user input (more strict, input suffix) and tail shifting
          var start = '^' + (this.allowNegative ? '[+|\\-]?' : '');
          var midInput = '(0|([1-9]+\\d*))?';
          var mid = '\\d*';
          var end = (this.scale ? '(' + escapeRegExp(this.radix) + '\\d{0,' + this.scale + '})?' : '') + '$';
          this._numberRegExpInput = new RegExp(start + midInput + end);
          this._numberRegExp = new RegExp(start + mid + end);
          this._mapToRadixRegExp = new RegExp('[' + this.mapToRadix.map(escapeRegExp).join('') + ']', 'g');
          this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), 'g');
        }
        /** */

      }, {
        key: "_removeThousandsSeparators",
        value: function _removeThousandsSeparators(value) {
          return value.replace(this._thousandsSeparatorRegExp, '');
        }
        /** */

      }, {
        key: "_insertThousandsSeparators",
        value: function _insertThousandsSeparators(value) {
          // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
          var parts = value.split(this.radix);
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
          return parts.join(this.radix);
        }
        /**
          @override
        */

      }, {
        key: "doPrepare",
        value: function doPrepare(str) {
          var _get2;

          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          return (_get2 = _get(_getPrototypeOf(MaskedNumber.prototype), "doPrepare", this)).call.apply(_get2, [this, this._removeThousandsSeparators(str.replace(this._mapToRadixRegExp, this.radix))].concat(args));
        }
        /** */

      }, {
        key: "_separatorsCount",
        value: function _separatorsCount(to) {
          var extendOnSeparators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          var count = 0;

          for (var pos = 0; pos < to; ++pos) {
            if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
              ++count;
              if (extendOnSeparators) to += this.thousandsSeparator.length;
            }
          }

          return count;
        }
        /** */

      }, {
        key: "_separatorsCountFromSlice",
        value: function _separatorsCountFromSlice() {
          var slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._value;
          return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
        }
        /**
          @override
        */

      }, {
        key: "extractInput",
        value: function extractInput() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
          var flags = arguments.length > 2 ? arguments[2] : undefined;

          var _this$_adjustRangeWit = this._adjustRangeWithSeparators(fromPos, toPos);

          var _this$_adjustRangeWit2 = _slicedToArray(_this$_adjustRangeWit, 2);

          fromPos = _this$_adjustRangeWit2[0];
          toPos = _this$_adjustRangeWit2[1];
          return this._removeThousandsSeparators(_get(_getPrototypeOf(MaskedNumber.prototype), "extractInput", this).call(this, fromPos, toPos, flags));
        }
        /**
          @override
        */

      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw(ch) {
          var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          if (!this.thousandsSeparator) return _get(_getPrototypeOf(MaskedNumber.prototype), "_appendCharRaw", this).call(this, ch, flags);
          var prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;

          var prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);

          this._value = this._removeThousandsSeparators(this.value);

          var appendDetails = _get(_getPrototypeOf(MaskedNumber.prototype), "_appendCharRaw", this).call(this, ch, flags);

          this._value = this._insertThousandsSeparators(this._value);
          var beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;

          var beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);

          appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
          appendDetails.skip = !appendDetails.rawInserted && ch === this.thousandsSeparator;
          return appendDetails;
        }
        /** */

      }, {
        key: "_findSeparatorAround",
        value: function _findSeparatorAround(pos) {
          if (this.thousandsSeparator) {
            var searchFrom = pos - this.thousandsSeparator.length + 1;
            var separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
            if (separatorPos <= pos) return separatorPos;
          }

          return -1;
        }
      }, {
        key: "_adjustRangeWithSeparators",
        value: function _adjustRangeWithSeparators(from, to) {
          var separatorAroundFromPos = this._findSeparatorAround(from);

          if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;

          var separatorAroundToPos = this._findSeparatorAround(to);

          if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
          return [from, to];
        }
        /**
          @override
        */

      }, {
        key: "remove",
        value: function remove() {
          var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

          var _this$_adjustRangeWit3 = this._adjustRangeWithSeparators(fromPos, toPos);

          var _this$_adjustRangeWit4 = _slicedToArray(_this$_adjustRangeWit3, 2);

          fromPos = _this$_adjustRangeWit4[0];
          toPos = _this$_adjustRangeWit4[1];
          var valueBeforePos = this.value.slice(0, fromPos);
          var valueAfterPos = this.value.slice(toPos);

          var prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);

          this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));

          var beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);

          return new ChangeDetails({
            tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
          });
        }
        /**
          @override
        */

      }, {
        key: "nearestInputPos",
        value: function nearestInputPos(cursorPos, direction) {
          if (!this.thousandsSeparator) return cursorPos;

          switch (direction) {
            case DIRECTION.NONE:
            case DIRECTION.LEFT:
            case DIRECTION.FORCE_LEFT:
              {
                var separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);

                if (separatorAtLeftPos >= 0) {
                  var separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;

                  if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) {
                    return separatorAtLeftPos;
                  }
                }

                break;
              }

            case DIRECTION.RIGHT:
            case DIRECTION.FORCE_RIGHT:
              {
                var separatorAtRightPos = this._findSeparatorAround(cursorPos);

                if (separatorAtRightPos >= 0) {
                  return separatorAtRightPos + this.thousandsSeparator.length;
                }
              }
          }

          return cursorPos;
        }
        /**
          @override
        */

      }, {
        key: "doValidate",
        value: function doValidate(flags) {
          var regexp = flags.input ? this._numberRegExpInput : this._numberRegExp; // validate as string

          var valid = regexp.test(this._removeThousandsSeparators(this.value));

          if (valid) {
            // validate as number
            var number = this.number;
            valid = valid && !isNaN(number) && ( // check min bound for negative values
            this.min == null || this.min >= 0 || this.min <= this.number) && ( // check max bound for positive values
            this.max == null || this.max <= 0 || this.number <= this.max);
          }

          return valid && _get(_getPrototypeOf(MaskedNumber.prototype), "doValidate", this).call(this, flags);
        }
        /**
          @override
        */

      }, {
        key: "doCommit",
        value: function doCommit() {
          if (this.value) {
            var number = this.number;
            var validnum = number; // check bounds

            if (this.min != null) validnum = Math.max(validnum, this.min);
            if (this.max != null) validnum = Math.min(validnum, this.max);
            if (validnum !== number) this.unmaskedValue = String(validnum);
            var formatted = this.value;
            if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
            if (this.padFractionalZeros) formatted = this._padFractionalZeros(formatted);
            this._value = formatted;
          }

          _get(_getPrototypeOf(MaskedNumber.prototype), "doCommit", this).call(this);
        }
        /** */

      }, {
        key: "_normalizeZeros",
        value: function _normalizeZeros(value) {
          var parts = this._removeThousandsSeparators(value).split(this.radix); // remove leading zeros


          parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, function (match, sign, zeros, num) {
            return sign + num;
          }); // add leading zero

          if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + '0';

          if (parts.length > 1) {
            parts[1] = parts[1].replace(/0*$/, ''); // remove trailing zeros

            if (!parts[1].length) parts.length = 1; // remove fractional
          }

          return this._insertThousandsSeparators(parts.join(this.radix));
        }
        /** */

      }, {
        key: "_padFractionalZeros",
        value: function _padFractionalZeros(value) {
          if (!value) return value;
          var parts = value.split(this.radix);
          if (parts.length < 2) parts.push('');
          parts[1] = parts[1].padEnd(this.scale, '0');
          return parts.join(this.radix);
        }
        /**
          @override
        */

      }, {
        key: "unmaskedValue",
        get: function get() {
          return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, '.');
        },
        set: function set(unmaskedValue) {
          _set(_getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", unmaskedValue.replace('.', this.radix), this, true);
        }
        /**
          @override
        */

      }, {
        key: "typedValue",
        get: function get() {
          return Number(this.unmaskedValue);
        },
        set: function set(n) {
          _set(_getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", String(n), this, true);
        }
        /** Parsed Number */

      }, {
        key: "number",
        get: function get() {
          return this.typedValue;
        },
        set: function set(number) {
          this.typedValue = number;
        }
        /**
          Is negative allowed
          @readonly
        */

      }, {
        key: "allowNegative",
        get: function get() {
          return this.signed || this.min != null && this.min < 0 || this.max != null && this.max < 0;
        }
      }]);

      return MaskedNumber;
    }(Masked);
    MaskedNumber.DEFAULTS = {
      radix: ',',
      thousandsSeparator: '',
      mapToRadix: ['.'],
      scale: 2,
      signed: false,
      normalizeZeros: true,
      padFractionalZeros: false
    };
    IMask.MaskedNumber = MaskedNumber;

    /** Masking by custom Function */

    var MaskedFunction =
    /*#__PURE__*/
    function (_Masked) {
      _inherits(MaskedFunction, _Masked);

      function MaskedFunction() {
        _classCallCheck(this, MaskedFunction);

        return _possibleConstructorReturn(this, _getPrototypeOf(MaskedFunction).apply(this, arguments));
      }

      _createClass(MaskedFunction, [{
        key: "_update",

        /**
          @override
          @param {Object} opts
        */
        value: function _update(opts) {
          if (opts.mask) opts.validate = opts.mask;

          _get(_getPrototypeOf(MaskedFunction.prototype), "_update", this).call(this, opts);
        }
      }]);

      return MaskedFunction;
    }(Masked);
    IMask.MaskedFunction = MaskedFunction;

    /** Dynamic mask for choosing apropriate mask in run-time */
    var MaskedDynamic =
    /*#__PURE__*/
    function (_Masked) {
      _inherits(MaskedDynamic, _Masked);

      /** Currently chosen mask */

      /** Compliled {@link Masked} options */

      /** Chooses {@link Masked} depending on input value */

      /**
        @param {Object} opts
      */
      function MaskedDynamic(opts) {
        var _this;

        _classCallCheck(this, MaskedDynamic);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(MaskedDynamic).call(this, Object.assign({}, MaskedDynamic.DEFAULTS, {}, opts)));
        _this.currentMask = null;
        return _this;
      }
      /**
        @override
      */


      _createClass(MaskedDynamic, [{
        key: "_update",
        value: function _update(opts) {
          _get(_getPrototypeOf(MaskedDynamic.prototype), "_update", this).call(this, opts);

          if ('mask' in opts) {
            // mask could be totally dynamic with only `dispatch` option
            this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map(function (m) {
              return createMask(m);
            }) : [];
          }
        }
        /**
          @override
        */

      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw() {
          var details = this._applyDispatch.apply(this, arguments);

          if (this.currentMask) {
            var _this$currentMask;

            details.aggregate((_this$currentMask = this.currentMask)._appendChar.apply(_this$currentMask, arguments));
          }

          return details;
        }
      }, {
        key: "_applyDispatch",
        value: function _applyDispatch() {
          var appended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
          var inputValue = this.rawInputValue;
          var insertValue = flags.tail && flags._beforeTailState != null ? // $FlowFixMe - tired to fight with type system
          flags._beforeTailState._rawInputValue : inputValue;
          var tailValue = inputValue.slice(insertValue.length);
          var prevMask = this.currentMask;
          var details = new ChangeDetails();
          var prevMaskState = prevMask && prevMask.state; // clone flags to prevent overwriting `_beforeTailState`

          this.currentMask = this.doDispatch(appended, Object.assign({}, flags)); // restore state after dispatch

          if (this.currentMask) {
            if (this.currentMask !== prevMask) {
              // if mask changed reapply input
              this.currentMask.reset(); // $FlowFixMe - it's ok, we don't change current mask above

              var d = this.currentMask.append(insertValue, {
                raw: true
              });
              details.tailShift = d.inserted.length - prevValueBeforeTail.length;

              if (tailValue) {
                // $FlowFixMe - it's ok, we don't change current mask above
                details.tailShift += this.currentMask.append(tailValue, {
                  raw: true,
                  tail: true
                }).tailShift;
              }
            } else {
              // Dispatch can do something bad with state, so
              // restore prev mask state
              this.currentMask.state = prevMaskState;
            }
          }

          return details;
        }
      }, {
        key: "_appendPlaceholder",
        value: function _appendPlaceholder() {
          var details = this._applyDispatch.apply(this, arguments);

          if (this.currentMask) {
            details.aggregate(this.currentMask._appendPlaceholder());
          }

          return details;
        }
        /**
          @override
        */

      }, {
        key: "doDispatch",
        value: function doDispatch(appended) {
          var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          return this.dispatch(appended, this, flags);
        }
        /**
          @override
        */

      }, {
        key: "doValidate",
        value: function doValidate() {
          var _get2, _this$currentMask2;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return (_get2 = _get(_getPrototypeOf(MaskedDynamic.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args)) && (!this.currentMask || (_this$currentMask2 = this.currentMask).doValidate.apply(_this$currentMask2, args));
        }
        /**
          @override
        */

      }, {
        key: "reset",
        value: function reset() {
          if (this.currentMask) this.currentMask.reset();
          this.compiledMasks.forEach(function (m) {
            return m.reset();
          });
        }
        /**
          @override
        */

      }, {
        key: "remove",

        /**
          @override
        */
        value: function remove() {
          var details = new ChangeDetails();

          if (this.currentMask) {
            var _this$currentMask3;

            details.aggregate((_this$currentMask3 = this.currentMask).remove.apply(_this$currentMask3, arguments)) // update with dispatch
            .aggregate(this._applyDispatch());
          }

          return details;
        }
        /**
          @override
        */

      }, {
        key: "extractInput",

        /**
          @override
        */
        value: function extractInput() {
          var _this$currentMask4;

          return this.currentMask ? (_this$currentMask4 = this.currentMask).extractInput.apply(_this$currentMask4, arguments) : '';
        }
        /**
          @override
        */

      }, {
        key: "extractTail",
        value: function extractTail() {
          var _this$currentMask5, _get3;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return this.currentMask ? (_this$currentMask5 = this.currentMask).extractTail.apply(_this$currentMask5, args) : (_get3 = _get(_getPrototypeOf(MaskedDynamic.prototype), "extractTail", this)).call.apply(_get3, [this].concat(args));
        }
        /**
          @override
        */

      }, {
        key: "doCommit",
        value: function doCommit() {
          if (this.currentMask) this.currentMask.doCommit();

          _get(_getPrototypeOf(MaskedDynamic.prototype), "doCommit", this).call(this);
        }
        /**
          @override
        */

      }, {
        key: "nearestInputPos",
        value: function nearestInputPos() {
          var _this$currentMask6, _get4;

          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return this.currentMask ? (_this$currentMask6 = this.currentMask).nearestInputPos.apply(_this$currentMask6, args) : (_get4 = _get(_getPrototypeOf(MaskedDynamic.prototype), "nearestInputPos", this)).call.apply(_get4, [this].concat(args));
        }
      }, {
        key: "value",
        get: function get() {
          return this.currentMask ? this.currentMask.value : '';
        },
        set: function set(value) {
          _set(_getPrototypeOf(MaskedDynamic.prototype), "value", value, this, true);
        }
        /**
          @override
        */

      }, {
        key: "unmaskedValue",
        get: function get() {
          return this.currentMask ? this.currentMask.unmaskedValue : '';
        },
        set: function set(unmaskedValue) {
          _set(_getPrototypeOf(MaskedDynamic.prototype), "unmaskedValue", unmaskedValue, this, true);
        }
        /**
          @override
        */

      }, {
        key: "typedValue",
        get: function get() {
          return this.currentMask ? this.currentMask.typedValue : '';
        } // probably typedValue should not be used with dynamic
        ,
        set: function set(value) {
          var unmaskedValue = String(value); // double check it

          if (this.currentMask) {
            this.currentMask.typedValue = value;
            unmaskedValue = this.currentMask.unmaskedValue;
          }

          this.unmaskedValue = unmaskedValue;
        }
        /**
          @override
        */

      }, {
        key: "isComplete",
        get: function get() {
          return !!this.currentMask && this.currentMask.isComplete;
        }
      }, {
        key: "state",
        get: function get() {
          return Object.assign({}, _get(_getPrototypeOf(MaskedDynamic.prototype), "state", this), {
            _rawInputValue: this.rawInputValue,
            compiledMasks: this.compiledMasks.map(function (m) {
              return m.state;
            }),
            currentMaskRef: this.currentMask,
            currentMask: this.currentMask && this.currentMask.state
          });
        },
        set: function set(state) {
          var compiledMasks = state.compiledMasks,
              currentMaskRef = state.currentMaskRef,
              currentMask = state.currentMask,
              maskedState = _objectWithoutProperties(state, ["compiledMasks", "currentMaskRef", "currentMask"]);

          this.compiledMasks.forEach(function (m, mi) {
            return m.state = compiledMasks[mi];
          });

          if (currentMaskRef != null) {
            this.currentMask = currentMaskRef;
            this.currentMask.state = currentMask;
          }

          _set(_getPrototypeOf(MaskedDynamic.prototype), "state", maskedState, this, true);
        }
      }, {
        key: "overwrite",
        get: function get() {
          return this.currentMask ? this.currentMask.overwrite : _get(_getPrototypeOf(MaskedDynamic.prototype), "overwrite", this);
        },
        set: function set(overwrite) {
          console.warn('"overwrite" option is not available in dynamic mask, use this option in siblings');
        }
      }]);

      return MaskedDynamic;
    }(Masked);
    MaskedDynamic.DEFAULTS = {
      dispatch: function dispatch(appended, masked, flags) {
        if (!masked.compiledMasks.length) return;
        var inputValue = masked.rawInputValue; // simulate input

        var inputs = masked.compiledMasks.map(function (m, index) {
          m.reset();
          m.append(inputValue, {
            raw: true
          });
          m.append(appended, flags);
          var weight = m.rawInputValue.length;
          return {
            weight: weight,
            index: index
          };
        }); // pop masks with longer values first

        inputs.sort(function (i1, i2) {
          return i2.weight - i1.weight;
        });
        return masked.compiledMasks[inputs[0].index];
      }
    };
    IMask.MaskedDynamic = MaskedDynamic;

    /** Mask pipe source and destination types */

    var PIPE_TYPE = {
      MASKED: 'value',
      UNMASKED: 'unmaskedValue',
      TYPED: 'typedValue'
    };
    /** Creates new pipe function depending on mask type, source and destination options */

    function createPipe(mask) {
      var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PIPE_TYPE.MASKED;
      var to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PIPE_TYPE.MASKED;
      var masked = createMask(mask);
      return function (value) {
        return masked.runIsolated(function (m) {
          m[from] = value;
          return m[to];
        });
      };
    }
    /** Pipes value through mask depending on mask type, source and destination options */

    function pipe(value) {
      for (var _len = arguments.length, pipeArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        pipeArgs[_key - 1] = arguments[_key];
      }

      return createPipe.apply(void 0, pipeArgs)(value);
    }
    IMask.PIPE_TYPE = PIPE_TYPE;
    IMask.createPipe = createPipe;
    IMask.pipe = pipe;

    try {
      globalThis.IMask = IMask;
    } catch (e) {}

    exports.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
    exports.HTMLMaskElement = HTMLMaskElement;
    exports.InputMask = InputMask;
    exports.MaskElement = MaskElement;
    exports.Masked = Masked;
    exports.MaskedDate = MaskedDate;
    exports.MaskedDynamic = MaskedDynamic;
    exports.MaskedEnum = MaskedEnum;
    exports.MaskedFunction = MaskedFunction;
    exports.MaskedNumber = MaskedNumber;
    exports.MaskedPattern = MaskedPattern;
    exports.MaskedRange = MaskedRange;
    exports.MaskedRegExp = MaskedRegExp;
    exports.PIPE_TYPE = PIPE_TYPE;
    exports.createMask = createMask;
    exports.createPipe = createPipe;
    exports.default = IMask;
    exports.pipe = pipe;

    Object.defineProperty(exports, '__esModule', { value: true });

  })));
  //# sourceMappingURL=imask.js.map

// маска для ввода номера
var elements = document.getElementsByClassName('tel');
for (var i = 0; i < elements.length; i++) {
  new IMask(elements[i], {
    mask: '+{7} (000) 000 00 00'
  });
}



//code.jquery.com/jquery-1.11.0
/*! jQuery v1.11.0 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */ ! function(a, b) {
  "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
    if (!a.document) throw new Error("jQuery requires a window with a document");
    return b(a)
} : b(a)
}("undefined" != typeof window ? window : this, function(a, b) {
var c = [],
    d = c.slice,
    e = c.concat,
    f = c.push,
    g = c.indexOf,
    h = {},
    i = h.toString,
    j = h.hasOwnProperty,
    k = "".trim,
    l = {},
    m = "1.11.0",
    n = function(a, b) {
        return new n.fn.init(a, b)
    },
    o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    p = /^-ms-/,
    q = /-([\da-z])/gi,
    r = function(a, b) {
        return b.toUpperCase()
    };
n.fn = n.prototype = {
    jquery: m,
    constructor: n,
    selector: "",
    length: 0,
    toArray: function() {
        return d.call(this)
    },
    get: function(a) {
        return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
    },
    pushStack: function(a) {
        var b = n.merge(this.constructor(), a);
        return b.prevObject = this, b.context = this.context, b
    },
    each: function(a, b) {
        return n.each(this, a, b)
    },
    map: function(a) {
        return this.pushStack(n.map(this, function(b, c) {
            return a.call(b, c, b)
        }))
    },
    slice: function() {
        return this.pushStack(d.apply(this, arguments))
    },
    first: function() {
        return this.eq(0)
    },
    last: function() {
        return this.eq(-1)
    },
    eq: function(a) {
        var b = this.length,
            c = +a + (0 > a ? b : 0);
        return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
    },
    end: function() {
        return this.prevObject || this.constructor(null)
    },
    push: f,
    sort: c.sort,
    splice: c.splice
}, n.extend = n.fn.extend = function() {
    var a, b, c, d, e, f, g = arguments[0] || {},
        h = 1,
        i = arguments.length,
        j = !1;
    for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || n.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)
        if (null != (e = arguments[h]))
            for (d in e) a = g[d], c = e[d], g !== c && (j && c && (n.isPlainObject(c) || (b = n.isArray(c))) ? (b ? (b = !1, f = a && n.isArray(a) ? a : []) : f = a && n.isPlainObject(a) ? a : {}, g[d] = n.extend(j, f, c)) : void 0 !== c && (g[d] = c));
    return g
}, n.extend({
    expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""),
    isReady: !0,
    error: function(a) {
        throw new Error(a)
    },
    noop: function() {},
    isFunction: function(a) {
        return "function" === n.type(a)
    },
    isArray: Array.isArray || function(a) {
        return "array" === n.type(a)
    },
    isWindow: function(a) {
        return null != a && a == a.window
    },
    isNumeric: function(a) {
        return a - parseFloat(a) >= 0
    },
    isEmptyObject: function(a) {
        var b;
        for (b in a) return !1;
        return !0
    },
    isPlainObject: function(a) {
        var b;
        if (!a || "object" !== n.type(a) || a.nodeType || n.isWindow(a)) return !1;
        try {
            if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf")) return !1
        } catch (c) {
            return !1
        }
        if (l.ownLast)
            for (b in a) return j.call(a, b);
        for (b in a);
        return void 0 === b || j.call(a, b)
    },
    type: function(a) {
        return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
    },
    globalEval: function(b) {
        b && n.trim(b) && (a.execScript || function(b) {
            a.eval.call(a, b)
        })(b)
    },
    camelCase: function(a) {
        return a.replace(p, "ms-").replace(q, r)
    },
    nodeName: function(a, b) {
        return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
    },
    each: function(a, b, c) {
        var d, e = 0,
            f = a.length,
            g = s(a);
        if (c) {
            if (g) {
                for (; f > e; e++)
                    if (d = b.apply(a[e], c), d === !1) break
            } else
                for (e in a)
                    if (d = b.apply(a[e], c), d === !1) break
        } else if (g) {
            for (; f > e; e++)
                if (d = b.call(a[e], e, a[e]), d === !1) break
        } else
            for (e in a)
                if (d = b.call(a[e], e, a[e]), d === !1) break;
        return a
    },
    trim: k && !k.call("\ufeff\xa0") ? function(a) {
        return null == a ? "" : k.call(a)
    } : function(a) {
        return null == a ? "" : (a + "").replace(o, "")
    },
    makeArray: function(a, b) {
        var c = b || [];
        return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c
    },
    inArray: function(a, b, c) {
        var d;
        if (b) {
            if (g) return g.call(b, a, c);
            for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                if (c in b && b[c] === a) return c
        }
        return -1
    },
    merge: function(a, b) {
        var c = +b.length,
            d = 0,
            e = a.length;
        while (c > d) a[e++] = b[d++];
        if (c !== c)
            while (void 0 !== b[d]) a[e++] = b[d++];
        return a.length = e, a
    },
    grep: function(a, b, c) {
        for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
        return e
    },
    map: function(a, b, c) {
        var d, f = 0,
            g = a.length,
            h = s(a),
            i = [];
        if (h)
            for (; g > f; f++) d = b(a[f], f, c), null != d && i.push(d);
        else
            for (f in a) d = b(a[f], f, c), null != d && i.push(d);
        return e.apply([], i)
    },
    guid: 1,
    proxy: function(a, b) {
        var c, e, f;
        return "string" == typeof b && (f = a[b], b = a, a = f), n.isFunction(a) ? (c = d.call(arguments, 2), e = function() {
            return a.apply(b || this, c.concat(d.call(arguments)))
        }, e.guid = a.guid = a.guid || n.guid++, e) : void 0
    },
    now: function() {
        return +new Date
    },
    support: l
}), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
    h["[object " + b + "]"] = b.toLowerCase()
});

function s(a) {
    var b = a.length,
        c = n.type(a);
    return "function" === c || n.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
}
var t = function(a) {
    var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s = "sizzle" + -new Date,
        t = a.document,
        u = 0,
        v = 0,
        w = eb(),
        x = eb(),
        y = eb(),
        z = function(a, b) {
            return a === b && (j = !0), 0
        },
        A = "undefined",
        B = 1 << 31,
        C = {}.hasOwnProperty,
        D = [],
        E = D.pop,
        F = D.push,
        G = D.push,
        H = D.slice,
        I = D.indexOf || function(a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (this[b] === a) return b;
            return -1
        },
        J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        K = "[\\x20\\t\\r\\n\\f]",
        L = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        M = L.replace("w", "w#"),
        N = "\\[" + K + "*(" + L + ")" + K + "*(?:([*^$|!~]?=)" + K + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + M + ")|)|)" + K + "*\\]",
        O = ":(" + L + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + N.replace(3, 8) + ")*)|.*)\\)|)",
        P = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$", "g"),
        Q = new RegExp("^" + K + "*," + K + "*"),
        R = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"),
        S = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]", "g"),
        T = new RegExp(O),
        U = new RegExp("^" + M + "$"),
        V = {
            ID: new RegExp("^#(" + L + ")"),
            CLASS: new RegExp("^\\.(" + L + ")"),
            TAG: new RegExp("^(" + L.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + N),
            PSEUDO: new RegExp("^" + O),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + K + "*(even|odd|(([+-]|)(\\d*)n|)" + K + "*(?:([+-]|)" + K + "*(\\d+)|))" + K + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + J + ")$", "i"),
            needsContext: new RegExp("^" + K + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + K + "*((?:-\\d)?\\d*)" + K + "*\\)|)(?=[^-]|$)", "i")
        },
        W = /^(?:input|select|textarea|button)$/i,
        X = /^h\d$/i,
        Y = /^[^{]+\{\s*\[native \w/,
        Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        $ = /[+~]/,
        _ = /'|\\/g,
        ab = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)", "ig"),
        bb = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
        };
    try {
        G.apply(D = H.call(t.childNodes), t.childNodes), D[t.childNodes.length].nodeType
    } catch (cb) {
        G = {
            apply: D.length ? function(a, b) {
                F.apply(a, H.call(b))
            } : function(a, b) {
                var c = a.length,
                    d = 0;
                while (a[c++] = b[d++]);
                a.length = c - 1
            }
        }
    }

    function db(a, b, d, e) {
        var f, g, h, i, j, m, p, q, u, v;
        if ((b ? b.ownerDocument || b : t) !== l && k(b), b = b || l, d = d || [], !a || "string" != typeof a) return d;
        if (1 !== (i = b.nodeType) && 9 !== i) return [];
        if (n && !e) {
            if (f = Z.exec(a))
                if (h = f[1]) {
                    if (9 === i) {
                        if (g = b.getElementById(h), !g || !g.parentNode) return d;
                        if (g.id === h) return d.push(g), d
                    } else if (b.ownerDocument && (g = b.ownerDocument.getElementById(h)) && r(b, g) && g.id === h) return d.push(g), d
                } else {
                    if (f[2]) return G.apply(d, b.getElementsByTagName(a)), d;
                    if ((h = f[3]) && c.getElementsByClassName && b.getElementsByClassName) return G.apply(d, b.getElementsByClassName(h)), d
                } if (c.qsa && (!o || !o.test(a))) {
                if (q = p = s, u = b, v = 9 === i && a, 1 === i && "object" !== b.nodeName.toLowerCase()) {
                    m = ob(a), (p = b.getAttribute("id")) ? q = p.replace(_, "\\$&") : b.setAttribute("id", q), q = "[id='" + q + "'] ", j = m.length;
                    while (j--) m[j] = q + pb(m[j]);
                    u = $.test(a) && mb(b.parentNode) || b, v = m.join(",")
                }
                if (v) try {
                    return G.apply(d, u.querySelectorAll(v)), d
                } catch (w) {} finally {
                    p || b.removeAttribute("id")
                }
            }
        }
        return xb(a.replace(P, "$1"), b, d, e)
    }

    function eb() {
        var a = [];

        function b(c, e) {
            return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e
        }
        return b
    }

    function fb(a) {
        return a[s] = !0, a
    }

    function gb(a) {
        var b = l.createElement("div");
        try {
            return !!a(b)
        } catch (c) {
            return !1
        } finally {
            b.parentNode && b.parentNode.removeChild(b), b = null
        }
    }

    function hb(a, b) {
        var c = a.split("|"),
            e = a.length;
        while (e--) d.attrHandle[c[e]] = b
    }

    function ib(a, b) {
        var c = b && a,
            d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || B) - (~a.sourceIndex || B);
        if (d) return d;
        if (c)
            while (c = c.nextSibling)
                if (c === b) return -1;
        return a ? 1 : -1
    }

    function jb(a) {
        return function(b) {
            var c = b.nodeName.toLowerCase();
            return "input" === c && b.type === a
        }
    }

    function kb(a) {
        return function(b) {
            var c = b.nodeName.toLowerCase();
            return ("input" === c || "button" === c) && b.type === a
        }
    }

    function lb(a) {
        return fb(function(b) {
            return b = +b, fb(function(c, d) {
                var e, f = a([], c.length, b),
                    g = f.length;
                while (g--) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
            })
        })
    }

    function mb(a) {
        return a && typeof a.getElementsByTagName !== A && a
    }
    c = db.support = {}, f = db.isXML = function(a) {
        var b = a && (a.ownerDocument || a).documentElement;
        return b ? "HTML" !== b.nodeName : !1
    }, k = db.setDocument = function(a) {
        var b, e = a ? a.ownerDocument || a : t,
            g = e.defaultView;
        return e !== l && 9 === e.nodeType && e.documentElement ? (l = e, m = e.documentElement, n = !f(e), g && g !== g.top && (g.addEventListener ? g.addEventListener("unload", function() {
            k()
        }, !1) : g.attachEvent && g.attachEvent("onunload", function() {
            k()
        })), c.attributes = gb(function(a) {
            return a.className = "i", !a.getAttribute("className")
        }), c.getElementsByTagName = gb(function(a) {
            return a.appendChild(e.createComment("")), !a.getElementsByTagName("*").length
        }), c.getElementsByClassName = Y.test(e.getElementsByClassName) && gb(function(a) {
            return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length
        }), c.getById = gb(function(a) {
            return m.appendChild(a).id = s, !e.getElementsByName || !e.getElementsByName(s).length
        }), c.getById ? (d.find.ID = function(a, b) {
            if (typeof b.getElementById !== A && n) {
                var c = b.getElementById(a);
                return c && c.parentNode ? [c] : []
            }
        }, d.filter.ID = function(a) {
            var b = a.replace(ab, bb);
            return function(a) {
                return a.getAttribute("id") === b
            }
        }) : (delete d.find.ID, d.filter.ID = function(a) {
            var b = a.replace(ab, bb);
            return function(a) {
                var c = typeof a.getAttributeNode !== A && a.getAttributeNode("id");
                return c && c.value === b
            }
        }), d.find.TAG = c.getElementsByTagName ? function(a, b) {
            return typeof b.getElementsByTagName !== A ? b.getElementsByTagName(a) : void 0
        } : function(a, b) {
            var c, d = [],
                e = 0,
                f = b.getElementsByTagName(a);
            if ("*" === a) {
                while (c = f[e++]) 1 === c.nodeType && d.push(c);
                return d
            }
            return f
        }, d.find.CLASS = c.getElementsByClassName && function(a, b) {
            return typeof b.getElementsByClassName !== A && n ? b.getElementsByClassName(a) : void 0
        }, p = [], o = [], (c.qsa = Y.test(e.querySelectorAll)) && (gb(function(a) {
            a.innerHTML = "<select t=''><option selected=''></option></select>", a.querySelectorAll("[t^='']").length && o.push("[*^$]=" + K + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || o.push("\\[" + K + "*(?:value|" + J + ")"), a.querySelectorAll(":checked").length || o.push(":checked")
        }), gb(function(a) {
            var b = e.createElement("input");
            b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && o.push("name" + K + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || o.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), o.push(",.*:")
        })), (c.matchesSelector = Y.test(q = m.webkitMatchesSelector || m.mozMatchesSelector || m.oMatchesSelector || m.msMatchesSelector)) && gb(function(a) {
            c.disconnectedMatch = q.call(a, "div"), q.call(a, "[s!='']:x"), p.push("!=", O)
        }), o = o.length && new RegExp(o.join("|")), p = p.length && new RegExp(p.join("|")), b = Y.test(m.compareDocumentPosition), r = b || Y.test(m.contains) ? function(a, b) {
            var c = 9 === a.nodeType ? a.documentElement : a,
                d = b && b.parentNode;
            return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
        } : function(a, b) {
            if (b)
                while (b = b.parentNode)
                    if (b === a) return !0;
            return !1
        }, z = b ? function(a, b) {
            if (a === b) return j = !0, 0;
            var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
            return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === e || a.ownerDocument === t && r(t, a) ? -1 : b === e || b.ownerDocument === t && r(t, b) ? 1 : i ? I.call(i, a) - I.call(i, b) : 0 : 4 & d ? -1 : 1)
        } : function(a, b) {
            if (a === b) return j = !0, 0;
            var c, d = 0,
                f = a.parentNode,
                g = b.parentNode,
                h = [a],
                k = [b];
            if (!f || !g) return a === e ? -1 : b === e ? 1 : f ? -1 : g ? 1 : i ? I.call(i, a) - I.call(i, b) : 0;
            if (f === g) return ib(a, b);
            c = a;
            while (c = c.parentNode) h.unshift(c);
            c = b;
            while (c = c.parentNode) k.unshift(c);
            while (h[d] === k[d]) d++;
            return d ? ib(h[d], k[d]) : h[d] === t ? -1 : k[d] === t ? 1 : 0
        }, e) : l
    }, db.matches = function(a, b) {
        return db(a, null, null, b)
    }, db.matchesSelector = function(a, b) {
        if ((a.ownerDocument || a) !== l && k(a), b = b.replace(S, "='$1']"), !(!c.matchesSelector || !n || p && p.test(b) || o && o.test(b))) try {
            var d = q.call(a, b);
            if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
        } catch (e) {}
        return db(b, l, null, [a]).length > 0
    }, db.contains = function(a, b) {
        return (a.ownerDocument || a) !== l && k(a), r(a, b)
    }, db.attr = function(a, b) {
        (a.ownerDocument || a) !== l && k(a);
        var e = d.attrHandle[b.toLowerCase()],
            f = e && C.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !n) : void 0;
        return void 0 !== f ? f : c.attributes || !n ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
    }, db.error = function(a) {
        throw new Error("Syntax error, unrecognized expression: " + a)
    }, db.uniqueSort = function(a) {
        var b, d = [],
            e = 0,
            f = 0;
        if (j = !c.detectDuplicates, i = !c.sortStable && a.slice(0), a.sort(z), j) {
            while (b = a[f++]) b === a[f] && (e = d.push(f));
            while (e--) a.splice(d[e], 1)
        }
        return i = null, a
    }, e = db.getText = function(a) {
        var b, c = "",
            d = 0,
            f = a.nodeType;
        if (f) {
            if (1 === f || 9 === f || 11 === f) {
                if ("string" == typeof a.textContent) return a.textContent;
                for (a = a.firstChild; a; a = a.nextSibling) c += e(a)
            } else if (3 === f || 4 === f) return a.nodeValue
        } else
            while (b = a[d++]) c += e(b);
        return c
    }, d = db.selectors = {
        cacheLength: 50,
        createPseudo: fb,
        match: V,
        attrHandle: {},
        find: {},
        relative: {
            ">": {
                dir: "parentNode",
                first: !0
            },
            " ": {
                dir: "parentNode"
            },
            "+": {
                dir: "previousSibling",
                first: !0
            },
            "~": {
                dir: "previousSibling"
            }
        },
        preFilter: {
            ATTR: function(a) {
                return a[1] = a[1].replace(ab, bb), a[3] = (a[4] || a[5] || "").replace(ab, bb), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
            },
            CHILD: function(a) {
                return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || db.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && db.error(a[0]), a
            },
            PSEUDO: function(a) {
                var b, c = !a[5] && a[2];
                return V.CHILD.test(a[0]) ? null : (a[3] && void 0 !== a[4] ? a[2] = a[4] : c && T.test(c) && (b = ob(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
            }
        },
        filter: {
            TAG: function(a) {
                var b = a.replace(ab, bb).toLowerCase();
                return "*" === a ? function() {
                    return !0
                } : function(a) {
                    return a.nodeName && a.nodeName.toLowerCase() === b
                }
            },
            CLASS: function(a) {
                var b = w[a + " "];
                return b || (b = new RegExp("(^|" + K + ")" + a + "(" + K + "|$)")) && w(a, function(a) {
                    return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== A && a.getAttribute("class") || "")
                })
            },
            ATTR: function(a, b, c) {
                return function(d) {
                    var e = db.attr(d, a);
                    return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
                }
            },
            CHILD: function(a, b, c, d, e) {
                var f = "nth" !== a.slice(0, 3),
                    g = "last" !== a.slice(-4),
                    h = "of-type" === b;
                return 1 === d && 0 === e ? function(a) {
                    return !!a.parentNode
                } : function(b, c, i) {
                    var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                        q = b.parentNode,
                        r = h && b.nodeName.toLowerCase(),
                        t = !i && !h;
                    if (q) {
                        if (f) {
                            while (p) {
                                l = b;
                                while (l = l[p])
                                    if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                                o = p = "only" === a && !o && "nextSibling"
                            }
                            return !0
                        }
                        if (o = [g ? q.firstChild : q.lastChild], g && t) {
                            k = q[s] || (q[s] = {}), j = k[a] || [], n = j[0] === u && j[1], m = j[0] === u && j[2], l = n && q.childNodes[n];
                            while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                                if (1 === l.nodeType && ++m && l === b) {
                                    k[a] = [u, n, m];
                                    break
                                }
                        } else if (t && (j = (b[s] || (b[s] = {}))[a]) && j[0] === u) m = j[1];
                        else
                            while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                                if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (t && ((l[s] || (l[s] = {}))[a] = [u, m]), l === b)) break;
                        return m -= e, m === d || m % d === 0 && m / d >= 0
                    }
                }
            },
            PSEUDO: function(a, b) {
                var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || db.error("unsupported pseudo: " + a);
                return e[s] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? fb(function(a, c) {
                    var d, f = e(a, b),
                        g = f.length;
                    while (g--) d = I.call(a, f[g]), a[d] = !(c[d] = f[g])
                }) : function(a) {
                    return e(a, 0, c)
                }) : e
            }
        },
        pseudos: {
            not: fb(function(a) {
                var b = [],
                    c = [],
                    d = g(a.replace(P, "$1"));
                return d[s] ? fb(function(a, b, c, e) {
                    var f, g = d(a, null, e, []),
                        h = a.length;
                    while (h--)(f = g[h]) && (a[h] = !(b[h] = f))
                }) : function(a, e, f) {
                    return b[0] = a, d(b, null, f, c), !c.pop()
                }
            }),
            has: fb(function(a) {
                return function(b) {
                    return db(a, b).length > 0
                }
            }),
            contains: fb(function(a) {
                return function(b) {
                    return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
                }
            }),
            lang: fb(function(a) {
                return U.test(a || "") || db.error("unsupported lang: " + a), a = a.replace(ab, bb).toLowerCase(),
                    function(b) {
                        var c;
                        do
                            if (c = n ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                        return !1
                    }
            }),
            target: function(b) {
                var c = a.location && a.location.hash;
                return c && c.slice(1) === b.id
            },
            root: function(a) {
                return a === m
            },
            focus: function(a) {
                return a === l.activeElement && (!l.hasFocus || l.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
            },
            enabled: function(a) {
                return a.disabled === !1
            },
            disabled: function(a) {
                return a.disabled === !0
            },
            checked: function(a) {
                var b = a.nodeName.toLowerCase();
                return "input" === b && !!a.checked || "option" === b && !!a.selected
            },
            selected: function(a) {
                return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
            },
            empty: function(a) {
                for (a = a.firstChild; a; a = a.nextSibling)
                    if (a.nodeType < 6) return !1;
                return !0
            },
            parent: function(a) {
                return !d.pseudos.empty(a)
            },
            header: function(a) {
                return X.test(a.nodeName)
            },
            input: function(a) {
                return W.test(a.nodeName)
            },
            button: function(a) {
                var b = a.nodeName.toLowerCase();
                return "input" === b && "button" === a.type || "button" === b
            },
            text: function(a) {
                var b;
                return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
            },
            first: lb(function() {
                return [0]
            }),
            last: lb(function(a, b) {
                return [b - 1]
            }),
            eq: lb(function(a, b, c) {
                return [0 > c ? c + b : c]
            }),
            even: lb(function(a, b) {
                for (var c = 0; b > c; c += 2) a.push(c);
                return a
            }),
            odd: lb(function(a, b) {
                for (var c = 1; b > c; c += 2) a.push(c);
                return a
            }),
            lt: lb(function(a, b, c) {
                for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d);
                return a
            }),
            gt: lb(function(a, b, c) {
                for (var d = 0 > c ? c + b : c; ++d < b;) a.push(d);
                return a
            })
        }
    }, d.pseudos.nth = d.pseudos.eq;
    for (b in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) d.pseudos[b] = jb(b);
    for (b in {
            submit: !0,
            reset: !0
        }) d.pseudos[b] = kb(b);

    function nb() {}
    nb.prototype = d.filters = d.pseudos, d.setFilters = new nb;

    function ob(a, b) {
        var c, e, f, g, h, i, j, k = x[a + " "];
        if (k) return b ? 0 : k.slice(0);
        h = a, i = [], j = d.preFilter;
        while (h) {
            (!c || (e = Q.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = R.exec(h)) && (c = e.shift(), f.push({
                value: c,
                type: e[0].replace(P, " ")
            }), h = h.slice(c.length));
            for (g in d.filter) !(e = V[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({
                value: c,
                type: g,
                matches: e
            }), h = h.slice(c.length));
            if (!c) break
        }
        return b ? h.length : h ? db.error(a) : x(a, i).slice(0)
    }

    function pb(a) {
        for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
        return d
    }

    function qb(a, b, c) {
        var d = b.dir,
            e = c && "parentNode" === d,
            f = v++;
        return b.first ? function(b, c, f) {
            while (b = b[d])
                if (1 === b.nodeType || e) return a(b, c, f)
        } : function(b, c, g) {
            var h, i, j = [u, f];
            if (g) {
                while (b = b[d])
                    if ((1 === b.nodeType || e) && a(b, c, g)) return !0
            } else
                while (b = b[d])
                    if (1 === b.nodeType || e) {
                        if (i = b[s] || (b[s] = {}), (h = i[d]) && h[0] === u && h[1] === f) return j[2] = h[2];
                        if (i[d] = j, j[2] = a(b, c, g)) return !0
                    }
        }
    }

    function rb(a) {
        return a.length > 1 ? function(b, c, d) {
            var e = a.length;
            while (e--)
                if (!a[e](b, c, d)) return !1;
            return !0
        } : a[0]
    }

    function sb(a, b, c, d, e) {
        for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
        return g
    }

    function tb(a, b, c, d, e, f) {
        return d && !d[s] && (d = tb(d)), e && !e[s] && (e = tb(e, f)), fb(function(f, g, h, i) {
            var j, k, l, m = [],
                n = [],
                o = g.length,
                p = f || wb(b || "*", h.nodeType ? [h] : h, []),
                q = !a || !f && b ? p : sb(p, m, a, h, i),
                r = c ? e || (f ? a : o || d) ? [] : g : q;
            if (c && c(q, r, h, i), d) {
                j = sb(r, n), d(j, [], h, i), k = j.length;
                while (k--)(l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
            }
            if (f) {
                if (e || a) {
                    if (e) {
                        j = [], k = r.length;
                        while (k--)(l = r[k]) && j.push(q[k] = l);
                        e(null, r = [], j, i)
                    }
                    k = r.length;
                    while (k--)(l = r[k]) && (j = e ? I.call(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                }
            } else r = sb(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : G.apply(g, r)
        })
    }

    function ub(a) {
        for (var b, c, e, f = a.length, g = d.relative[a[0].type], i = g || d.relative[" "], j = g ? 1 : 0, k = qb(function(a) {
                return a === b
            }, i, !0), l = qb(function(a) {
                return I.call(b, a) > -1
            }, i, !0), m = [function(a, c, d) {
                return !g && (d || c !== h) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d))
            }]; f > j; j++)
            if (c = d.relative[a[j].type]) m = [qb(rb(m), c)];
            else {
                if (c = d.filter[a[j].type].apply(null, a[j].matches), c[s]) {
                    for (e = ++j; f > e; e++)
                        if (d.relative[a[e].type]) break;
                    return tb(j > 1 && rb(m), j > 1 && pb(a.slice(0, j - 1).concat({
                        value: " " === a[j - 2].type ? "*" : ""
                    })).replace(P, "$1"), c, e > j && ub(a.slice(j, e)), f > e && ub(a = a.slice(e)), f > e && pb(a))
                }
                m.push(c)
            } return rb(m)
    }

    function vb(a, b) {
        var c = b.length > 0,
            e = a.length > 0,
            f = function(f, g, i, j, k) {
                var m, n, o, p = 0,
                    q = "0",
                    r = f && [],
                    s = [],
                    t = h,
                    v = f || e && d.find.TAG("*", k),
                    w = u += null == t ? 1 : Math.random() || .1,
                    x = v.length;
                for (k && (h = g !== l && g); q !== x && null != (m = v[q]); q++) {
                    if (e && m) {
                        n = 0;
                        while (o = a[n++])
                            if (o(m, g, i)) {
                                j.push(m);
                                break
                            } k && (u = w)
                    }
                    c && ((m = !o && m) && p--, f && r.push(m))
                }
                if (p += q, c && q !== p) {
                    n = 0;
                    while (o = b[n++]) o(r, s, g, i);
                    if (f) {
                        if (p > 0)
                            while (q--) r[q] || s[q] || (s[q] = E.call(j));
                        s = sb(s)
                    }
                    G.apply(j, s), k && !f && s.length > 0 && p + b.length > 1 && db.uniqueSort(j)
                }
                return k && (u = w, h = t), r
            };
        return c ? fb(f) : f
    }
    g = db.compile = function(a, b) {
        var c, d = [],
            e = [],
            f = y[a + " "];
        if (!f) {
            b || (b = ob(a)), c = b.length;
            while (c--) f = ub(b[c]), f[s] ? d.push(f) : e.push(f);
            f = y(a, vb(e, d))
        }
        return f
    };

    function wb(a, b, c) {
        for (var d = 0, e = b.length; e > d; d++) db(a, b[d], c);
        return c
    }

    function xb(a, b, e, f) {
        var h, i, j, k, l, m = ob(a);
        if (!f && 1 === m.length) {
            if (i = m[0] = m[0].slice(0), i.length > 2 && "ID" === (j = i[0]).type && c.getById && 9 === b.nodeType && n && d.relative[i[1].type]) {
                if (b = (d.find.ID(j.matches[0].replace(ab, bb), b) || [])[0], !b) return e;
                a = a.slice(i.shift().value.length)
            }
            h = V.needsContext.test(a) ? 0 : i.length;
            while (h--) {
                if (j = i[h], d.relative[k = j.type]) break;
                if ((l = d.find[k]) && (f = l(j.matches[0].replace(ab, bb), $.test(i[0].type) && mb(b.parentNode) || b))) {
                    if (i.splice(h, 1), a = f.length && pb(i), !a) return G.apply(e, f), e;
                    break
                }
            }
        }
        return g(a, m)(f, b, !n, e, $.test(a) && mb(b.parentNode) || b), e
    }
    return c.sortStable = s.split("").sort(z).join("") === s, c.detectDuplicates = !!j, k(), c.sortDetached = gb(function(a) {
        return 1 & a.compareDocumentPosition(l.createElement("div"))
    }), gb(function(a) {
        return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
    }) || hb("type|href|height|width", function(a, b, c) {
        return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
    }), c.attributes && gb(function(a) {
        return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
    }) || hb("value", function(a, b, c) {
        return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
    }), gb(function(a) {
        return null == a.getAttribute("disabled")
    }) || hb(J, function(a, b, c) {
        var d;
        return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
    }), db
}(a);
n.find = t, n.expr = t.selectors, n.expr[":"] = n.expr.pseudos, n.unique = t.uniqueSort, n.text = t.getText, n.isXMLDoc = t.isXML, n.contains = t.contains;
var u = n.expr.match.needsContext,
    v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    w = /^.[^:#\[\.,]*$/;

function x(a, b, c) {
    if (n.isFunction(b)) return n.grep(a, function(a, d) {
        return !!b.call(a, d, a) !== c
    });
    if (b.nodeType) return n.grep(a, function(a) {
        return a === b !== c
    });
    if ("string" == typeof b) {
        if (w.test(b)) return n.filter(b, a, c);
        b = n.filter(b, a)
    }
    return n.grep(a, function(a) {
        return n.inArray(a, b) >= 0 !== c
    })
}
n.filter = function(a, b, c) {
    var d = b[0];
    return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [d] : [] : n.find.matches(a, n.grep(b, function(a) {
        return 1 === a.nodeType
    }))
}, n.fn.extend({
    find: function(a) {
        var b, c = [],
            d = this,
            e = d.length;
        if ("string" != typeof a) return this.pushStack(n(a).filter(function() {
            for (b = 0; e > b; b++)
                if (n.contains(d[b], this)) return !0
        }));
        for (b = 0; e > b; b++) n.find(a, d[b], c);
        return c = this.pushStack(e > 1 ? n.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
    },
    filter: function(a) {
        return this.pushStack(x(this, a || [], !1))
    },
    not: function(a) {
        return this.pushStack(x(this, a || [], !0))
    },
    is: function(a) {
        return !!x(this, "string" == typeof a && u.test(a) ? n(a) : a || [], !1).length
    }
});
var y, z = a.document,
    A = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    B = n.fn.init = function(a, b) {
        var c, d;
        if (!a) return this;
        if ("string" == typeof a) {
            if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : A.exec(a), !c || !c[1] && b) return !b || b.jquery ? (b || y).find(a) : this.constructor(b).find(a);
            if (c[1]) {
                if (b = b instanceof n ? b[0] : b, n.merge(this, n.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : z, !0)), v.test(c[1]) && n.isPlainObject(b))
                    for (c in b) n.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                return this
            }
            if (d = z.getElementById(c[2]), d && d.parentNode) {
                if (d.id !== c[2]) return y.find(a);
                this.length = 1, this[0] = d
            }
            return this.context = z, this.selector = a, this
        }
        return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : n.isFunction(a) ? "undefined" != typeof y.ready ? y.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), n.makeArray(a, this))
    };
B.prototype = n.fn, y = n(z);
var C = /^(?:parents|prev(?:Until|All))/,
    D = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
n.extend({
    dir: function(a, b, c) {
        var d = [],
            e = a[b];
        while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !n(e).is(c))) 1 === e.nodeType && d.push(e), e = e[b];
        return d
    },
    sibling: function(a, b) {
        for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
        return c
    }
}), n.fn.extend({
    has: function(a) {
        var b, c = n(a, this),
            d = c.length;
        return this.filter(function() {
            for (b = 0; d > b; b++)
                if (n.contains(this, c[b])) return !0
        })
    },
    closest: function(a, b) {
        for (var c, d = 0, e = this.length, f = [], g = u.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++)
            for (c = this[d]; c && c !== b; c = c.parentNode)
                if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) {
                    f.push(c);
                    break
                } return this.pushStack(f.length > 1 ? n.unique(f) : f)
    },
    index: function(a) {
        return a ? "string" == typeof a ? n.inArray(this[0], n(a)) : n.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
    },
    add: function(a, b) {
        return this.pushStack(n.unique(n.merge(this.get(), n(a, b))))
    },
    addBack: function(a) {
        return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
    }
});

function E(a, b) {
    do a = a[b]; while (a && 1 !== a.nodeType);
    return a
}
n.each({
    parent: function(a) {
        var b = a.parentNode;
        return b && 11 !== b.nodeType ? b : null
    },
    parents: function(a) {
        return n.dir(a, "parentNode")
    },
    parentsUntil: function(a, b, c) {
        return n.dir(a, "parentNode", c)
    },
    next: function(a) {
        return E(a, "nextSibling")
    },
    prev: function(a) {
        return E(a, "previousSibling")
    },
    nextAll: function(a) {
        return n.dir(a, "nextSibling")
    },
    prevAll: function(a) {
        return n.dir(a, "previousSibling")
    },
    nextUntil: function(a, b, c) {
        return n.dir(a, "nextSibling", c)
    },
    prevUntil: function(a, b, c) {
        return n.dir(a, "previousSibling", c)
    },
    siblings: function(a) {
        return n.sibling((a.parentNode || {}).firstChild, a)
    },
    children: function(a) {
        return n.sibling(a.firstChild)
    },
    contents: function(a) {
        return n.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : n.merge([], a.childNodes)
    }
}, function(a, b) {
    n.fn[a] = function(c, d) {
        var e = n.map(this, b, c);
        return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = n.filter(d, e)), this.length > 1 && (D[a] || (e = n.unique(e)), C.test(a) && (e = e.reverse())), this.pushStack(e)
    }
});
var F = /\S+/g,
    G = {};

function H(a) {
    var b = G[a] = {};
    return n.each(a.match(F) || [], function(a, c) {
        b[c] = !0
    }), b
}
n.Callbacks = function(a) {
    a = "string" == typeof a ? G[a] || H(a) : n.extend({}, a);
    var b, c, d, e, f, g, h = [],
        i = !a.once && [],
        j = function(l) {
            for (c = a.memory && l, d = !0, f = g || 0, g = 0, e = h.length, b = !0; h && e > f; f++)
                if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
                    c = !1;
                    break
                } b = !1, h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable())
        },
        k = {
            add: function() {
                if (h) {
                    var d = h.length;
                    ! function f(b) {
                        n.each(b, function(b, c) {
                            var d = n.type(c);
                            "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c)
                        })
                    }(arguments), b ? e = h.length : c && (g = d, j(c))
                }
                return this
            },
            remove: function() {
                return h && n.each(arguments, function(a, c) {
                    var d;
                    while ((d = n.inArray(c, h, d)) > -1) h.splice(d, 1), b && (e >= d && e--, f >= d && f--)
                }), this
            },
            has: function(a) {
                return a ? n.inArray(a, h) > -1 : !(!h || !h.length)
            },
            empty: function() {
                return h = [], e = 0, this
            },
            disable: function() {
                return h = i = c = void 0, this
            },
            disabled: function() {
                return !h
            },
            lock: function() {
                return i = void 0, c || k.disable(), this
            },
            locked: function() {
                return !i
            },
            fireWith: function(a, c) {
                return !h || d && !i || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? i.push(c) : j(c)), this
            },
            fire: function() {
                return k.fireWith(this, arguments), this
            },
            fired: function() {
                return !!d
            }
        };
    return k
}, n.extend({
    Deferred: function(a) {
        var b = [
                ["resolve", "done", n.Callbacks("once memory"), "resolved"],
                ["reject", "fail", n.Callbacks("once memory"), "rejected"],
                ["notify", "progress", n.Callbacks("memory")]
            ],
            c = "pending",
            d = {
                state: function() {
                    return c
                },
                always: function() {
                    return e.done(arguments).fail(arguments), this
                },
                then: function() {
                    var a = arguments;
                    return n.Deferred(function(c) {
                        n.each(b, function(b, f) {
                            var g = n.isFunction(a[b]) && a[b];
                            e[f[1]](function() {
                                var a = g && g.apply(this, arguments);
                                a && n.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                            })
                        }), a = null
                    }).promise()
                },
                promise: function(a) {
                    return null != a ? n.extend(a, d) : d
                }
            },
            e = {};
        return d.pipe = d.then, n.each(b, function(a, f) {
            var g = f[2],
                h = f[3];
            d[f[1]] = g.add, h && g.add(function() {
                c = h
            }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                return e[f[0] + "With"](this === e ? d : this, arguments), this
            }, e[f[0] + "With"] = g.fireWith
        }), d.promise(e), a && a.call(e, e), e
    },
    when: function(a) {
        var b = 0,
            c = d.call(arguments),
            e = c.length,
            f = 1 !== e || a && n.isFunction(a.promise) ? e : 0,
            g = 1 === f ? a : n.Deferred(),
            h = function(a, b, c) {
                return function(e) {
                    b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
                }
            },
            i, j, k;
        if (e > 1)
            for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++) c[b] && n.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
        return f || g.resolveWith(k, c), g.promise()
    }
});
var I;
n.fn.ready = function(a) {
    return n.ready.promise().done(a), this
}, n.extend({
    isReady: !1,
    readyWait: 1,
    holdReady: function(a) {
        a ? n.readyWait++ : n.ready(!0)
    },
    ready: function(a) {
        if (a === !0 ? !--n.readyWait : !n.isReady) {
            if (!z.body) return setTimeout(n.ready);
            n.isReady = !0, a !== !0 && --n.readyWait > 0 || (I.resolveWith(z, [n]), n.fn.trigger && n(z).trigger("ready").off("ready"))
        }
    }
});

function J() {
    z.addEventListener ? (z.removeEventListener("DOMContentLoaded", K, !1), a.removeEventListener("load", K, !1)) : (z.detachEvent("onreadystatechange", K), a.detachEvent("onload", K))
}

function K() {
    (z.addEventListener || "load" === event.type || "complete" === z.readyState) && (J(), n.ready())
}
n.ready.promise = function(b) {
    if (!I)
        if (I = n.Deferred(), "complete" === z.readyState) setTimeout(n.ready);
        else if (z.addEventListener) z.addEventListener("DOMContentLoaded", K, !1), a.addEventListener("load", K, !1);
    else {
        z.attachEvent("onreadystatechange", K), a.attachEvent("onload", K);
        var c = !1;
        try {
            c = null == a.frameElement && z.documentElement
        } catch (d) {}
        c && c.doScroll && ! function e() {
            if (!n.isReady) {
                try {
                    c.doScroll("left")
                } catch (a) {
                    return setTimeout(e, 50)
                }
                J(), n.ready()
            }
        }()
    }
    return I.promise(b)
};
var L = "undefined",
    M;
for (M in n(l)) break;
l.ownLast = "0" !== M, l.inlineBlockNeedsLayout = !1, n(function() {
        var a, b, c = z.getElementsByTagName("body")[0];
        c && (a = z.createElement("div"), a.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", b = z.createElement("div"), c.appendChild(a).appendChild(b), typeof b.style.zoom !== L && (b.style.cssText = "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1", (l.inlineBlockNeedsLayout = 3 === b.offsetWidth) && (c.style.zoom = 1)), c.removeChild(a), a = b = null)
    }),
    function() {
        var a = z.createElement("div");
        if (null == l.deleteExpando) {
            l.deleteExpando = !0;
            try {
                delete a.test
            } catch (b) {
                l.deleteExpando = !1
            }
        }
        a = null
    }(), n.acceptData = function(a) {
        var b = n.noData[(a.nodeName + " ").toLowerCase()],
            c = +a.nodeType || 1;
        return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
    };
var N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    O = /([A-Z])/g;

function P(a, b, c) {
    if (void 0 === c && 1 === a.nodeType) {
        var d = "data-" + b.replace(O, "-$1").toLowerCase();
        if (c = a.getAttribute(d), "string" == typeof c) {
            try {
                c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c
            } catch (e) {}
            n.data(a, b, c)
        } else c = void 0
    }
    return c
}

function Q(a) {
    var b;
    for (b in a)
        if (("data" !== b || !n.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
    return !0
}

function R(a, b, d, e) {
    if (n.acceptData(a)) {
        var f, g, h = n.expando,
            i = a.nodeType,
            j = i ? n.cache : a,
            k = i ? a[h] : a[h] && h;
        if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b) return k || (k = i ? a[h] = c.pop() || n.guid++ : h), j[k] || (j[k] = i ? {} : {
            toJSON: n.noop
        }), ("object" == typeof b || "function" == typeof b) && (e ? j[k] = n.extend(j[k], b) : j[k].data = n.extend(j[k].data, b)), g = j[k], e || (g.data || (g.data = {}), g = g.data), void 0 !== d && (g[n.camelCase(b)] = d), "string" == typeof b ? (f = g[b], null == f && (f = g[n.camelCase(b)])) : f = g, f
    }
}

function S(a, b, c) {
    if (n.acceptData(a)) {
        var d, e, f = a.nodeType,
            g = f ? n.cache : a,
            h = f ? a[n.expando] : n.expando;
        if (g[h]) {
            if (b && (d = c ? g[h] : g[h].data)) {
                n.isArray(b) ? b = b.concat(n.map(b, n.camelCase)) : b in d ? b = [b] : (b = n.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                while (e--) delete d[b[e]];
                if (c ? !Q(d) : !n.isEmptyObject(d)) return
            }(c || (delete g[h].data, Q(g[h]))) && (f ? n.cleanData([a], !0) : l.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
        }
    }
}
n.extend({
    cache: {},
    noData: {
        "applet ": !0,
        "embed ": !0,
        "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
    },
    hasData: function(a) {
        return a = a.nodeType ? n.cache[a[n.expando]] : a[n.expando], !!a && !Q(a)
    },
    data: function(a, b, c) {
        return R(a, b, c)
    },
    removeData: function(a, b) {
        return S(a, b)
    },
    _data: function(a, b, c) {
        return R(a, b, c, !0)
    },
    _removeData: function(a, b) {
        return S(a, b, !0)
    }
}), n.fn.extend({
    data: function(a, b) {
        var c, d, e, f = this[0],
            g = f && f.attributes;
        if (void 0 === a) {
            if (this.length && (e = n.data(f), 1 === f.nodeType && !n._data(f, "parsedAttrs"))) {
                c = g.length;
                while (c--) d = g[c].name, 0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)), P(f, d, e[d]));
                n._data(f, "parsedAttrs", !0)
            }
            return e
        }
        return "object" == typeof a ? this.each(function() {
            n.data(this, a)
        }) : arguments.length > 1 ? this.each(function() {
            n.data(this, a, b)
        }) : f ? P(f, a, n.data(f, a)) : void 0
    },
    removeData: function(a) {
        return this.each(function() {
            n.removeData(this, a)
        })
    }
}), n.extend({
    queue: function(a, b, c) {
        var d;
        return a ? (b = (b || "fx") + "queue", d = n._data(a, b), c && (!d || n.isArray(c) ? d = n._data(a, b, n.makeArray(c)) : d.push(c)), d || []) : void 0
    },
    dequeue: function(a, b) {
        b = b || "fx";
        var c = n.queue(a, b),
            d = c.length,
            e = c.shift(),
            f = n._queueHooks(a, b),
            g = function() {
                n.dequeue(a, b)
            };
        "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
    },
    _queueHooks: function(a, b) {
        var c = b + "queueHooks";
        return n._data(a, c) || n._data(a, c, {
            empty: n.Callbacks("once memory").add(function() {
                n._removeData(a, b + "queue"), n._removeData(a, c)
            })
        })
    }
}), n.fn.extend({
    queue: function(a, b) {
        var c = 2;
        return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function() {
            var c = n.queue(this, a, b);
            n._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && n.dequeue(this, a)
        })
    },
    dequeue: function(a) {
        return this.each(function() {
            n.dequeue(this, a)
        })
    },
    clearQueue: function(a) {
        return this.queue(a || "fx", [])
    },
    promise: function(a, b) {
        var c, d = 1,
            e = n.Deferred(),
            f = this,
            g = this.length,
            h = function() {
                --d || e.resolveWith(f, [f])
            };
        "string" != typeof a && (b = a, a = void 0), a = a || "fx";
        while (g--) c = n._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
        return h(), e.promise(b)
    }
});
var T = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    U = ["Top", "Right", "Bottom", "Left"],
    V = function(a, b) {
        return a = b || a, "none" === n.css(a, "display") || !n.contains(a.ownerDocument, a)
    },
    W = n.access = function(a, b, c, d, e, f, g) {
        var h = 0,
            i = a.length,
            j = null == c;
        if ("object" === n.type(c)) {
            e = !0;
            for (h in c) n.access(a, b, h, c[h], !0, f, g)
        } else if (void 0 !== d && (e = !0, n.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function(a, b, c) {
                return j.call(n(a), c)
            })), b))
            for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
    },
    X = /^(?:checkbox|radio)$/i;
! function() {
    var a = z.createDocumentFragment(),
        b = z.createElement("div"),
        c = z.createElement("input");
    if (b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a>", l.leadingWhitespace = 3 === b.firstChild.nodeType, l.tbody = !b.getElementsByTagName("tbody").length, l.htmlSerialize = !!b.getElementsByTagName("link").length, l.html5Clone = "<:nav></:nav>" !== z.createElement("nav").cloneNode(!0).outerHTML, c.type = "checkbox", c.checked = !0, a.appendChild(c), l.appendChecked = c.checked, b.innerHTML = "<textarea>x</textarea>", l.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, a.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", l.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, l.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function() {
            l.noCloneEvent = !1
        }), b.cloneNode(!0).click()), null == l.deleteExpando) {
        l.deleteExpando = !0;
        try {
            delete b.test
        } catch (d) {
            l.deleteExpando = !1
        }
    }
    a = b = c = null
}(),
function() {
    var b, c, d = z.createElement("div");
    for (b in {
            submit: !0,
            change: !0,
            focusin: !0
        }) c = "on" + b, (l[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), l[b + "Bubbles"] = d.attributes[c].expando === !1);
    d = null
}();
var Y = /^(?:input|select|textarea)$/i,
    Z = /^key/,
    $ = /^(?:mouse|contextmenu)|click/,
    _ = /^(?:focusinfocus|focusoutblur)$/,
    ab = /^([^.]*)(?:\.(.+)|)$/;

function bb() {
    return !0
}

function cb() {
    return !1
}

function db() {
    try {
        return z.activeElement
    } catch (a) {}
}
n.event = {
    global: {},
    add: function(a, b, c, d, e) {
        var f, g, h, i, j, k, l, m, o, p, q, r = n._data(a);
        if (r) {
            c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = n.guid++), (g = r.events) || (g = r.events = {}), (k = r.handle) || (k = r.handle = function(a) {
                return typeof n === L || a && n.event.triggered === a.type ? void 0 : n.event.dispatch.apply(k.elem, arguments)
            }, k.elem = a), b = (b || "").match(F) || [""], h = b.length;
            while (h--) f = ab.exec(b[h]) || [], o = q = f[1], p = (f[2] || "").split(".").sort(), o && (j = n.event.special[o] || {}, o = (e ? j.delegateType : j.bindType) || o, j = n.event.special[o] || {}, l = n.extend({
                type: o,
                origType: q,
                data: d,
                handler: c,
                guid: c.guid,
                selector: e,
                needsContext: e && n.expr.match.needsContext.test(e),
                namespace: p.join(".")
            }, i), (m = g[o]) || (m = g[o] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), n.event.global[o] = !0);
            a = null
        }
    },
    remove: function(a, b, c, d, e) {
        var f, g, h, i, j, k, l, m, o, p, q, r = n.hasData(a) && n._data(a);
        if (r && (k = r.events)) {
            b = (b || "").match(F) || [""], j = b.length;
            while (j--)
                if (h = ab.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
                    l = n.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, m = k[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = m.length;
                    while (f--) g = m[f], !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                    i && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle), delete k[o])
                } else
                    for (o in k) n.event.remove(a, o + b[j], c, d, !0);
            n.isEmptyObject(k) && (delete r.handle, n._removeData(a, "events"))
        }
    },
    trigger: function(b, c, d, e) {
        var f, g, h, i, k, l, m, o = [d || z],
            p = j.call(b, "type") ? b.type : b,
            q = j.call(b, "namespace") ? b.namespace.split(".") : [];
        if (h = l = d = d || z, 3 !== d.nodeType && 8 !== d.nodeType && !_.test(p + n.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."), p = q.shift(), q.sort()), g = p.indexOf(":") < 0 && "on" + p, b = b[n.expando] ? b : new n.Event(p, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = q.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : n.makeArray(c, [b]), k = n.event.special[p] || {}, e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
            if (!e && !k.noBubble && !n.isWindow(d)) {
                for (i = k.delegateType || p, _.test(i + p) || (h = h.parentNode); h; h = h.parentNode) o.push(h), l = h;
                l === (d.ownerDocument || z) && o.push(l.defaultView || l.parentWindow || a)
            }
            m = 0;
            while ((h = o[m++]) && !b.isPropagationStopped()) b.type = m > 1 ? i : k.bindType || p, f = (n._data(h, "events") || {})[b.type] && n._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && n.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
            if (b.type = p, !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && n.acceptData(d) && g && d[p] && !n.isWindow(d)) {
                l = d[g], l && (d[g] = null), n.event.triggered = p;
                try {
                    d[p]()
                } catch (r) {}
                n.event.triggered = void 0, l && (d[g] = l)
            }
            return b.result
        }
    },
    dispatch: function(a) {
        a = n.event.fix(a);
        var b, c, e, f, g, h = [],
            i = d.call(arguments),
            j = (n._data(this, "events") || {})[a.type] || [],
            k = n.event.special[a.type] || {};
        if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
            h = n.event.handlers.call(this, a, j), b = 0;
            while ((f = h[b++]) && !a.isPropagationStopped()) {
                a.currentTarget = f.elem, g = 0;
                while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped())(!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e, a.data = e.data, c = ((n.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()))
            }
            return k.postDispatch && k.postDispatch.call(this, a), a.result
        }
    },
    handlers: function(a, b) {
        var c, d, e, f, g = [],
            h = b.delegateCount,
            i = a.target;
        if (h && i.nodeType && (!a.button || "click" !== a.type))
            for (; i != this; i = i.parentNode || this)
                if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                    for (e = [], f = 0; h > f; f++) d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? n(c, this).index(i) >= 0 : n.find(c, this, null, [i]).length), e[c] && e.push(d);
                    e.length && g.push({
                        elem: i,
                        handlers: e
                    })
                } return h < b.length && g.push({
            elem: this,
            handlers: b.slice(h)
        }), g
    },
    fix: function(a) {
        if (a[n.expando]) return a;
        var b, c, d, e = a.type,
            f = a,
            g = this.fixHooks[e];
        g || (this.fixHooks[e] = g = $.test(e) ? this.mouseHooks : Z.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new n.Event(f), b = d.length;
        while (b--) c = d[b], a[c] = f[c];
        return a.target || (a.target = f.srcElement || z), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
    },
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function(a, b) {
            return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
        }
    },
    mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function(a, b) {
            var c, d, e, f = b.button,
                g = b.fromElement;
            return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || z, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
        }
    },
    special: {
        load: {
            noBubble: !0
        },
        focus: {
            trigger: function() {
                if (this !== db() && this.focus) try {
                    return this.focus(), !1
                } catch (a) {}
            },
            delegateType: "focusin"
        },
        blur: {
            trigger: function() {
                return this === db() && this.blur ? (this.blur(), !1) : void 0
            },
            delegateType: "focusout"
        },
        click: {
            trigger: function() {
                return n.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
            },
            _default: function(a) {
                return n.nodeName(a.target, "a")
            }
        },
        beforeunload: {
            postDispatch: function(a) {
                void 0 !== a.result && (a.originalEvent.returnValue = a.result)
            }
        }
    },
    simulate: function(a, b, c, d) {
        var e = n.extend(new n.Event, c, {
            type: a,
            isSimulated: !0,
            originalEvent: {}
        });
        d ? n.event.trigger(e, null, b) : n.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
    }
}, n.removeEvent = z.removeEventListener ? function(a, b, c) {
    a.removeEventListener && a.removeEventListener(b, c, !1)
} : function(a, b, c) {
    var d = "on" + b;
    a.detachEvent && (typeof a[d] === L && (a[d] = null), a.detachEvent(d, c))
}, n.Event = function(a, b) {
    return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && (a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault()) ? bb : cb) : this.type = a, b && n.extend(this, b), this.timeStamp = a && a.timeStamp || n.now(), void(this[n.expando] = !0)) : new n.Event(a, b)
}, n.Event.prototype = {
    isDefaultPrevented: cb,
    isPropagationStopped: cb,
    isImmediatePropagationStopped: cb,
    preventDefault: function() {
        var a = this.originalEvent;
        this.isDefaultPrevented = bb, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
    },
    stopPropagation: function() {
        var a = this.originalEvent;
        this.isPropagationStopped = bb, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
    },
    stopImmediatePropagation: function() {
        this.isImmediatePropagationStopped = bb, this.stopPropagation()
    }
}, n.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
}, function(a, b) {
    n.event.special[a] = {
        delegateType: b,
        bindType: b,
        handle: function(a) {
            var c, d = this,
                e = a.relatedTarget,
                f = a.handleObj;
            return (!e || e !== d && !n.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
        }
    }
}), l.submitBubbles || (n.event.special.submit = {
    setup: function() {
        return n.nodeName(this, "form") ? !1 : void n.event.add(this, "click._submit keypress._submit", function(a) {
            var b = a.target,
                c = n.nodeName(b, "input") || n.nodeName(b, "button") ? b.form : void 0;
            c && !n._data(c, "submitBubbles") && (n.event.add(c, "submit._submit", function(a) {
                a._submit_bubble = !0
            }), n._data(c, "submitBubbles", !0))
        })
    },
    postDispatch: function(a) {
        a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && n.event.simulate("submit", this.parentNode, a, !0))
    },
    teardown: function() {
        return n.nodeName(this, "form") ? !1 : void n.event.remove(this, "._submit")
    }
}), l.changeBubbles || (n.event.special.change = {
    setup: function() {
        return Y.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (n.event.add(this, "propertychange._change", function(a) {
            "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
        }), n.event.add(this, "click._change", function(a) {
            this._just_changed && !a.isTrigger && (this._just_changed = !1), n.event.simulate("change", this, a, !0)
        })), !1) : void n.event.add(this, "beforeactivate._change", function(a) {
            var b = a.target;
            Y.test(b.nodeName) && !n._data(b, "changeBubbles") && (n.event.add(b, "change._change", function(a) {
                !this.parentNode || a.isSimulated || a.isTrigger || n.event.simulate("change", this.parentNode, a, !0)
            }), n._data(b, "changeBubbles", !0))
        })
    },
    handle: function(a) {
        var b = a.target;
        return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
    },
    teardown: function() {
        return n.event.remove(this, "._change"), !Y.test(this.nodeName)
    }
}), l.focusinBubbles || n.each({
    focus: "focusin",
    blur: "focusout"
}, function(a, b) {
    var c = function(a) {
        n.event.simulate(b, a.target, n.event.fix(a), !0)
    };
    n.event.special[b] = {
        setup: function() {
            var d = this.ownerDocument || this,
                e = n._data(d, b);
            e || d.addEventListener(a, c, !0), n._data(d, b, (e || 0) + 1)
        },
        teardown: function() {
            var d = this.ownerDocument || this,
                e = n._data(d, b) - 1;
            e ? n._data(d, b, e) : (d.removeEventListener(a, c, !0), n._removeData(d, b))
        }
    }
}), n.fn.extend({
    on: function(a, b, c, d, e) {
        var f, g;
        if ("object" == typeof a) {
            "string" != typeof b && (c = c || b, b = void 0);
            for (f in a) this.on(f, b, c, a[f], e);
            return this
        }
        if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = cb;
        else if (!d) return this;
        return 1 === e && (g = d, d = function(a) {
            return n().off(a), g.apply(this, arguments)
        }, d.guid = g.guid || (g.guid = n.guid++)), this.each(function() {
            n.event.add(this, a, d, c, b)
        })
    },
    one: function(a, b, c, d) {
        return this.on(a, b, c, d, 1)
    },
    off: function(a, b, c) {
        var d, e;
        if (a && a.preventDefault && a.handleObj) return d = a.handleObj, n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
        if ("object" == typeof a) {
            for (e in a) this.off(e, b, a[e]);
            return this
        }
        return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = cb), this.each(function() {
            n.event.remove(this, a, c, b)
        })
    },
    trigger: function(a, b) {
        return this.each(function() {
            n.event.trigger(a, b, this)
        })
    },
    triggerHandler: function(a, b) {
        var c = this[0];
        return c ? n.event.trigger(a, b, c, !0) : void 0
    }
});

function eb(a) {
    var b = fb.split("|"),
        c = a.createDocumentFragment();
    if (c.createElement)
        while (b.length) c.createElement(b.pop());
    return c
}
var fb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    gb = / jQuery\d+="(?:null|\d+)"/g,
    hb = new RegExp("<(?:" + fb + ")[\\s/>]", "i"),
    ib = /^\s+/,
    jb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    kb = /<([\w:]+)/,
    lb = /<tbody/i,
    mb = /<|&#?\w+;/,
    nb = /<(?:script|style|link)/i,
    ob = /checked\s*(?:[^=]|=\s*.checked.)/i,
    pb = /^$|\/(?:java|ecma)script/i,
    qb = /^true\/(.*)/,
    rb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    sb = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: l.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    },
    tb = eb(z),
    ub = tb.appendChild(z.createElement("div"));
sb.optgroup = sb.option, sb.tbody = sb.tfoot = sb.colgroup = sb.caption = sb.thead, sb.th = sb.td;

function vb(a, b) {
    var c, d, e = 0,
        f = typeof a.getElementsByTagName !== L ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== L ? a.querySelectorAll(b || "*") : void 0;
    if (!f)
        for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || n.nodeName(d, b) ? f.push(d) : n.merge(f, vb(d, b));
    return void 0 === b || b && n.nodeName(a, b) ? n.merge([a], f) : f
}

function wb(a) {
    X.test(a.type) && (a.defaultChecked = a.checked)
}

function xb(a, b) {
    return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
}

function yb(a) {
    return a.type = (null !== n.find.attr(a, "type")) + "/" + a.type, a
}

function zb(a) {
    var b = qb.exec(a.type);
    return b ? a.type = b[1] : a.removeAttribute("type"), a
}

function Ab(a, b) {
    for (var c, d = 0; null != (c = a[d]); d++) n._data(c, "globalEval", !b || n._data(b[d], "globalEval"))
}

function Bb(a, b) {
    if (1 === b.nodeType && n.hasData(a)) {
        var c, d, e, f = n._data(a),
            g = n._data(b, f),
            h = f.events;
        if (h) {
            delete g.handle, g.events = {};
            for (c in h)
                for (d = 0, e = h[c].length; e > d; d++) n.event.add(b, c, h[c][d])
        }
        g.data && (g.data = n.extend({}, g.data))
    }
}

function Cb(a, b) {
    var c, d, e;
    if (1 === b.nodeType) {
        if (c = b.nodeName.toLowerCase(), !l.noCloneEvent && b[n.expando]) {
            e = n._data(b);
            for (d in e.events) n.removeEvent(b, d, e.handle);
            b.removeAttribute(n.expando)
        }
        "script" === c && b.text !== a.text ? (yb(b).text = a.text, zb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), l.html5Clone && a.innerHTML && !n.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && X.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
    }
}
n.extend({
    clone: function(a, b, c) {
        var d, e, f, g, h, i = n.contains(a.ownerDocument, a);
        if (l.html5Clone || n.isXMLDoc(a) || !hb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (ub.innerHTML = a.outerHTML, ub.removeChild(f = ub.firstChild)), !(l.noCloneEvent && l.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a)))
            for (d = vb(f), h = vb(a), g = 0; null != (e = h[g]); ++g) d[g] && Cb(e, d[g]);
        if (b)
            if (c)
                for (h = h || vb(a), d = d || vb(f), g = 0; null != (e = h[g]); g++) Bb(e, d[g]);
            else Bb(a, f);
        return d = vb(f, "script"), d.length > 0 && Ab(d, !i && vb(a, "script")), d = h = e = null, f
    },
    buildFragment: function(a, b, c, d) {
        for (var e, f, g, h, i, j, k, m = a.length, o = eb(b), p = [], q = 0; m > q; q++)
            if (f = a[q], f || 0 === f)
                if ("object" === n.type(f)) n.merge(p, f.nodeType ? [f] : f);
                else if (mb.test(f)) {
            h = h || o.appendChild(b.createElement("div")), i = (kb.exec(f) || ["", ""])[1].toLowerCase(), k = sb[i] || sb._default, h.innerHTML = k[1] + f.replace(jb, "<$1></$2>") + k[2], e = k[0];
            while (e--) h = h.lastChild;
            if (!l.leadingWhitespace && ib.test(f) && p.push(b.createTextNode(ib.exec(f)[0])), !l.tbody) {
                f = "table" !== i || lb.test(f) ? "<table>" !== k[1] || lb.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length;
                while (e--) n.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j)
            }
            n.merge(p, h.childNodes), h.textContent = "";
            while (h.firstChild) h.removeChild(h.firstChild);
            h = o.lastChild
        } else p.push(b.createTextNode(f));
        h && o.removeChild(h), l.appendChecked || n.grep(vb(p, "input"), wb), q = 0;
        while (f = p[q++])
            if ((!d || -1 === n.inArray(f, d)) && (g = n.contains(f.ownerDocument, f), h = vb(o.appendChild(f), "script"), g && Ab(h), c)) {
                e = 0;
                while (f = h[e++]) pb.test(f.type || "") && c.push(f)
            } return h = null, o
    },
    cleanData: function(a, b) {
        for (var d, e, f, g, h = 0, i = n.expando, j = n.cache, k = l.deleteExpando, m = n.event.special; null != (d = a[h]); h++)
            if ((b || n.acceptData(d)) && (f = d[i], g = f && j[f])) {
                if (g.events)
                    for (e in g.events) m[e] ? n.event.remove(d, e) : n.removeEvent(d, e, g.handle);
                j[f] && (delete j[f], k ? delete d[i] : typeof d.removeAttribute !== L ? d.removeAttribute(i) : d[i] = null, c.push(f))
            }
    }
}), n.fn.extend({
    text: function(a) {
        return W(this, function(a) {
            return void 0 === a ? n.text(this) : this.empty().append((this[0] && this[0].ownerDocument || z).createTextNode(a))
        }, null, a, arguments.length)
    },
    append: function() {
        return this.domManip(arguments, function(a) {
            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                var b = xb(this, a);
                b.appendChild(a)
            }
        })
    },
    prepend: function() {
        return this.domManip(arguments, function(a) {
            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                var b = xb(this, a);
                b.insertBefore(a, b.firstChild)
            }
        })
    },
    before: function() {
        return this.domManip(arguments, function(a) {
            this.parentNode && this.parentNode.insertBefore(a, this)
        })
    },
    after: function() {
        return this.domManip(arguments, function(a) {
            this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
        })
    },
    remove: function(a, b) {
        for (var c, d = a ? n.filter(a, this) : this, e = 0; null != (c = d[e]); e++) b || 1 !== c.nodeType || n.cleanData(vb(c)), c.parentNode && (b && n.contains(c.ownerDocument, c) && Ab(vb(c, "script")), c.parentNode.removeChild(c));
        return this
    },
    empty: function() {
        for (var a, b = 0; null != (a = this[b]); b++) {
            1 === a.nodeType && n.cleanData(vb(a, !1));
            while (a.firstChild) a.removeChild(a.firstChild);
            a.options && n.nodeName(a, "select") && (a.options.length = 0)
        }
        return this
    },
    clone: function(a, b) {
        return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
            return n.clone(this, a, b)
        })
    },
    html: function(a) {
        return W(this, function(a) {
            var b = this[0] || {},
                c = 0,
                d = this.length;
            if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(gb, "") : void 0;
            if (!("string" != typeof a || nb.test(a) || !l.htmlSerialize && hb.test(a) || !l.leadingWhitespace && ib.test(a) || sb[(kb.exec(a) || ["", ""])[1].toLowerCase()])) {
                a = a.replace(jb, "<$1></$2>");
                try {
                    for (; d > c; c++) b = this[c] || {}, 1 === b.nodeType && (n.cleanData(vb(b, !1)), b.innerHTML = a);
                    b = 0
                } catch (e) {}
            }
            b && this.empty().append(a)
        }, null, a, arguments.length)
    },
    replaceWith: function() {
        var a = arguments[0];
        return this.domManip(arguments, function(b) {
            a = this.parentNode, n.cleanData(vb(this)), a && a.replaceChild(b, this)
        }), a && (a.length || a.nodeType) ? this : this.remove()
    },
    detach: function(a) {
        return this.remove(a, !0)
    },
    domManip: function(a, b) {
        a = e.apply([], a);
        var c, d, f, g, h, i, j = 0,
            k = this.length,
            m = this,
            o = k - 1,
            p = a[0],
            q = n.isFunction(p);
        if (q || k > 1 && "string" == typeof p && !l.checkClone && ob.test(p)) return this.each(function(c) {
            var d = m.eq(c);
            q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b)
        });
        if (k && (i = n.buildFragment(a, this[0].ownerDocument, !1, this), c = i.firstChild, 1 === i.childNodes.length && (i = c), c)) {
            for (g = n.map(vb(i, "script"), yb), f = g.length; k > j; j++) d = i, j !== o && (d = n.clone(d, !0, !0), f && n.merge(g, vb(d, "script"))), b.call(this[j], d, j);
            if (f)
                for (h = g[g.length - 1].ownerDocument, n.map(g, zb), j = 0; f > j; j++) d = g[j], pb.test(d.type || "") && !n._data(d, "globalEval") && n.contains(h, d) && (d.src ? n._evalUrl && n._evalUrl(d.src) : n.globalEval((d.text || d.textContent || d.innerHTML || "").replace(rb, "")));
            i = c = null
        }
        return this
    }
}), n.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
}, function(a, b) {
    n.fn[a] = function(a) {
        for (var c, d = 0, e = [], g = n(a), h = g.length - 1; h >= d; d++) c = d === h ? this : this.clone(!0), n(g[d])[b](c), f.apply(e, c.get());
        return this.pushStack(e)
    }
});
var Db, Eb = {};

function Fb(b, c) {
    var d = n(c.createElement(b)).appendTo(c.body),
        e = a.getDefaultComputedStyle ? a.getDefaultComputedStyle(d[0]).display : n.css(d[0], "display");
    return d.detach(), e
}

function Gb(a) {
    var b = z,
        c = Eb[a];
    return c || (c = Fb(a, b), "none" !== c && c || (Db = (Db || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = (Db[0].contentWindow || Db[0].contentDocument).document, b.write(), b.close(), c = Fb(a, b), Db.detach()), Eb[a] = c), c
}! function() {
    var a, b, c = z.createElement("div"),
        d = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
    c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = c.getElementsByTagName("a")[0], a.style.cssText = "float:left;opacity:.5", l.opacity = /^0.5/.test(a.style.opacity), l.cssFloat = !!a.style.cssFloat, c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", l.clearCloneStyle = "content-box" === c.style.backgroundClip, a = c = null, l.shrinkWrapBlocks = function() {
        var a, c, e, f;
        if (null == b) {
            if (a = z.getElementsByTagName("body")[0], !a) return;
            f = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px", c = z.createElement("div"), e = z.createElement("div"), a.appendChild(c).appendChild(e), b = !1, typeof e.style.zoom !== L && (e.style.cssText = d + ";width:1px;padding:1px;zoom:1", e.innerHTML = "<div></div>", e.firstChild.style.width = "5px", b = 3 !== e.offsetWidth), a.removeChild(c), a = c = e = null
        }
        return b
    }
}();
var Hb = /^margin/,
    Ib = new RegExp("^(" + T + ")(?!px)[a-z%]+$", "i"),
    Jb, Kb, Lb = /^(top|right|bottom|left)$/;
a.getComputedStyle ? (Jb = function(a) {
    return a.ownerDocument.defaultView.getComputedStyle(a, null)
}, Kb = function(a, b, c) {
    var d, e, f, g, h = a.style;
    return c = c || Jb(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)), Ib.test(g) && Hb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + ""
}) : z.documentElement.currentStyle && (Jb = function(a) {
    return a.currentStyle
}, Kb = function(a, b, c) {
    var d, e, f, g, h = a.style;
    return c = c || Jb(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), Ib.test(g) && !Lb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto"
});

function Mb(a, b) {
    return {
        get: function() {
            var c = a();
            if (null != c) return c ? void delete this.get : (this.get = b).apply(this, arguments)
        }
    }
}! function() {
    var b, c, d, e, f, g, h = z.createElement("div"),
        i = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px",
        j = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
    h.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", b = h.getElementsByTagName("a")[0], b.style.cssText = "float:left;opacity:.5", l.opacity = /^0.5/.test(b.style.opacity), l.cssFloat = !!b.style.cssFloat, h.style.backgroundClip = "content-box", h.cloneNode(!0).style.backgroundClip = "", l.clearCloneStyle = "content-box" === h.style.backgroundClip, b = h = null, n.extend(l, {
        reliableHiddenOffsets: function() {
            if (null != c) return c;
            var a, b, d, e = z.createElement("div"),
                f = z.getElementsByTagName("body")[0];
            if (f) return e.setAttribute("className", "t"), e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = z.createElement("div"), a.style.cssText = i, f.appendChild(a).appendChild(e), e.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", b = e.getElementsByTagName("td"), b[0].style.cssText = "padding:0;margin:0;border:0;display:none", d = 0 === b[0].offsetHeight, b[0].style.display = "", b[1].style.display = "none", c = d && 0 === b[0].offsetHeight, f.removeChild(a), e = f = null, c
        },
        boxSizing: function() {
            return null == d && k(), d
        },
        boxSizingReliable: function() {
            return null == e && k(), e
        },
        pixelPosition: function() {
            return null == f && k(), f
        },
        reliableMarginRight: function() {
            var b, c, d, e;
            if (null == g && a.getComputedStyle) {
                if (b = z.getElementsByTagName("body")[0], !b) return;
                c = z.createElement("div"), d = z.createElement("div"), c.style.cssText = i, b.appendChild(c).appendChild(d), e = d.appendChild(z.createElement("div")), e.style.cssText = d.style.cssText = j, e.style.marginRight = e.style.width = "0", d.style.width = "1px", g = !parseFloat((a.getComputedStyle(e, null) || {}).marginRight), b.removeChild(c)
            }
            return g
        }
    });

    function k() {
        var b, c, h = z.getElementsByTagName("body")[0];
        h && (b = z.createElement("div"), c = z.createElement("div"), b.style.cssText = i, h.appendChild(b).appendChild(c), c.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%", n.swap(h, null != h.style.zoom ? {
            zoom: 1
        } : {}, function() {
            d = 4 === c.offsetWidth
        }), e = !0, f = !1, g = !0, a.getComputedStyle && (f = "1%" !== (a.getComputedStyle(c, null) || {}).top, e = "4px" === (a.getComputedStyle(c, null) || {
            width: "4px"
        }).width), h.removeChild(b), c = h = null)
    }
}(), n.swap = function(a, b, c, d) {
    var e, f, g = {};
    for (f in b) g[f] = a.style[f], a.style[f] = b[f];
    e = c.apply(a, d || []);
    for (f in b) a.style[f] = g[f];
    return e
};
var Nb = /alpha\([^)]*\)/i,
    Ob = /opacity\s*=\s*([^)]*)/,
    Pb = /^(none|table(?!-c[ea]).+)/,
    Qb = new RegExp("^(" + T + ")(.*)$", "i"),
    Rb = new RegExp("^([+-])=(" + T + ")", "i"),
    Sb = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    },
    Tb = {
        letterSpacing: 0,
        fontWeight: 400
    },
    Ub = ["Webkit", "O", "Moz", "ms"];

function Vb(a, b) {
    if (b in a) return b;
    var c = b.charAt(0).toUpperCase() + b.slice(1),
        d = b,
        e = Ub.length;
    while (e--)
        if (b = Ub[e] + c, b in a) return b;
    return d
}

function Wb(a, b) {
    for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = n._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && V(d) && (f[g] = n._data(d, "olddisplay", Gb(d.nodeName)))) : f[g] || (e = V(d), (c && "none" !== c || !e) && n._data(d, "olddisplay", e ? c : n.css(d, "display"))));
    for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
    return a
}

function Xb(a, b, c) {
    var d = Qb.exec(b);
    return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
}

function Yb(a, b, c, d, e) {
    for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += n.css(a, c + U[f], !0, e)), d ? ("content" === c && (g -= n.css(a, "padding" + U[f], !0, e)), "margin" !== c && (g -= n.css(a, "border" + U[f] + "Width", !0, e))) : (g += n.css(a, "padding" + U[f], !0, e), "padding" !== c && (g += n.css(a, "border" + U[f] + "Width", !0, e)));
    return g
}

function Zb(a, b, c) {
    var d = !0,
        e = "width" === b ? a.offsetWidth : a.offsetHeight,
        f = Jb(a),
        g = l.boxSizing() && "border-box" === n.css(a, "boxSizing", !1, f);
    if (0 >= e || null == e) {
        if (e = Kb(a, b, f), (0 > e || null == e) && (e = a.style[b]), Ib.test(e)) return e;
        d = g && (l.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
    }
    return e + Yb(a, b, c || (g ? "border" : "content"), d, f) + "px"
}
n.extend({
    cssHooks: {
        opacity: {
            get: function(a, b) {
                if (b) {
                    var c = Kb(a, "opacity");
                    return "" === c ? "1" : c
                }
            }
        }
    },
    cssNumber: {
        columnCount: !0,
        fillOpacity: !0,
        fontWeight: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0
    },
    cssProps: {
        "float": l.cssFloat ? "cssFloat" : "styleFloat"
    },
    style: function(a, b, c, d) {
        if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
            var e, f, g, h = n.camelCase(b),
                i = a.style;
            if (b = n.cssProps[h] || (n.cssProps[h] = Vb(i, h)), g = n.cssHooks[b] || n.cssHooks[h], void 0 === c) return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
            if (f = typeof c, "string" === f && (e = Rb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(n.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || n.cssNumber[h] || (c += "px"), l.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) try {
                i[b] = "", i[b] = c
            } catch (j) {}
        }
    },
    css: function(a, b, c, d) {
        var e, f, g, h = n.camelCase(b);
        return b = n.cssProps[h] || (n.cssProps[h] = Vb(a.style, h)), g = n.cssHooks[b] || n.cssHooks[h], g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = Kb(a, b, d)), "normal" === f && b in Tb && (f = Tb[b]), "" === c || c ? (e = parseFloat(f), c === !0 || n.isNumeric(e) ? e || 0 : f) : f
    }
}), n.each(["height", "width"], function(a, b) {
    n.cssHooks[b] = {
        get: function(a, c, d) {
            return c ? 0 === a.offsetWidth && Pb.test(n.css(a, "display")) ? n.swap(a, Sb, function() {
                return Zb(a, b, d)
            }) : Zb(a, b, d) : void 0
        },
        set: function(a, c, d) {
            var e = d && Jb(a);
            return Xb(a, c, d ? Yb(a, b, d, l.boxSizing() && "border-box" === n.css(a, "boxSizing", !1, e), e) : 0)
        }
    }
}), l.opacity || (n.cssHooks.opacity = {
    get: function(a, b) {
        return Ob.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
    },
    set: function(a, b) {
        var c = a.style,
            d = a.currentStyle,
            e = n.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
            f = d && d.filter || c.filter || "";
        c.zoom = 1, (b >= 1 || "" === b) && "" === n.trim(f.replace(Nb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = Nb.test(f) ? f.replace(Nb, e) : f + " " + e)
    }
}), n.cssHooks.marginRight = Mb(l.reliableMarginRight, function(a, b) {
    return b ? n.swap(a, {
        display: "inline-block"
    }, Kb, [a, "marginRight"]) : void 0
}), n.each({
    margin: "",
    padding: "",
    border: "Width"
}, function(a, b) {
    n.cssHooks[a + b] = {
        expand: function(c) {
            for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + U[d] + b] = f[d] || f[d - 2] || f[0];
            return e
        }
    }, Hb.test(a) || (n.cssHooks[a + b].set = Xb)
}), n.fn.extend({
    css: function(a, b) {
        return W(this, function(a, b, c) {
            var d, e, f = {},
                g = 0;
            if (n.isArray(b)) {
                for (d = Jb(a), e = b.length; e > g; g++) f[b[g]] = n.css(a, b[g], !1, d);
                return f
            }
            return void 0 !== c ? n.style(a, b, c) : n.css(a, b)
        }, a, b, arguments.length > 1)
    },
    show: function() {
        return Wb(this, !0)
    },
    hide: function() {
        return Wb(this)
    },
    toggle: function(a) {
        return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
            V(this) ? n(this).show() : n(this).hide()
        })
    }
});

function $b(a, b, c, d, e) {
    return new $b.prototype.init(a, b, c, d, e)
}
n.Tween = $b, $b.prototype = {
    constructor: $b,
    init: function(a, b, c, d, e, f) {
        this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (n.cssNumber[c] ? "" : "px")
    },
    cur: function() {
        var a = $b.propHooks[this.prop];
        return a && a.get ? a.get(this) : $b.propHooks._default.get(this)
    },
    run: function(a) {
        var b, c = $b.propHooks[this.prop];
        return this.pos = b = this.options.duration ? n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : $b.propHooks._default.set(this), this
    }
}, $b.prototype.init.prototype = $b.prototype, $b.propHooks = {
    _default: {
        get: function(a) {
            var b;
            return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = n.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
        },
        set: function(a) {
            n.fx.step[a.prop] ? n.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[n.cssProps[a.prop]] || n.cssHooks[a.prop]) ? n.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
        }
    }
}, $b.propHooks.scrollTop = $b.propHooks.scrollLeft = {
    set: function(a) {
        a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
    }
}, n.easing = {
    linear: function(a) {
        return a
    },
    swing: function(a) {
        return .5 - Math.cos(a * Math.PI) / 2
    }
}, n.fx = $b.prototype.init, n.fx.step = {};
var _b, ac, bc = /^(?:toggle|show|hide)$/,
    cc = new RegExp("^(?:([+-])=|)(" + T + ")([a-z%]*)$", "i"),
    dc = /queueHooks$/,
    ec = [jc],
    fc = {
        "*": [function(a, b) {
            var c = this.createTween(a, b),
                d = c.cur(),
                e = cc.exec(b),
                f = e && e[3] || (n.cssNumber[a] ? "" : "px"),
                g = (n.cssNumber[a] || "px" !== f && +d) && cc.exec(n.css(c.elem, a)),
                h = 1,
                i = 20;
            if (g && g[3] !== f) {
                f = f || g[3], e = e || [], g = +d || 1;
                do h = h || ".5", g /= h, n.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i)
            }
            return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
        }]
    };

function gc() {
    return setTimeout(function() {
        _b = void 0
    }), _b = n.now()
}

function hc(a, b) {
    var c, d = {
            height: a
        },
        e = 0;
    for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = U[e], d["margin" + c] = d["padding" + c] = a;
    return b && (d.opacity = d.width = a), d
}

function ic(a, b, c) {
    for (var d, e = (fc[b] || []).concat(fc["*"]), f = 0, g = e.length; g > f; f++)
        if (d = e[f].call(c, b, a)) return d
}

function jc(a, b, c) {
    var d, e, f, g, h, i, j, k, m = this,
        o = {},
        p = a.style,
        q = a.nodeType && V(a),
        r = n._data(a, "fxshow");
    c.queue || (h = n._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function() {
        h.unqueued || i()
    }), h.unqueued++, m.always(function() {
        m.always(function() {
            h.unqueued--, n.queue(a, "fx").length || h.empty.fire()
        })
    })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY], j = n.css(a, "display"), k = Gb(a.nodeName), "none" === j && (j = k), "inline" === j && "none" === n.css(a, "float") && (l.inlineBlockNeedsLayout && "inline" !== k ? p.zoom = 1 : p.display = "inline-block")), c.overflow && (p.overflow = "hidden", l.shrinkWrapBlocks() || m.always(function() {
        p.overflow = c.overflow[0], p.overflowX = c.overflow[1], p.overflowY = c.overflow[2]
    }));
    for (d in b)
        if (e = b[d], bc.exec(e)) {
            if (delete b[d], f = f || "toggle" === e, e === (q ? "hide" : "show")) {
                if ("show" !== e || !r || void 0 === r[d]) continue;
                q = !0
            }
            o[d] = r && r[d] || n.style(a, d)
        } if (!n.isEmptyObject(o)) {
        r ? "hidden" in r && (q = r.hidden) : r = n._data(a, "fxshow", {}), f && (r.hidden = !q), q ? n(a).show() : m.done(function() {
            n(a).hide()
        }), m.done(function() {
            var b;
            n._removeData(a, "fxshow");
            for (b in o) n.style(a, b, o[b])
        });
        for (d in o) g = ic(q ? r[d] : 0, d, m), d in r || (r[d] = g.start, q && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
    }
}

function kc(a, b) {
    var c, d, e, f, g;
    for (c in a)
        if (d = n.camelCase(c), e = b[d], f = a[c], n.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = n.cssHooks[d], g && "expand" in g) {
            f = g.expand(f), delete a[d];
            for (c in f) c in a || (a[c] = f[c], b[c] = e)
        } else b[d] = e
}

function lc(a, b, c) {
    var d, e, f = 0,
        g = ec.length,
        h = n.Deferred().always(function() {
            delete i.elem
        }),
        i = function() {
            if (e) return !1;
            for (var b = _b || gc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
            return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
        },
        j = h.promise({
            elem: a,
            props: n.extend({}, b),
            opts: n.extend(!0, {
                specialEasing: {}
            }, c),
            originalProperties: b,
            originalOptions: c,
            startTime: _b || gc(),
            duration: c.duration,
            tweens: [],
            createTween: function(b, c) {
                var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d), d
            },
            stop: function(b) {
                var c = 0,
                    d = b ? j.tweens.length : 0;
                if (e) return this;
                for (e = !0; d > c; c++) j.tweens[c].run(1);
                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
            }
        }),
        k = j.props;
    for (kc(k, j.opts.specialEasing); g > f; f++)
        if (d = ec[f].call(j, a, k, j.opts)) return d;
    return n.map(k, ic, j), n.isFunction(j.opts.start) && j.opts.start.call(a, j), n.fx.timer(n.extend(i, {
        elem: a,
        anim: j,
        queue: j.opts.queue
    })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
}
n.Animation = n.extend(lc, {
        tweener: function(a, b) {
            n.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++) c = a[d], fc[c] = fc[c] || [], fc[c].unshift(b)
        },
        prefilter: function(a, b) {
            b ? ec.unshift(a) : ec.push(a)
        }
    }), n.speed = function(a, b, c) {
        var d = a && "object" == typeof a ? n.extend({}, a) : {
            complete: c || !c && b || n.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !n.isFunction(b) && b
        };
        return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
            n.isFunction(d.old) && d.old.call(this), d.queue && n.dequeue(this, d.queue)
        }, d
    }, n.fn.extend({
        fadeTo: function(a, b, c, d) {
            return this.filter(V).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            var e = n.isEmptyObject(a),
                f = n.speed(b, c, d),
                g = function() {
                    var b = lc(this, n.extend({}, a), f);
                    (e || n._data(this, "finish")) && b.stop(!0)
                };
            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },
        stop: function(a, b, c) {
            var d = function(a) {
                var b = a.stop;
                delete a.stop, b(c)
            };
            return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                var b = !0,
                    e = null != a && a + "queueHooks",
                    f = n.timers,
                    g = n._data(this);
                if (e) g[e] && g[e].stop && d(g[e]);
                else
                    for (e in g) g[e] && g[e].stop && dc.test(e) && d(g[e]);
                for (e = f.length; e--;) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                (b || !c) && n.dequeue(this, a)
            })
        },
        finish: function(a) {
            return a !== !1 && (a = a || "fx"), this.each(function() {
                var b, c = n._data(this),
                    d = c[a + "queue"],
                    e = c[a + "queueHooks"],
                    f = n.timers,
                    g = d ? d.length : 0;
                for (c.finish = !0, n.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish
            })
        }
    }), n.each(["toggle", "show", "hide"], function(a, b) {
        var c = n.fn[b];
        n.fn[b] = function(a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(hc(b, !0), a, d, e)
        }
    }), n.each({
        slideDown: hc("show"),
        slideUp: hc("hide"),
        slideToggle: hc("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        n.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), n.timers = [], n.fx.tick = function() {
        var a, b = n.timers,
            c = 0;
        for (_b = n.now(); c < b.length; c++) a = b[c], a() || b[c] !== a || b.splice(c--, 1);
        b.length || n.fx.stop(), _b = void 0
    }, n.fx.timer = function(a) {
        n.timers.push(a), a() ? n.fx.start() : n.timers.pop()
    }, n.fx.interval = 13, n.fx.start = function() {
        ac || (ac = setInterval(n.fx.tick, n.fx.interval))
    }, n.fx.stop = function() {
        clearInterval(ac), ac = null
    }, n.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, n.fn.delay = function(a, b) {
        return a = n.fx ? n.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
            var d = setTimeout(b, a);
            c.stop = function() {
                clearTimeout(d)
            }
        })
    },
    function() {
        var a, b, c, d, e = z.createElement("div");
        e.setAttribute("className", "t"), e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = e.getElementsByTagName("a")[0], c = z.createElement("select"), d = c.appendChild(z.createElement("option")), b = e.getElementsByTagName("input")[0], a.style.cssText = "top:1px", l.getSetAttribute = "t" !== e.className, l.style = /top/.test(a.getAttribute("style")), l.hrefNormalized = "/a" === a.getAttribute("href"), l.checkOn = !!b.value, l.optSelected = d.selected, l.enctype = !!z.createElement("form").enctype, c.disabled = !0, l.optDisabled = !d.disabled, b = z.createElement("input"), b.setAttribute("value", ""), l.input = "" === b.getAttribute("value"), b.value = "t", b.setAttribute("type", "radio"), l.radioValue = "t" === b.value, a = b = c = d = e = null
    }();
var mc = /\r/g;
n.fn.extend({
    val: function(a) {
        var b, c, d, e = this[0]; {
            if (arguments.length) return d = n.isFunction(a), this.each(function(c) {
                var e;
                1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function(a) {
                    return null == a ? "" : a + ""
                })), b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
            });
            if (e) return b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(mc, "") : null == c ? "" : c)
        }
    }
}), n.extend({
    valHooks: {
        option: {
            get: function(a) {
                var b = n.find.attr(a, "value");
                return null != b ? b : n.text(a)
            }
        },
        select: {
            get: function(a) {
                for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                    if (c = d[i], !(!c.selected && i !== e || (l.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && n.nodeName(c.parentNode, "optgroup"))) {
                        if (b = n(c).val(), f) return b;
                        g.push(b)
                    } return g
            },
            set: function(a, b) {
                var c, d, e = a.options,
                    f = n.makeArray(b),
                    g = e.length;
                while (g--)
                    if (d = e[g], n.inArray(n.valHooks.option.get(d), f) >= 0) try {
                        d.selected = c = !0
                    } catch (h) {
                        d.scrollHeight
                    } else d.selected = !1;
                return c || (a.selectedIndex = -1), e
            }
        }
    }
}), n.each(["radio", "checkbox"], function() {
    n.valHooks[this] = {
        set: function(a, b) {
            return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) >= 0 : void 0
        }
    }, l.checkOn || (n.valHooks[this].get = function(a) {
        return null === a.getAttribute("value") ? "on" : a.value
    })
});
var nc, oc, pc = n.expr.attrHandle,
    qc = /^(?:checked|selected)$/i,
    rc = l.getSetAttribute,
    sc = l.input;
n.fn.extend({
    attr: function(a, b) {
        return W(this, n.attr, a, b, arguments.length > 1)
    },
    removeAttr: function(a) {
        return this.each(function() {
            n.removeAttr(this, a)
        })
    }
}), n.extend({
    attr: function(a, b, c) {
        var d, e, f = a.nodeType;
        if (a && 3 !== f && 8 !== f && 2 !== f) return typeof a.getAttribute === L ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(), d = n.attrHooks[b] || (n.expr.match.bool.test(b) ? oc : nc)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = n.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void n.removeAttr(a, b))
    },
    removeAttr: function(a, b) {
        var c, d, e = 0,
            f = b && b.match(F);
        if (f && 1 === a.nodeType)
            while (c = f[e++]) d = n.propFix[c] || c, n.expr.match.bool.test(c) ? sc && rc || !qc.test(c) ? a[d] = !1 : a[n.camelCase("default-" + c)] = a[d] = !1 : n.attr(a, c, ""), a.removeAttribute(rc ? c : d)
    },
    attrHooks: {
        type: {
            set: function(a, b) {
                if (!l.radioValue && "radio" === b && n.nodeName(a, "input")) {
                    var c = a.value;
                    return a.setAttribute("type", b), c && (a.value = c), b
                }
            }
        }
    }
}), oc = {
    set: function(a, b, c) {
        return b === !1 ? n.removeAttr(a, c) : sc && rc || !qc.test(c) ? a.setAttribute(!rc && n.propFix[c] || c, c) : a[n.camelCase("default-" + c)] = a[c] = !0, c
    }
}, n.each(n.expr.match.bool.source.match(/\w+/g), function(a, b) {
    var c = pc[b] || n.find.attr;
    pc[b] = sc && rc || !qc.test(b) ? function(a, b, d) {
        var e, f;
        return d || (f = pc[b], pc[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, pc[b] = f), e
    } : function(a, b, c) {
        return c ? void 0 : a[n.camelCase("default-" + b)] ? b.toLowerCase() : null
    }
}), sc && rc || (n.attrHooks.value = {
    set: function(a, b, c) {
        return n.nodeName(a, "input") ? void(a.defaultValue = b) : nc && nc.set(a, b, c)
    }
}), rc || (nc = {
    set: function(a, b, c) {
        var d = a.getAttributeNode(c);
        return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
    }
}, pc.id = pc.name = pc.coords = function(a, b, c) {
    var d;
    return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
}, n.valHooks.button = {
    get: function(a, b) {
        var c = a.getAttributeNode(b);
        return c && c.specified ? c.value : void 0
    },
    set: nc.set
}, n.attrHooks.contenteditable = {
    set: function(a, b, c) {
        nc.set(a, "" === b ? !1 : b, c)
    }
}, n.each(["width", "height"], function(a, b) {
    n.attrHooks[b] = {
        set: function(a, c) {
            return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
        }
    }
})), l.style || (n.attrHooks.style = {
    get: function(a) {
        return a.style.cssText || void 0
    },
    set: function(a, b) {
        return a.style.cssText = b + ""
    }
});
var tc = /^(?:input|select|textarea|button|object)$/i,
    uc = /^(?:a|area)$/i;
n.fn.extend({
    prop: function(a, b) {
        return W(this, n.prop, a, b, arguments.length > 1)
    },
    removeProp: function(a) {
        return a = n.propFix[a] || a, this.each(function() {
            try {
                this[a] = void 0, delete this[a]
            } catch (b) {}
        })
    }
}), n.extend({
    propFix: {
        "for": "htmlFor",
        "class": "className"
    },
    prop: function(a, b, c) {
        var d, e, f, g = a.nodeType;
        if (a && 3 !== g && 8 !== g && 2 !== g) return f = 1 !== g || !n.isXMLDoc(a), f && (b = n.propFix[b] || b, e = n.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
    },
    propHooks: {
        tabIndex: {
            get: function(a) {
                var b = n.find.attr(a, "tabindex");
                return b ? parseInt(b, 10) : tc.test(a.nodeName) || uc.test(a.nodeName) && a.href ? 0 : -1
            }
        }
    }
}), l.hrefNormalized || n.each(["href", "src"], function(a, b) {
    n.propHooks[b] = {
        get: function(a) {
            return a.getAttribute(b, 4)
        }
    }
}), l.optSelected || (n.propHooks.selected = {
    get: function(a) {
        var b = a.parentNode;
        return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
    }
}), n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
    n.propFix[this.toLowerCase()] = this
}), l.enctype || (n.propFix.enctype = "encoding");
var vc = /[\t\r\n\f]/g;
n.fn.extend({
    addClass: function(a) {
        var b, c, d, e, f, g, h = 0,
            i = this.length,
            j = "string" == typeof a && a;
        if (n.isFunction(a)) return this.each(function(b) {
            n(this).addClass(a.call(this, b, this.className))
        });
        if (j)
            for (b = (a || "").match(F) || []; i > h; h++)
                if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vc, " ") : " ")) {
                    f = 0;
                    while (e = b[f++]) d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                    g = n.trim(d), c.className !== g && (c.className = g)
                } return this
    },
    removeClass: function(a) {
        var b, c, d, e, f, g, h = 0,
            i = this.length,
            j = 0 === arguments.length || "string" == typeof a && a;
        if (n.isFunction(a)) return this.each(function(b) {
            n(this).removeClass(a.call(this, b, this.className))
        });
        if (j)
            for (b = (a || "").match(F) || []; i > h; h++)
                if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vc, " ") : "")) {
                    f = 0;
                    while (e = b[f++])
                        while (d.indexOf(" " + e + " ") >= 0) d = d.replace(" " + e + " ", " ");
                    g = a ? n.trim(d) : "", c.className !== g && (c.className = g)
                } return this
    },
    toggleClass: function(a, b) {
        var c = typeof a;
        return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(n.isFunction(a) ? function(c) {
            n(this).toggleClass(a.call(this, c, this.className, b), b)
        } : function() {
            if ("string" === c) {
                var b, d = 0,
                    e = n(this),
                    f = a.match(F) || [];
                while (b = f[d++]) e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
            } else(c === L || "boolean" === c) && (this.className && n._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : n._data(this, "__className__") || "")
        })
    },
    hasClass: function(a) {
        for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
            if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(vc, " ").indexOf(b) >= 0) return !0;
        return !1
    }
}), n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
    n.fn[b] = function(a, c) {
        return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
    }
}), n.fn.extend({
    hover: function(a, b) {
        return this.mouseenter(a).mouseleave(b || a)
    },
    bind: function(a, b, c) {
        return this.on(a, null, b, c)
    },
    unbind: function(a, b) {
        return this.off(a, null, b)
    },
    delegate: function(a, b, c, d) {
        return this.on(b, a, c, d)
    },
    undelegate: function(a, b, c) {
        return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
    }
});
var wc = n.now(),
    xc = /\?/,
    yc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
n.parseJSON = function(b) {
    if (a.JSON && a.JSON.parse) return a.JSON.parse(b + "");
    var c, d = null,
        e = n.trim(b + "");
    return e && !n.trim(e.replace(yc, function(a, b, e, f) {
        return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "")
    })) ? Function("return " + e)() : n.error("Invalid JSON: " + b)
}, n.parseXML = function(b) {
    var c, d;
    if (!b || "string" != typeof b) return null;
    try {
        a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
    } catch (e) {
        c = void 0
    }
    return c && c.documentElement && !c.getElementsByTagName("parsererror").length || n.error("Invalid XML: " + b), c
};
var zc, Ac, Bc = /#.*$/,
    Cc = /([?&])_=[^&]*/,
    Dc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    Ec = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    Fc = /^(?:GET|HEAD)$/,
    Gc = /^\/\//,
    Hc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
    Ic = {},
    Jc = {},
    Kc = "*/".concat("*");
try {
    Ac = location.href
} catch (Lc) {
    Ac = z.createElement("a"), Ac.href = "", Ac = Ac.href
}
zc = Hc.exec(Ac.toLowerCase()) || [];

function Mc(a) {
    return function(b, c) {
        "string" != typeof b && (c = b, b = "*");
        var d, e = 0,
            f = b.toLowerCase().match(F) || [];
        if (n.isFunction(c))
            while (d = f[e++]) "+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
    }
}

function Nc(a, b, c, d) {
    var e = {},
        f = a === Jc;

    function g(h) {
        var i;
        return e[h] = !0, n.each(a[h] || [], function(a, h) {
            var j = h(b, c, d);
            return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1)
        }), i
    }
    return g(b.dataTypes[0]) || !e["*"] && g("*")
}

function Oc(a, b) {
    var c, d, e = n.ajaxSettings.flatOptions || {};
    for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
    return c && n.extend(!0, a, c), a
}

function Pc(a, b, c) {
    var d, e, f, g, h = a.contents,
        i = a.dataTypes;
    while ("*" === i[0]) i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
    if (e)
        for (g in h)
            if (h[g] && h[g].test(e)) {
                i.unshift(g);
                break
            } if (i[0] in c) f = i[0];
    else {
        for (g in c) {
            if (!i[0] || a.converters[g + " " + i[0]]) {
                f = g;
                break
            }
            d || (d = g)
        }
        f = f || d
    }
    return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
}

function Qc(a, b, c, d) {
    var e, f, g, h, i, j = {},
        k = a.dataTypes.slice();
    if (k[1])
        for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
    f = k.shift();
    while (f)
        if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
            if ("*" === f) f = i;
            else if ("*" !== i && i !== f) {
        if (g = j[i + " " + f] || j["* " + f], !g)
            for (e in j)
                if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                    g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                    break
                } if (g !== !0)
            if (g && a["throws"]) b = g(b);
            else try {
                b = g(b)
            } catch (l) {
                return {
                    state: "parsererror",
                    error: g ? l : "No conversion from " + i + " to " + f
                }
            }
    }
    return {
        state: "success",
        data: b
    }
}
n.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
        url: Ac,
        type: "GET",
        isLocal: Ec.test(zc[1]),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
            "*": Kc,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
        },
        contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
        },
        responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
        },
        converters: {
            "* text": String,
            "text html": !0,
            "text json": n.parseJSON,
            "text xml": n.parseXML
        },
        flatOptions: {
            url: !0,
            context: !0
        }
    },
    ajaxSetup: function(a, b) {
        return b ? Oc(Oc(a, n.ajaxSettings), b) : Oc(n.ajaxSettings, a)
    },
    ajaxPrefilter: Mc(Ic),
    ajaxTransport: Mc(Jc),
    ajax: function(a, b) {
        "object" == typeof a && (b = a, a = void 0), b = b || {};
        var c, d, e, f, g, h, i, j, k = n.ajaxSetup({}, b),
            l = k.context || k,
            m = k.context && (l.nodeType || l.jquery) ? n(l) : n.event,
            o = n.Deferred(),
            p = n.Callbacks("once memory"),
            q = k.statusCode || {},
            r = {},
            s = {},
            t = 0,
            u = "canceled",
            v = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var b;
                    if (2 === t) {
                        if (!j) {
                            j = {};
                            while (b = Dc.exec(f)) j[b[1].toLowerCase()] = b[2]
                        }
                        b = j[a.toLowerCase()]
                    }
                    return null == b ? null : b
                },
                getAllResponseHeaders: function() {
                    return 2 === t ? f : null
                },
                setRequestHeader: function(a, b) {
                    var c = a.toLowerCase();
                    return t || (a = s[c] = s[c] || a, r[a] = b), this
                },
                overrideMimeType: function(a) {
                    return t || (k.mimeType = a), this
                },
                statusCode: function(a) {
                    var b;
                    if (a)
                        if (2 > t)
                            for (b in a) q[b] = [q[b], a[b]];
                        else v.always(a[v.status]);
                    return this
                },
                abort: function(a) {
                    var b = a || u;
                    return i && i.abort(b), x(0, b), this
                }
            };
        if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || Ac) + "").replace(Bc, "").replace(Gc, zc[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = n.trim(k.dataType || "*").toLowerCase().match(F) || [""], null == k.crossDomain && (c = Hc.exec(k.url.toLowerCase()), k.crossDomain = !(!c || c[1] === zc[1] && c[2] === zc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (zc[3] || ("http:" === zc[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = n.param(k.data, k.traditional)), Nc(Ic, k, b, v), 2 === t) return v;
        h = k.global, h && 0 === n.active++ && n.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !Fc.test(k.type), e = k.url, k.hasContent || (k.data && (e = k.url += (xc.test(e) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = Cc.test(e) ? e.replace(Cc, "$1_=" + wc++) : e + (xc.test(e) ? "&" : "?") + "_=" + wc++)), k.ifModified && (n.lastModified[e] && v.setRequestHeader("If-Modified-Since", n.lastModified[e]), n.etag[e] && v.setRequestHeader("If-None-Match", n.etag[e])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Kc + "; q=0.01" : "") : k.accepts["*"]);
        for (d in k.headers) v.setRequestHeader(d, k.headers[d]);
        if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) return v.abort();
        u = "abort";
        for (d in {
                success: 1,
                error: 1,
                complete: 1
            }) v[d](k[d]);
        if (i = Nc(Jc, k, b, v)) {
            v.readyState = 1, h && m.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function() {
                v.abort("timeout")
            }, k.timeout));
            try {
                t = 1, i.send(r, x)
            } catch (w) {
                if (!(2 > t)) throw w;
                x(-1, w)
            }
        } else x(-1, "No Transport");

        function x(a, b, c, d) {
            var j, r, s, u, w, x = b;
            2 !== t && (t = 2, g && clearTimeout(g), i = void 0, f = d || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, c && (u = Pc(k, v, c)), u = Qc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (n.lastModified[e] = w), w = v.getResponseHeader("etag"), w && (n.etag[e] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, h && m.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), h && (m.trigger("ajaxComplete", [v, k]), --n.active || n.event.trigger("ajaxStop")))
        }
        return v
    },
    getJSON: function(a, b, c) {
        return n.get(a, b, c, "json")
    },
    getScript: function(a, b) {
        return n.get(a, void 0, b, "script")
    }
}), n.each(["get", "post"], function(a, b) {
    n[b] = function(a, c, d, e) {
        return n.isFunction(c) && (e = e || d, d = c, c = void 0), n.ajax({
            url: a,
            type: b,
            dataType: e,
            data: c,
            success: d
        })
    }
}), n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
    n.fn[b] = function(a) {
        return this.on(b, a)
    }
}), n._evalUrl = function(a) {
    return n.ajax({
        url: a,
        type: "GET",
        dataType: "script",
        async: !1,
        global: !1,
        "throws": !0
    })
}, n.fn.extend({
    wrapAll: function(a) {
        if (n.isFunction(a)) return this.each(function(b) {
            n(this).wrapAll(a.call(this, b))
        });
        if (this[0]) {
            var b = n(a, this[0].ownerDocument).eq(0).clone(!0);
            this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                var a = this;
                while (a.firstChild && 1 === a.firstChild.nodeType) a = a.firstChild;
                return a
            }).append(this)
        }
        return this
    },
    wrapInner: function(a) {
        return this.each(n.isFunction(a) ? function(b) {
            n(this).wrapInner(a.call(this, b))
        } : function() {
            var b = n(this),
                c = b.contents();
            c.length ? c.wrapAll(a) : b.append(a)
        })
    },
    wrap: function(a) {
        var b = n.isFunction(a);
        return this.each(function(c) {
            n(this).wrapAll(b ? a.call(this, c) : a)
        })
    },
    unwrap: function() {
        return this.parent().each(function() {
            n.nodeName(this, "body") || n(this).replaceWith(this.childNodes)
        }).end()
    }
}), n.expr.filters.hidden = function(a) {
    return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !l.reliableHiddenOffsets() && "none" === (a.style && a.style.display || n.css(a, "display"))
}, n.expr.filters.visible = function(a) {
    return !n.expr.filters.hidden(a)
};
var Rc = /%20/g,
    Sc = /\[\]$/,
    Tc = /\r?\n/g,
    Uc = /^(?:submit|button|image|reset|file)$/i,
    Vc = /^(?:input|select|textarea|keygen)/i;

function Wc(a, b, c, d) {
    var e;
    if (n.isArray(b)) n.each(b, function(b, e) {
        c || Sc.test(a) ? d(a, e) : Wc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
    });
    else if (c || "object" !== n.type(b)) d(a, b);
    else
        for (e in b) Wc(a + "[" + e + "]", b[e], c, d)
}
n.param = function(a, b) {
    var c, d = [],
        e = function(a, b) {
            b = n.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
    if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional), n.isArray(a) || a.jquery && !n.isPlainObject(a)) n.each(a, function() {
        e(this.name, this.value)
    });
    else
        for (c in a) Wc(c, a[c], b, e);
    return d.join("&").replace(Rc, "+")
}, n.fn.extend({
    serialize: function() {
        return n.param(this.serializeArray())
    },
    serializeArray: function() {
        return this.map(function() {
            var a = n.prop(this, "elements");
            return a ? n.makeArray(a) : this
        }).filter(function() {
            var a = this.type;
            return this.name && !n(this).is(":disabled") && Vc.test(this.nodeName) && !Uc.test(a) && (this.checked || !X.test(a))
        }).map(function(a, b) {
            var c = n(this).val();
            return null == c ? null : n.isArray(c) ? n.map(c, function(a) {
                return {
                    name: b.name,
                    value: a.replace(Tc, "\r\n")
                }
            }) : {
                name: b.name,
                value: c.replace(Tc, "\r\n")
            }
        }).get()
    }
}), n.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
    return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && $c() || _c()
} : $c;
var Xc = 0,
    Yc = {},
    Zc = n.ajaxSettings.xhr();
a.ActiveXObject && n(a).on("unload", function() {
    for (var a in Yc) Yc[a](void 0, !0)
}), l.cors = !!Zc && "withCredentials" in Zc, Zc = l.ajax = !!Zc, Zc && n.ajaxTransport(function(a) {
    if (!a.crossDomain || l.cors) {
        var b;
        return {
            send: function(c, d) {
                var e, f = a.xhr(),
                    g = ++Xc;
                if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
                    for (e in a.xhrFields) f[e] = a.xhrFields[e];
                a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                for (e in c) void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                f.send(a.hasContent && a.data || null), b = function(c, e) {
                    var h, i, j;
                    if (b && (e || 4 === f.readyState))
                        if (delete Yc[g], b = void 0, f.onreadystatechange = n.noop, e) 4 !== f.readyState && f.abort();
                        else {
                            j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                            try {
                                i = f.statusText
                            } catch (k) {
                                i = ""
                            }
                            h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                        } j && d(h, i, j, f.getAllResponseHeaders())
                }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Yc[g] = b : b()
            },
            abort: function() {
                b && b(void 0, !0)
            }
        }
    }
});

function $c() {
    try {
        return new a.XMLHttpRequest
    } catch (b) {}
}

function _c() {
    try {
        return new a.ActiveXObject("Microsoft.XMLHTTP")
    } catch (b) {}
}
n.ajaxSetup({
    accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
        script: /(?:java|ecma)script/
    },
    converters: {
        "text script": function(a) {
            return n.globalEval(a), a
        }
    }
}), n.ajaxPrefilter("script", function(a) {
    void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
}), n.ajaxTransport("script", function(a) {
    if (a.crossDomain) {
        var b, c = z.head || n("head")[0] || z.documentElement;
        return {
            send: function(d, e) {
                b = z.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                    (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
                }, c.insertBefore(b, c.firstChild)
            },
            abort: function() {
                b && b.onload(void 0, !0)
            }
        }
    }
});
var ad = [],
    bd = /(=)\?(?=&|$)|\?\?/;
n.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
        var a = ad.pop() || n.expando + "_" + wc++;
        return this[a] = !0, a
    }
}), n.ajaxPrefilter("json jsonp", function(b, c, d) {
    var e, f, g, h = b.jsonp !== !1 && (bd.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && bd.test(b.data) && "data");
    return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(bd, "$1" + e) : b.jsonp !== !1 && (b.url += (xc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function() {
        return g || n.error(e + " was not called"), g[0]
    }, b.dataTypes[0] = "json", f = a[e], a[e] = function() {
        g = arguments
    }, d.always(function() {
        a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, ad.push(e)), g && n.isFunction(f) && f(g[0]), g = f = void 0
    }), "script") : void 0
}), n.parseHTML = function(a, b, c) {
    if (!a || "string" != typeof a) return null;
    "boolean" == typeof b && (c = b, b = !1), b = b || z;
    var d = v.exec(a),
        e = !c && [];
    return d ? [b.createElement(d[1])] : (d = n.buildFragment([a], b, e), e && e.length && n(e).remove(), n.merge([], d.childNodes))
};
var cd = n.fn.load;
n.fn.load = function(a, b, c) {
    if ("string" != typeof a && cd) return cd.apply(this, arguments);
    var d, e, f, g = this,
        h = a.indexOf(" ");
    return h >= 0 && (d = a.slice(h, a.length), a = a.slice(0, h)), n.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && n.ajax({
        url: a,
        type: f,
        dataType: "html",
        data: b
    }).done(function(a) {
        e = arguments, g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a)
    }).complete(c && function(a, b) {
        g.each(c, e || [a.responseText, b, a])
    }), this
}, n.expr.filters.animated = function(a) {
    return n.grep(n.timers, function(b) {
        return a === b.elem
    }).length
};
var dd = a.document.documentElement;

function ed(a) {
    return n.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
}
n.offset = {
    setOffset: function(a, b, c) {
        var d, e, f, g, h, i, j, k = n.css(a, "position"),
            l = n(a),
            m = {};
        "static" === k && (a.style.position = "relative"), h = l.offset(), f = n.css(a, "top"), i = n.css(a, "left"), j = ("absolute" === k || "fixed" === k) && n.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), n.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
    }
}, n.fn.extend({
    offset: function(a) {
        if (arguments.length) return void 0 === a ? this : this.each(function(b) {
            n.offset.setOffset(this, a, b)
        });
        var b, c, d = {
                top: 0,
                left: 0
            },
            e = this[0],
            f = e && e.ownerDocument;
        if (f) return b = f.documentElement, n.contains(b, e) ? (typeof e.getBoundingClientRect !== L && (d = e.getBoundingClientRect()), c = ed(f), {
            top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
            left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
        }) : d
    },
    position: function() {
        if (this[0]) {
            var a, b, c = {
                    top: 0,
                    left: 0
                },
                d = this[0];
            return "fixed" === n.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), n.nodeName(a[0], "html") || (c = a.offset()), c.top += n.css(a[0], "borderTopWidth", !0), c.left += n.css(a[0], "borderLeftWidth", !0)), {
                top: b.top - c.top - n.css(d, "marginTop", !0),
                left: b.left - c.left - n.css(d, "marginLeft", !0)
            }
        }
    },
    offsetParent: function() {
        return this.map(function() {
            var a = this.offsetParent || dd;
            while (a && !n.nodeName(a, "html") && "static" === n.css(a, "position")) a = a.offsetParent;
            return a || dd
        })
    }
}), n.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
}, function(a, b) {
    var c = /Y/.test(b);
    n.fn[a] = function(d) {
        return W(this, function(a, d, e) {
            var f = ed(a);
            return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void(f ? f.scrollTo(c ? n(f).scrollLeft() : e, c ? e : n(f).scrollTop()) : a[d] = e)
        }, a, d, arguments.length, null)
    }
}), n.each(["top", "left"], function(a, b) {
    n.cssHooks[b] = Mb(l.pixelPosition, function(a, c) {
        return c ? (c = Kb(a, b), Ib.test(c) ? n(a).position()[b] + "px" : c) : void 0
    })
}), n.each({
    Height: "height",
    Width: "width"
}, function(a, b) {
    n.each({
        padding: "inner" + a,
        content: b,
        "": "outer" + a
    }, function(c, d) {
        n.fn[d] = function(d, e) {
            var f = arguments.length && (c || "boolean" != typeof d),
                g = c || (d === !0 || e === !0 ? "margin" : "border");
            return W(this, function(b, c, d) {
                var e;
                return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g)
            }, b, f ? d : void 0, f, null)
        }
    })
}), n.fn.size = function() {
    return this.length
}, n.fn.andSelf = n.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
    return n
});
var fd = a.jQuery,
    gd = a.$;
return n.noConflict = function(b) {
    return a.$ === n && (a.$ = gd), b && a.jQuery === n && (a.jQuery = fd), n
}, typeof b === L && (a.jQuery = a.$ = n), n
});



// slider
! function(i) {
  "use strict";
  "function" == typeof define && define.amd ? define(["jquery"], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery)
}(function(i) {
  "use strict";
  var e = window.Slick || {};
  (e = function() {
      var e = 0;
      return function(t, o) {
          var s, n = this;
          n.defaults = {
              accessibility: !0,
              adaptiveHeight: !1,
              appendArrows: i(t),
              appendDots: i(t),
              arrows: !0,
              asNavFor: null,
              prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
              nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
              autoplay: !1,
              autoplaySpeed: 3e3,
              centerMode: !1,
              centerPadding: "50px",
              cssEase: "ease",
              customPaging: function(e, t) {
                  return i('<button type="button" />').text(t + 1)
              },
              dots: !1,
              dotsClass: "slick-dots",
              draggable: !0,
              easing: "linear",
              edgeFriction: .35,
              fade: !1,
              focusOnSelect: !1,
              focusOnChange: !1,
              infinite: !0,
              initialSlide: 0,
              lazyLoad: "ondemand",
              mobileFirst: !1,
              pauseOnHover: !0,
              pauseOnFocus: !0,
              pauseOnDotsHover: !1,
              respondTo: "window",
              responsive: null,
              rows: 1,
              rtl: !1,
              slide: "",
              slidesPerRow: 1,
              slidesToShow: 1,
              slidesToScroll: 1,
              speed: 500,
              swipe: !0,
              swipeToSlide: !1,
              touchMove: !0,
              touchThreshold: 5,
              useCSS: !0,
              useTransform: !0,
              variableWidth: !1,
              vertical: !1,
              verticalSwiping: !1,
              waitForAnimate: !0,
              zIndex: 1e3
          }, n.initials = {
              animating: !1,
              dragging: !1,
              autoPlayTimer: null,
              currentDirection: 0,
              currentLeft: null,
              currentSlide: 0,
              direction: 1,
              $dots: null,
              listWidth: null,
              listHeight: null,
              loadIndex: 0,
              $nextArrow: null,
              $prevArrow: null,
              scrolling: !1,
              slideCount: null,
              slideWidth: null,
              $slideTrack: null,
              $slides: null,
              sliding: !1,
              slideOffset: 0,
              swipeLeft: null,
              swiping: !1,
              $list: null,
              touchObject: {},
              transformsEnabled: !1,
              unslicked: !1
          }, i.extend(n, n.initials), n.activeBreakpoint = null, n.animType = null, n.animProp = null, n.breakpoints = [], n.breakpointSettings = [], n.cssTransitions = !1, n.focussed = !1, n.interrupted = !1, n.hidden = "hidden", n.paused = !0, n.positionProp = null, n.respondTo = null, n.rowCount = 1, n.shouldClick = !0, n.$slider = i(t), n.$slidesCache = null, n.transformType = null, n.transitionType = null, n.visibilityChange = "visibilitychange", n.windowWidth = 0, n.windowTimer = null, s = i(t).data("slick") || {}, n.options = i.extend({}, n.defaults, o, s), n.currentSlide = n.options.initialSlide, n.originalSettings = n.options, void 0 !== document.mozHidden ? (n.hidden = "mozHidden", n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden", n.visibilityChange = "webkitvisibilitychange"), n.autoPlay = i.proxy(n.autoPlay, n), n.autoPlayClear = i.proxy(n.autoPlayClear, n), n.autoPlayIterator = i.proxy(n.autoPlayIterator, n), n.changeSlide = i.proxy(n.changeSlide, n), n.clickHandler = i.proxy(n.clickHandler, n), n.selectHandler = i.proxy(n.selectHandler, n), n.setPosition = i.proxy(n.setPosition, n), n.swipeHandler = i.proxy(n.swipeHandler, n), n.dragHandler = i.proxy(n.dragHandler, n), n.keyHandler = i.proxy(n.keyHandler, n), n.instanceUid = e++, n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, n.registerBreakpoints(), n.init(!0)
      }
  }()).prototype.activateADA = function() {
      this.$slideTrack.find(".slick-active").attr({
          "aria-hidden": "false"
      }).find("a, input, button, select").attr({
          tabindex: "0"
      })
  }, e.prototype.addSlide = e.prototype.slickAdd = function(e, t, o) {
      var s = this;
      if ("boolean" == typeof t) o = t, t = null;
      else if (t < 0 || t >= s.slideCount) return !1;
      s.unload(), "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : !0 === o ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack), s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), s.$slideTrack.append(s.$slides), s.$slides.each(function(e, t) {
          i(t).attr("data-slick-index", e)
      }), s.$slidesCache = s.$slides, s.reinit()
  }, e.prototype.animateHeight = function() {
      var i = this;
      if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
          var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
          i.$list.animate({
              height: e
          }, i.options.speed)
      }
  }, e.prototype.animateSlide = function(e, t) {
      var o = {},
          s = this;
      s.animateHeight(), !0 === s.options.rtl && !1 === s.options.vertical && (e = -e), !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({
          left: e
      }, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({
          top: e
      }, s.options.speed, s.options.easing, t) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft), i({
          animStart: s.currentLeft
      }).animate({
          animStart: e
      }, {
          duration: s.options.speed,
          easing: s.options.easing,
          step: function(i) {
              i = Math.ceil(i), !1 === s.options.vertical ? (o[s.animType] = "translate(" + i + "px, 0px)", s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)", s.$slideTrack.css(o))
          },
          complete: function() {
              t && t.call()
          }
      })) : (s.applyTransition(), e = Math.ceil(e), !1 === s.options.vertical ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)", s.$slideTrack.css(o), t && setTimeout(function() {
          s.disableTransition(), t.call()
      }, s.options.speed))
  }, e.prototype.getNavTarget = function() {
      var e = this,
          t = e.options.asNavFor;
      return t && null !== t && (t = i(t).not(e.$slider)), t
  }, e.prototype.asNavFor = function(e) {
      var t = this.getNavTarget();
      null !== t && "object" == typeof t && t.each(function() {
          var t = i(this).slick("getSlick");
          t.unslicked || t.slideHandler(e, !0)
      })
  }, e.prototype.applyTransition = function(i) {
      var e = this,
          t = {};
      !1 === e.options.fade ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase, !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
  }, e.prototype.autoPlay = function() {
      var i = this;
      i.autoPlayClear(), i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed))
  }, e.prototype.autoPlayClear = function() {
      var i = this;
      i.autoPlayTimer && clearInterval(i.autoPlayTimer)
  }, e.prototype.autoPlayIterator = function() {
      var i = this,
          e = i.currentSlide + i.options.slidesToScroll;
      i.paused || i.interrupted || i.focussed || (!1 === i.options.infinite && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll, i.currentSlide - 1 == 0 && (i.direction = 1))), i.slideHandler(e))
  }, e.prototype.buildArrows = function() {
      var e = this;
      !0 === e.options.arrows && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
          "aria-disabled": "true",
          tabindex: "-1"
      }))
  }, e.prototype.buildDots = function() {
      var e, t, o = this;
      if (!0 === o.options.dots) {
          for (o.$slider.addClass("slick-dotted"), t = i("<ul />").addClass(o.options.dotsClass), e = 0; e <= o.getDotCount(); e += 1) t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
          o.$dots = t.appendTo(o.options.appendDots), o.$dots.find("li").first().addClass("slick-active")
      }
  }, e.prototype.buildOut = function() {
      var e = this;
      e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function(e, t) {
          i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "")
      }), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1), i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), !0 === e.options.draggable && e.$list.addClass("draggable")
  }, e.prototype.buildRows = function() {
      var i, e, t, o, s, n, r, l = this;
      if (o = document.createDocumentFragment(), n = l.$slider.children(), l.options.rows > 1) {
          for (r = l.options.slidesPerRow * l.options.rows, s = Math.ceil(n.length / r), i = 0; i < s; i++) {
              var d = document.createElement("div");
              for (e = 0; e < l.options.rows; e++) {
                  var a = document.createElement("div");
                  for (t = 0; t < l.options.slidesPerRow; t++) {
                      var c = i * r + (e * l.options.slidesPerRow + t);
                      n.get(c) && a.appendChild(n.get(c))
                  }
                  d.appendChild(a)
              }
              o.appendChild(d)
          }
          l.$slider.empty().append(o), l.$slider.children().children().children().css({
              width: 100 / l.options.slidesPerRow + "%",
              display: "inline-block"
          })
      }
  }, e.prototype.checkResponsive = function(e, t) {
      var o, s, n, r = this,
          l = !1,
          d = r.$slider.width(),
          a = window.innerWidth || i(window).width();
      if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
          s = null;
          for (o in r.breakpoints) r.breakpoints.hasOwnProperty(o) && (!1 === r.originalSettings.mobileFirst ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
          null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, r.options = r.originalSettings, !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e), l = s), e || !1 === l || r.$slider.trigger("breakpoint", [r, l])
      }
  }, e.prototype.changeSlide = function(e, t) {
      var o, s, n, r = this,
          l = i(e.currentTarget);
      switch (l.is("a") && e.preventDefault(), l.is("li") || (l = l.closest("li")), n = r.slideCount % r.options.slidesToScroll != 0, o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll, e.data.message) {
          case "previous":
              s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
              break;
          case "next":
              s = 0 === o ? r.options.slidesToScroll : o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
              break;
          case "index":
              var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
              r.slideHandler(r.checkNavigable(d), !1, t), l.children().trigger("focus");
              break;
          default:
              return
      }
  }, e.prototype.checkNavigable = function(i) {
      var e, t;
      if (e = this.getNavigableIndexes(), t = 0, i > e[e.length - 1]) i = e[e.length - 1];
      else
          for (var o in e) {
              if (i < e[o]) {
                  i = t;
                  break
              }
              t = e[o]
          }
      return i
  }, e.prototype.cleanUpEvents = function() {
      var e = this;
      e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)), !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), i(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().off("click.slick", e.selectHandler), i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), i(window).off("resize.slick.slick-" + e.instanceUid, e.resize), i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition)
  }, e.prototype.cleanUpSlideEvents = function() {
      var e = this;
      e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1))
  }, e.prototype.cleanUpRows = function() {
      var i, e = this;
      e.options.rows > 1 && ((i = e.$slides.children().children()).removeAttr("style"), e.$slider.empty().append(i))
  }, e.prototype.clickHandler = function(i) {
      !1 === this.shouldClick && (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault())
  }, e.prototype.destroy = function(e) {
      var t = this;
      t.autoPlayClear(), t.touchObject = {}, t.cleanUpEvents(), i(".slick-cloned", t.$slider).detach(), t.$dots && t.$dots.remove(), t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()), t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()), t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
          i(this).attr("style", i(this).data("originalStyling"))
      }), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), t.$list.detach(), t.$slider.append(t.$slides)), t.cleanUpRows(), t.$slider.removeClass("slick-slider"), t.$slider.removeClass("slick-initialized"), t.$slider.removeClass("slick-dotted"), t.unslicked = !0, e || t.$slider.trigger("destroy", [t])
  }, e.prototype.disableTransition = function(i) {
      var e = this,
          t = {};
      t[e.transitionType] = "", !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
  }, e.prototype.fadeSlide = function(i, e) {
      var t = this;
      !1 === t.cssTransitions ? (t.$slides.eq(i).css({
          zIndex: t.options.zIndex
      }), t.$slides.eq(i).animate({
          opacity: 1
      }, t.options.speed, t.options.easing, e)) : (t.applyTransition(i), t.$slides.eq(i).css({
          opacity: 1,
          zIndex: t.options.zIndex
      }), e && setTimeout(function() {
          t.disableTransition(i), e.call()
      }, t.options.speed))
  }, e.prototype.fadeSlideOut = function(i) {
      var e = this;
      !1 === e.cssTransitions ? e.$slides.eq(i).animate({
          opacity: 0,
          zIndex: e.options.zIndex - 2
      }, e.options.speed, e.options.easing) : (e.applyTransition(i), e.$slides.eq(i).css({
          opacity: 0,
          zIndex: e.options.zIndex - 2
      }))
  }, e.prototype.filterSlides = e.prototype.slickFilter = function(i) {
      var e = this;
      null !== i && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.filter(i).appendTo(e.$slideTrack), e.reinit())
  }, e.prototype.focusHandler = function() {
      var e = this;
      e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function(t) {
          t.stopImmediatePropagation();
          var o = i(this);
          setTimeout(function() {
              e.options.pauseOnFocus && (e.focussed = o.is(":focus"), e.autoPlay())
          }, 0)
      })
  }, e.prototype.getCurrent = e.prototype.slickCurrentSlide = function() {
      return this.currentSlide
  }, e.prototype.getDotCount = function() {
      var i = this,
          e = 0,
          t = 0,
          o = 0;
      if (!0 === i.options.infinite)
          if (i.slideCount <= i.options.slidesToShow) ++o;
          else
              for (; e < i.slideCount;) ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
      else if (!0 === i.options.centerMode) o = i.slideCount;
      else if (i.options.asNavFor)
          for (; e < i.slideCount;) ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
      else o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
      return o - 1
  }, e.prototype.getLeft = function(i) {
      var e, t, o, s, n = this,
          r = 0;
      return n.slideOffset = 0, t = n.$slides.first().outerHeight(!0), !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1, s = -1, !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)), r = t * n.options.slidesToShow * s), n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1, r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1, r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth, r = (i + n.options.slidesToShow - n.slideCount) * t), n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0, r = 0), !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0, n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)), e = !1 === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r, !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, e += (n.$list.width() - o.outerWidth()) / 2)), e
  }, e.prototype.getOption = e.prototype.slickGetOption = function(i) {
      return this.options[i]
  }, e.prototype.getNavigableIndexes = function() {
      var i, e = this,
          t = 0,
          o = 0,
          s = [];
      for (!1 === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll, o = -1 * e.options.slidesToScroll, i = 2 * e.slideCount); t < i;) s.push(t), t = o + e.options.slidesToScroll, o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
      return s
  }, e.prototype.getSlick = function() {
      return this
  }, e.prototype.getSlideCount = function() {
      var e, t, o = this;
      return t = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0, !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each(function(s, n) {
          if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft) return e = n, !1
      }), Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll
  }, e.prototype.goTo = e.prototype.slickGoTo = function(i, e) {
      this.changeSlide({
          data: {
              message: "index",
              index: parseInt(i)
          }
      }, e)
  }, e.prototype.init = function(e) {
      var t = this;
      i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"), t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()), e && t.$slider.trigger("init", [t]), !0 === t.options.accessibility && t.initADA(), t.options.autoplay && (t.paused = !1, t.autoPlay())
  }, e.prototype.initADA = function() {
      var e = this,
          t = Math.ceil(e.slideCount / e.options.slidesToShow),
          o = e.getNavigableIndexes().filter(function(i) {
              return i >= 0 && i < e.slideCount
          });
      e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
          "aria-hidden": "true",
          tabindex: "-1"
      }).find("a, input, button, select").attr({
          tabindex: "-1"
      }), null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t) {
          var s = o.indexOf(t);
          i(this).attr({
              role: "tabpanel",
              id: "slick-slide" + e.instanceUid + t,
              tabindex: -1
          }), -1 !== s && i(this).attr({
              "aria-describedby": "slick-slide-control" + e.instanceUid + s
          })
      }), e.$dots.attr("role", "tablist").find("li").each(function(s) {
          var n = o[s];
          i(this).attr({
              role: "presentation"
          }), i(this).find("button").first().attr({
              role: "tab",
              id: "slick-slide-control" + e.instanceUid + s,
              "aria-controls": "slick-slide" + e.instanceUid + n,
              "aria-label": s + 1 + " of " + t,
              "aria-selected": null,
              tabindex: "-1"
          })
      }).eq(e.currentSlide).find("button").attr({
          "aria-selected": "true",
          tabindex: "0"
      }).end());
      for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++) e.$slides.eq(s).attr("tabindex", 0);
      e.activateADA()
  }, e.prototype.initArrowEvents = function() {
      var i = this;
      !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {
          message: "previous"
      }, i.changeSlide), i.$nextArrow.off("click.slick").on("click.slick", {
          message: "next"
      }, i.changeSlide), !0 === i.options.accessibility && (i.$prevArrow.on("keydown.slick", i.keyHandler), i.$nextArrow.on("keydown.slick", i.keyHandler)))
  }, e.prototype.initDotEvents = function() {
      var e = this;
      !0 === e.options.dots && (i("li", e.$dots).on("click.slick", {
          message: "index"
      }, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)), !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1))
  }, e.prototype.initSlideEvents = function() {
      var e = this;
      e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)))
  }, e.prototype.initializeEvents = function() {
      var e = this;
      e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {
          action: "start"
      }, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {
          action: "move"
      }, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {
          action: "end"
      }, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {
          action: "end"
      }, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), i(document).on(e.visibilityChange, i.proxy(e.visibility, e)), !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)), i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)), i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), i(e.setPosition)
  }, e.prototype.initUI = function() {
      var i = this;
      !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(), i.$nextArrow.show()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.show()
  }, e.prototype.keyHandler = function(i) {
      var e = this;
      i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && !0 === e.options.accessibility ? e.changeSlide({
          data: {
              message: !0 === e.options.rtl ? "next" : "previous"
          }
      }) : 39 === i.keyCode && !0 === e.options.accessibility && e.changeSlide({
          data: {
              message: !0 === e.options.rtl ? "previous" : "next"
          }
      }))
  }, e.prototype.lazyLoad = function() {
      function e(e) {
          i("img[data-lazy]", e).each(function() {
              var e = i(this),
                  t = i(this).attr("data-lazy"),
                  o = i(this).attr("data-srcset"),
                  s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"),
                  r = document.createElement("img");
              r.onload = function() {
                  e.animate({
                      opacity: 0
                  }, 100, function() {
                      o && (e.attr("srcset", o), s && e.attr("sizes", s)), e.attr("src", t).animate({
                          opacity: 1
                      }, 200, function() {
                          e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                      }), n.$slider.trigger("lazyLoaded", [n, e, t])
                  })
              }, r.onerror = function() {
                  e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), n.$slider.trigger("lazyLoadError", [n, e, t])
              }, r.src = t
          })
      }
      var t, o, s, n = this;
      if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)), s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide, s = Math.ceil(o + n.options.slidesToShow), !0 === n.options.fade && (o > 0 && o--, s <= n.slideCount && s++)), t = n.$slider.find(".slick-slide").slice(o, s), "anticipated" === n.options.lazyLoad)
          for (var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0; a < n.options.slidesToScroll; a++) r < 0 && (r = n.slideCount - 1), t = (t = t.add(d.eq(r))).add(d.eq(l)), r--, l++;
      e(t), n.slideCount <= n.options.slidesToShow ? e(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow))
  }, e.prototype.loadSlider = function() {
      var i = this;
      i.setPosition(), i.$slideTrack.css({
          opacity: 1
      }), i.$slider.removeClass("slick-loading"), i.initUI(), "progressive" === i.options.lazyLoad && i.progressiveLazyLoad()
  }, e.prototype.next = e.prototype.slickNext = function() {
      this.changeSlide({
          data: {
              message: "next"
          }
      })
  }, e.prototype.orientationChange = function() {
      var i = this;
      i.checkResponsive(), i.setPosition()
  }, e.prototype.pause = e.prototype.slickPause = function() {
      var i = this;
      i.autoPlayClear(), i.paused = !0
  }, e.prototype.play = e.prototype.slickPlay = function() {
      var i = this;
      i.autoPlay(), i.options.autoplay = !0, i.paused = !1, i.focussed = !1, i.interrupted = !1
  }, e.prototype.postSlide = function(e) {
      var t = this;
      t.unslicked || (t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), t.swipeLeft = null, t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(), t.options.focusOnChange && i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()))
  }, e.prototype.prev = e.prototype.slickPrev = function() {
      this.changeSlide({
          data: {
              message: "previous"
          }
      })
  }, e.prototype.preventDefault = function(i) {
      i.preventDefault()
  }, e.prototype.progressiveLazyLoad = function(e) {
      e = e || 1;
      var t, o, s, n, r, l = this,
          d = i("img[data-lazy]", l.$slider);
      d.length ? (t = d.first(), o = t.attr("data-lazy"), s = t.attr("data-srcset"), n = t.attr("data-sizes") || l.$slider.attr("data-sizes"), (r = document.createElement("img")).onload = function() {
          s && (t.attr("srcset", s), n && t.attr("sizes", n)), t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === l.options.adaptiveHeight && l.setPosition(), l.$slider.trigger("lazyLoaded", [l, t, o]), l.progressiveLazyLoad()
      }, r.onerror = function() {
          e < 3 ? setTimeout(function() {
              l.progressiveLazyLoad(e + 1)
          }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), l.$slider.trigger("lazyLoadError", [l, t, o]), l.progressiveLazyLoad())
      }, r.src = o) : l.$slider.trigger("allImagesLoaded", [l])
  }, e.prototype.refresh = function(e) {
      var t, o, s = this;
      o = s.slideCount - s.options.slidesToShow, !s.options.infinite && s.currentSlide > o && (s.currentSlide = o), s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0), t = s.currentSlide, s.destroy(!0), i.extend(s, s.initials, {
          currentSlide: t
      }), s.init(), e || s.changeSlide({
          data: {
              message: "index",
              index: t
          }
      }, !1)
  }, e.prototype.registerBreakpoints = function() {
      var e, t, o, s = this,
          n = s.options.responsive || null;
      if ("array" === i.type(n) && n.length) {
          s.respondTo = s.options.respondTo || "window";
          for (e in n)
              if (o = s.breakpoints.length - 1, n.hasOwnProperty(e)) {
                  for (t = n[e].breakpoint; o >= 0;) s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1), o--;
                  s.breakpoints.push(t), s.breakpointSettings[t] = n[e].settings
              } s.breakpoints.sort(function(i, e) {
              return s.options.mobileFirst ? i - e : e - i
          })
      }
  }, e.prototype.reinit = function() {
      var e = this;
      e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e])
  }, e.prototype.resize = function() {
      var e = this;
      i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function() {
          e.windowWidth = i(window).width(), e.checkResponsive(), e.unslicked || e.setPosition()
      }, 50))
  }, e.prototype.removeSlide = e.prototype.slickRemove = function(i, e, t) {
      var o = this;
      if (i = "boolean" == typeof i ? !0 === (e = i) ? 0 : o.slideCount - 1 : !0 === e ? --i : i, o.slideCount < 1 || i < 0 || i > o.slideCount - 1) return !1;
      o.unload(), !0 === t ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slidesCache = o.$slides, o.reinit()
  }, e.prototype.setCSS = function(i) {
      var e, t, o = this,
          s = {};
      !0 === o.options.rtl && (i = -i), e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px", t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px", s[o.positionProp] = i, !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {}, !1 === o.cssTransitions ? (s[o.animType] = "translate(" + e + ", " + t + ")", o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)", o.$slideTrack.css(s)))
  }, e.prototype.setDimensions = function() {
      var i = this;
      !1 === i.options.vertical ? !0 === i.options.centerMode && i.$list.css({
          padding: "0px " + i.options.centerPadding
      }) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow), !0 === i.options.centerMode && i.$list.css({
          padding: i.options.centerPadding + " 0px"
      })), i.listWidth = i.$list.width(), i.listHeight = i.$list.height(), !1 === i.options.vertical && !1 === i.options.variableWidth ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow), i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : !0 === i.options.variableWidth ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth), i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
      var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
      !1 === i.options.variableWidth && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e)
  }, e.prototype.setFade = function() {
      var e, t = this;
      t.$slides.each(function(o, s) {
          e = t.slideWidth * o * -1, !0 === t.options.rtl ? i(s).css({
              position: "relative",
              right: e,
              top: 0,
              zIndex: t.options.zIndex - 2,
              opacity: 0
          }) : i(s).css({
              position: "relative",
              left: e,
              top: 0,
              zIndex: t.options.zIndex - 2,
              opacity: 0
          })
      }), t.$slides.eq(t.currentSlide).css({
          zIndex: t.options.zIndex - 1,
          opacity: 1
      })
  }, e.prototype.setHeight = function() {
      var i = this;
      if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
          var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
          i.$list.css("height", e)
      }
  }, e.prototype.setOption = e.prototype.slickSetOption = function() {
      var e, t, o, s, n, r = this,
          l = !1;
      if ("object" === i.type(arguments[0]) ? (o = arguments[0], l = arguments[1], n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0], s = arguments[1], l = arguments[2], "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")), "single" === n) r.options[o] = s;
      else if ("multiple" === n) i.each(o, function(i, e) {
          r.options[i] = e
      });
      else if ("responsive" === n)
          for (t in s)
              if ("array" !== i.type(r.options.responsive)) r.options.responsive = [s[t]];
              else {
                  for (e = r.options.responsive.length - 1; e >= 0;) r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1), e--;
                  r.options.responsive.push(s[t])
              } l && (r.unload(), r.reinit())
  }, e.prototype.setPosition = function() {
      var i = this;
      i.setDimensions(), i.setHeight(), !1 === i.options.fade ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(), i.$slider.trigger("setPosition", [i])
  }, e.prototype.setProps = function() {
      var i = this,
          e = document.body.style;
      i.positionProp = !0 === i.options.vertical ? "top" : "left", "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"), void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || !0 === i.options.useCSS && (i.cssTransitions = !0), i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex), void 0 !== e.OTransform && (i.animType = "OTransform", i.transformType = "-o-transform", i.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.MozTransform && (i.animType = "MozTransform", i.transformType = "-moz-transform", i.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)), void 0 !== e.webkitTransform && (i.animType = "webkitTransform", i.transformType = "-webkit-transform", i.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.msTransform && (i.animType = "msTransform", i.transformType = "-ms-transform", i.transitionType = "msTransition", void 0 === e.msTransform && (i.animType = !1)), void 0 !== e.transform && !1 !== i.animType && (i.animType = "transform", i.transformType = "transform", i.transitionType = "transition"), i.transformsEnabled = i.options.useTransform && null !== i.animType && !1 !== i.animType
  }, e.prototype.setSlideClasses = function(i) {
      var e, t, o, s, n = this;
      if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), n.$slides.eq(i).addClass("slick-current"), !0 === n.options.centerMode) {
          var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
          e = Math.floor(n.options.slidesToShow / 2), !0 === n.options.infinite && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i, t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")), n.$slides.eq(i).addClass("slick-center")
      } else i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow, o = !0 === n.options.infinite ? n.options.slidesToShow + i : i, n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
      "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad()
  }, e.prototype.setupInfinite = function() {
      var e, t, o, s = this;
      if (!0 === s.options.fade && (s.options.centerMode = !1), !0 === s.options.infinite && !1 === s.options.fade && (t = null, s.slideCount > s.options.slidesToShow)) {
          for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow, e = s.slideCount; e > s.slideCount - o; e -= 1) t = e - 1, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
          for (e = 0; e < o + s.slideCount; e += 1) t = e, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
          s.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
              i(this).attr("id", "")
          })
      }
  }, e.prototype.interrupt = function(i) {
      var e = this;
      i || e.autoPlay(), e.interrupted = i
  }, e.prototype.selectHandler = function(e) {
      var t = this,
          o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide"),
          s = parseInt(o.attr("data-slick-index"));
      s || (s = 0), t.slideCount <= t.options.slidesToShow ? t.slideHandler(s, !1, !0) : t.slideHandler(s)
  }, e.prototype.slideHandler = function(i, e, t) {
      var o, s, n, r, l, d = null,
          a = this;
      if (e = e || !1, !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === i))
          if (!1 === e && a.asNavFor(i), o = i, d = a.getLeft(o), r = a.getLeft(a.currentSlide), a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft, !1 === a.options.infinite && !1 === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, !0 !== t ? a.animateSlide(r, function() {
              a.postSlide(o)
          }) : a.postSlide(o));
          else if (!1 === a.options.infinite && !0 === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, !0 !== t ? a.animateSlide(r, function() {
          a.postSlide(o)
      }) : a.postSlide(o));
      else {
          if (a.options.autoplay && clearInterval(a.autoPlayTimer), s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o, a.animating = !0, a.$slider.trigger("beforeChange", [a, a.currentSlide, s]), n = a.currentSlide, a.currentSlide = s, a.setSlideClasses(a.currentSlide), a.options.asNavFor && (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide), a.updateDots(), a.updateArrows(), !0 === a.options.fade) return !0 !== t ? (a.fadeSlideOut(n), a.fadeSlide(s, function() {
              a.postSlide(s)
          })) : a.postSlide(s), void a.animateHeight();
          !0 !== t ? a.animateSlide(d, function() {
              a.postSlide(s)
          }) : a.postSlide(s)
      }
  }, e.prototype.startLoad = function() {
      var i = this;
      !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(), i.$nextArrow.hide()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.hide(), i.$slider.addClass("slick-loading")
  }, e.prototype.swipeDirection = function() {
      var i, e, t, o, s = this;
      return i = s.touchObject.startX - s.touchObject.curX, e = s.touchObject.startY - s.touchObject.curY, t = Math.atan2(e, i), (o = Math.round(180 * t / Math.PI)) < 0 && (o = 360 - Math.abs(o)), o <= 45 && o >= 0 ? !1 === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical"
  }, e.prototype.swipeEnd = function(i) {
      var e, t, o = this;
      if (o.dragging = !1, o.swiping = !1, o.scrolling) return o.scrolling = !1, !1;
      if (o.interrupted = !1, o.shouldClick = !(o.touchObject.swipeLength > 10), void 0 === o.touchObject.curX) return !1;
      if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]), o.touchObject.swipeLength >= o.touchObject.minSwipe) {
          switch (t = o.swipeDirection()) {
              case "left":
              case "down":
                  e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(), o.currentDirection = 0;
                  break;
              case "right":
              case "up":
                  e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(), o.currentDirection = 1
          }
          "vertical" != t && (o.slideHandler(e), o.touchObject = {}, o.$slider.trigger("swipe", [o, t]))
      } else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), o.touchObject = {})
  }, e.prototype.swipeHandler = function(i) {
      var e = this;
      if (!(!1 === e.options.swipe || "ontouchend" in document && !1 === e.options.swipe || !1 === e.options.draggable && -1 !== i.type.indexOf("mouse"))) switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1, e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, !0 === e.options.verticalSwiping && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold), i.data.action) {
          case "start":
              e.swipeStart(i);
              break;
          case "move":
              e.swipeMove(i);
              break;
          case "end":
              e.swipeEnd(i)
      }
  }, e.prototype.swipeMove = function(i) {
      var e, t, o, s, n, r, l = this;
      return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null, !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide), l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX, l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY, l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))), r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))), !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0, !1) : (!0 === l.options.verticalSwiping && (l.touchObject.swipeLength = r), t = l.swipeDirection(), void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0, i.preventDefault()), s = (!1 === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1), !0 === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1), o = l.touchObject.swipeLength, l.touchObject.edgeHit = !1, !1 === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction, l.touchObject.edgeHit = !0), !1 === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s, !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s), !0 !== l.options.fade && !1 !== l.options.touchMove && (!0 === l.animating ? (l.swipeLeft = null, !1) : void l.setCSS(l.swipeLeft))))
  }, e.prototype.swipeStart = function(i) {
      var e, t = this;
      if (t.interrupted = !0, 1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow) return t.touchObject = {}, !1;
      void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]), t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX, t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY, t.dragging = !0
  }, e.prototype.unfilterSlides = e.prototype.slickUnfilter = function() {
      var i = this;
      null !== i.$slidesCache && (i.unload(), i.$slideTrack.children(this.options.slide).detach(), i.$slidesCache.appendTo(i.$slideTrack), i.reinit())
  }, e.prototype.unload = function() {
      var e = this;
      i(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
  }, e.prototype.unslick = function(i) {
      var e = this;
      e.$slider.trigger("unslick", [e, i]), e.destroy()
  }, e.prototype.updateArrows = function() {
      var i = this;
      Math.floor(i.options.slidesToShow / 2), !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite && (i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === i.currentSlide ? (i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - i.options.slidesToShow && !1 === i.options.centerMode ? (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - 1 && !0 === i.options.centerMode && (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
  }, e.prototype.updateDots = function() {
      var i = this;
      null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(), i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"))
  }, e.prototype.visibility = function() {
      var i = this;
      i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1)
  }, i.fn.slick = function() {
      var i, t, o = this,
          s = arguments[0],
          n = Array.prototype.slice.call(arguments, 1),
          r = o.length;
      for (i = 0; i < r; i++)
          if ("object" == typeof s || void 0 === s ? o[i].slick = new e(o[i], s) : t = o[i].slick[s].apply(o[i].slick, n), void 0 !== t) return t;
      return o
  }
});

// слайдер для extra
var addSlider = function () {
  $(document).ready(function () {
    $('.extra__list').slick({
      dots: true,
      arrows: false,
      slidesToShow: 1,
      speed: 500}
    );
  });
};

var removeSlider = function () {
  $('.extra__list').slick('unslick');
};

var setSlider = function () {
  var windowSize = document.body.clientWidth;
  var elem = document.querySelector('.slick-dots');
  if (!elem) {
    if (windowSize < 768) {
      addSlider();
    } else {
      return;
    }
  } else {
    if (windowSize > 768) {
      removeSlider(elem);
    } else {
      return;
    }
  }
};

setSlider();
window.addEventListener('resize', setSlider);


// слайдер для reviews
$('.reviews__slider-next').on('click', function () {
  $('.slider-reviews').slick('slickNext');
});

$('.reviews__slider-prev').on('click', function () {
  $('.slider-reviews').slick('slickPrev');
});


var $status = $('.reviews__slider-number');
var $slickElement = $('.slider-reviews');

$slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
  //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
  var i = (currentSlide ? currentSlide : 0) + 1;
  $status.text(i + ' / ' + slick.slideCount);
})

var addSliderReviews = function () {
  $(document).ready(function () {
    $('.slider-reviews').slick({
      dots: false,
      arrows: false,
      slidesToShow: 1,
    });
  });
};

addSliderReviews();

// forEach for IE11
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}
