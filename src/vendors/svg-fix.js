/**
 * Adds classList support for SVGElements if needed.
 *
 * This file should be loaded before token-list.js, although it isn't reliant on it.
 */
(function(){
	"use strict";
	
	var W3                 = "http://www.w3.org/";
	var NS_SVG             = W3 + "2000/svg";
	var NS_HTML            = W3 + "1999/xhtml";
	var CORKED             = "__CORKED";
	var CREATE_ELEMENT     = "createElement";
	var CREATE_ELEMENT_NS  = CREATE_ELEMENT + "NS";
	var DIV                = "div";
	var CLASS_             = "class";
	var CLASS_LIST         = CLASS_ + "List";
	var SET_ATTR           = "setAttribute";
	
	var WIN                = window;
	var DOC                = document;
	var SVG                = WIN.SVGElement;

	
	var mirror, reflections;
	var div, createElement;
	
	/** No classList support in SVG elements */
	if(SVG && !(CLASS_LIST in DOC[CREATE_ELEMENT_NS](NS_SVG, "g"))){
		
		/** Stop IE10-11 choking on token-list.js when running it from inside an SVG document */
		div = DOC[CREATE_ELEMENT](DIV);
		if(null === div.namespaceURI && !div.classList){
			createElement = DOC[CREATE_ELEMENT];
			DOC[CREATE_ELEMENT] = function(name){
				if(DIV === (name || "").toLowerCase())
					return DOC[CREATE_ELEMENT_NS](NS_HTML, name);
				return createElement.apply(DOC, arguments);
			};
		}
		
		
		Object.defineProperty(SVG.prototype, CLASS_LIST, {
			get: function(){
				var THIS = this;
				
				/** This is the first time we're accessing an SVG element's classes */
				if(!mirror){
					mirror      = DOC[CREATE_ELEMENT_NS](NS_HTML, DIV);
					reflections = mirror.children;
					
					/** Set a listener to respond to changes in the reflection's classes list */
					mirror.addEventListener("DOMAttrModified", function(e){
						var target    = e.target;
						var reflected = target.__R;
						
						/** Update the SVG element's class attribute */
						if(CLASS_ === e.attrName && reflected){
							reflected[CORKED] = true;
							reflected[SET_ATTR](CLASS_, target.className);
							delete reflected[CORKED];
						}
					});
				}
				
				/** Locate this element's reflection */
				for(var visage, i = 0, l = reflections.length; i < l; ++i){
					visage = reflections[i];
					if(visage.__R === THIS) break;
					else visage = 0;
				}
				
				/** No reflection found. Materialise one. */
				if(!visage){
					visage = DOC[CREATE_ELEMENT_NS](NS_HTML, DIV);
					visage.className = THIS.getAttribute(CLASS_);
					mirror.appendChild(visage);
					visage.__R = THIS;
					
					/** Can't be too careful */
					var setAttr = THIS[SET_ATTR];
					THIS[SET_ATTR] = function(name, value){
						if(CLASS_ === name && !THIS[CORKED])
							visage.className = value;
						setAttr.call(THIS, name, value);
					};
				}
				
				return visage.classList;
			}
		});
	}
}());
