/**
 * Adds support to IE8 for the following properties:
 *
 *     Element.childElementCount
 *     Element.firstElementChild
 *     Element.lastElementChild
 *     Element.nextElementSibling
 *     Element.previousElementSibling
 */
(function(){
	"use strict";
	
	
	var patches = {
		
		firstElementChild: function(){
			for(var nodes = this.children, n, i = 0, l = nodes.length; i < l; ++i)
				if(n = nodes[i], 1 === n.nodeType) return n;
			return null;
		},
		
		lastElementChild: function(){
			for(var nodes = this.children, n, i = nodes.length - 1; i >= 0; --i)
				if(n = nodes[i], 1 === n.nodeType) return n;
			return null;
		},
		
		nextElementSibling: function(){
			var e = this.nextSibling;
			while(e && 1 !== e.nodeType)
				e = e.nextSibling;
			return e;
		},
		
		previousElementSibling: function(){
			var e = this.previousSibling;
			while(e && 1 !== e.nodeType)
				e = e.previousSibling;
			return e;
		},
		
		childElementCount: function(){
			for(var c = 0, nodes = this.children, n, i = 0, l = nodes.length; i < l; ++i)
				(n = nodes[i], 1 === n.nodeType) && ++c;
			return c;
		}
	};
	
	for(var i in patches)
		i in document.documentElement ||
		Object.defineProperty(Element.prototype, i, {get: patches[i]});
}());


/** window.pageXOffset / window.pageYOffset */
if(!("pageXOffset" in window)) (function(){
	var x = function(){ return (document.documentElement || document.body.parentNode || document.body).scrollLeft; };
	var y = function(){ return (document.documentElement || document.body.parentNode || document.body).scrollTop;  };
	Object.defineProperty(window, "pageXOffset", {get: x});
	Object.defineProperty(window, "pageYOffset", {get: y});
	Object.defineProperty(window, "scrollX",     {get: x});
	Object.defineProperty(window, "scrollY",     {get: y});
}());

/** window.innerWidth / window.innerHeight */
if(!("innerWidth" in window)){
	Object.defineProperty(window, "innerWidth",  {get: function(){ return (document.documentElement || document.body.parentNode || document.body).clientWidth; }});
	Object.defineProperty(window, "innerHeight", {get: function(){ return (document.documentElement || document.body.parentNode || document.body).clientHeight; }});
}

/** event.pageX / event.pageY */
if(!window.MouseEvent && !("pageX" in Event.prototype)){
	Object.defineProperty(Event.prototype, "pageX", {get: function(){ return this.clientX + window.pageXOffset; }});
	Object.defineProperty(Event.prototype, "pageY", {get: function(){ return this.clientY + window.pageYOffset; }});
}


(function(){
	"use strict";
	
	if(!("textContent" in Element.prototype)){
		var interfaces = "Element Text HTMLDocument HTMLCommentElement".split(" ");
		var haveText   = {3:1, 8:1, 4:1, 7:1};
		var haveNull   = {9:1, 10:1, 12:1};
		var srcTags    = {SCRIPT:1, STYLE:1};
		for(var I, i = 0; i < 4; ++i){
			I = window[interfaces[i]];
			I && Object.defineProperty(I.prototype, "textContent", {
				get: function(){ return getText(this); },
				set: function(input){
					var type = this.nodeType;
					
					/** Text nodes: set nodeValue */
					if(haveText[type])
						this.nodeValue = input;
					
					/** For everything that isn't a document, DOCTYPE or notation */
					else if(!haveNull[type]){
						var name = this.nodeName;
						
						/** IE8 throws a runtime error trying to set the innerHTML of a <style> element */
						if("STYLE" === name)
							this.styleSheet.cssText = input;
						
						/** Scripts have a similar issue */
						else if(srcTags[name])
							this.text = input;
						
						else this.innerText = input;
					}
				},
			});
		}
		
		
		function getText(node){
			var type = node.nodeType;
			
			/** Return `nodeValue` if input is a text node, comment, CDATA section, or processing instruction */
			if(haveText[type])
				return node.nodeValue;
			
			/** Return null for documents, DOCTYPE declarations, and notations */
			if(haveNull[type])
				return null;
			
			/** Use the innerHTML property of <script> and <style> tags */
			var name = node.nodeName;
			if(name && srcTags[name])
				return node.innerHTML;
			
			
			/** Everything else: Concatenate the textContent of each child node, except comments and processing instructions */
			var result   = "";
			var children = node.childNodes;
			for(var i = 0, l = children.length; i < l; ++i){
				var child = children[i];
				if(child.nodeType !== 7 && child.nodeType !== 8)
					result += child.textContent;
			}
			
			return result;
		}
	}	
}());


window.getComputedStyle = window.getComputedStyle || function(el){
	if(!el) return null;
	
	/**
	 * currentStyle returns an instance of a non-standard class called "CSSCurrentStyleDeclaration"
	 * instead of "CSSStyleDeclaration", which has a few methods and properties missing (such as cssText).
	 * https://msdn.microsoft.com/en-us/library/cc848941(v=vs.85).aspx
	 *
	 * Instead of returning the currentStyle value directly, we'll copy its properties to the style
	 * of a shadow element. This ensures cssText is included, and ensures the result is an instance of
	 * the correct DOM interface.
	 *
	 * There'll still be some minor discrepancies in the style values. For example, IE preserves the way
	 * colour values were authored, whereas standards-compliant browsers will expand colours to use "rgb()"
	 * notation. We won't bother to fix things like these, as they'd involve too much fiddling for little
	 * gain.
	 */
	
	var style   = el.currentStyle;
	var box     = el.getBoundingClientRect();
	var shadow  = document.createElement("div");
	var output  = shadow.style;
	for(var i in style)
		output[i] = style[i];
	
	/** Fix some glitches */
	output.cssFloat = output.styleFloat;
	if("auto" === output.width)  output.width  = (box.right - box.left) + "px";
	if("auto" === output.height) output.height = (box.bottom - box.top) + "px";
	return output;
};


/**
 * IE8 preventDefault
 *
 *https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener?redirectlocale=en-US&redirectslug=DOM%2FEventTarget.addEventListener#Compatibility
 *
 */
(function() {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault=function() {
      this.returnValue=false;
    };
  }
})();

/**
 * IE8 stopPropagation
 *
 *https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener?redirectlocale=en-US&redirectslug=DOM%2FEventTarget.addEventListener#Compatibility
 *
 */
(function() {
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation=function() {
      this.cancelBubble=true;
    };
  }
})();

/**
 * IE8 
 * addEventListener
 * removeEventListener
 *
 *https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener?redirectlocale=en-US&redirectslug=DOM%2FEventTarget.addEventListener#Compatibility
 *
 */
(function() {
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];
    
    var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (typeof listener.handleEvent != 'undefined') {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
        
        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})();

/*!
 * NWMatcher 1.2.3 - Fast CSS3 Selector Engine
 * Copyright (C) 2007-2010 Diego Perini
 * See http://nwbox.com/license
 */
(function(s){var ct='nwmatcher-1.2.3',i=s.document,n=i.documentElement,M=Array.prototype.slice,bn='',B='',bo='',bp='',U=false,N=false,bq=i,br=i,V='[.:#]?',bL='([~*^$|!]?={1})',x='[\\x20\\t\\n\\r\\f]*',bM='[\\x20]|[>+~][^>+~]',bN='[-+]?\\d*n?[-+]?\\d*',W='"[^"]*"'+"|'[^']*'",p='(?:[-\\w]|[^\\x00-\\xa0]|\\\\.)+',C='(?:-?[_a-zA-Z]{1}[-\\w]*|[^\\x00-\\xa0]+|\\\\.+)+',F=x+'('+p+':?'+p+')'+x+'(?:'+bL+x+'('+W+'|'+C+'))?'+x,X='((?:'+bN+'|'+W+'|'+V+'|'+p+'|\\['+F+'\\]|\\(.+\\)|'+x+'|,)+)',bO='.+',Y='(?=\s*[^>+~(){}<>])(\\*|(?:'+V+C+')|'+bM+'|\\['+F+'\\]|\\('+X+'\\)|\\{'+bO+'\\}|,)+',O=new RegExp(Y,'g'),bP=Y.replace(X,'.*'),P=new RegExp('^'+x+'|'+x+'$','g'),bQ=new RegExp('^((?!:not)('+V+'|'+C+'|\\([^()]*\\))+|\\['+F+'\\])$'),bR='\\([^()]+\\)|\\(.*\\)',bS='\\{[^{}]+\\}|\\{.*\\}',bT='\\[[^[\\]]*\\]|\\[.*\\]',Z='\\[.*\\]|\\(.*\\)|\\{.*\\}',ba=new RegExp('([^(,)\\\\\\[\\]]+|\\[(?:'+bT+'|'+W+'|[^\\[\\]]+)+\\]|'+bR+'|'+bS+'|\\\\.)+','g'),bU=new RegExp('(\\('+X+'\\)|\\['+F+'\\]|[^\x20>+~]|\\\\.)+','g'),bs=new RegExp('('+C+')'),cu=new RegExp('#('+C+')'),bt=/[\x20\t\n\r\f]+/g,bV=/^\s*[>+~]{1}/,bW=/[>+~]{1}\s*$/,y=(function(){var k=(s.open+'').replace(/open/g,'');return function(b,a){var c=b?b[a]:false,f=new RegExp(a,'g');return!!(c&&typeof c!='string'&&k===(c+'').replace(f,''))}})(),G=function(c){return typeof c.compatMode=='string'?c.compatMode.indexOf('CSS')<0:(function(){var b=c.createElement('div'),a=b.style&&(b.style.width=1)&&b.style.width!='1px';b=null;return!a})()},Q='xmlVersion'in i?function(b){return!!b.xmlVersion||(/xml$/).test(b.contentType)||!(/html/i).test(b.documentElement.nodeName)}:function(b){return b.firstChild.nodeType==7&&(/xml/i).test(b.firstChild.nodeName)||!(/html/i).test(b.documentElement.nodeName)},H=G(i),o=Q(i),bX=y(i,'hasFocus'),bb=y(i,'querySelector'),bY=y(i,'getElementById'),bZ=y(n,'getElementsByTagName'),bu=y(n,'getElementsByClassName'),ca=y(n,'getAttribute'),cb=y(n,'hasAttribute'),bc=(function(){var b=false,a=n.id;n.id='length';try{b=!!M.call(i.childNodes,0)[0]}catch(e){}n.id=a;return b})(),bv='nextElementSibling'in n&&'previousElementSibling'in n,cc=bY?(function(){var b=true,a='x'+String(+new Date),c=i.createElementNS?'a':'<a name="'+a+'">';(c=i.createElement(c)).name=a;n.insertBefore(c,n.firstChild);b=!!i.getElementById(a);n.removeChild(c);c=null;return b})():true,bw=bZ?(function(){var b,a=i.createElement('div');a.appendChild(i.createComment(''));b=a.getElementsByTagName('*')[0];a.removeChild(a.firstChild);a=null;return!!b})():true,bx=bu?(function(){var b,a=i.createElement('div'),c='\u53f0\u5317';a.appendChild(i.createElement('span')).setAttribute('class',c+'abc '+c);a.appendChild(i.createElement('span')).setAttribute('class','x');b=!a.getElementsByClassName(c)[0];a.lastChild.className=c;if(!b)b=a.getElementsByClassName(c).length!==2;a.removeChild(a.firstChild);a.removeChild(a.firstChild);a=null;return b})():true,cd=ca?(function(){var b,a;(a=i.createElement('input')).setAttribute('value','5');return b=a.defaultValue!=5})():true,by=cb?(function(){var b,a=i.createElement('option');a.setAttribute('selected','selected');b=!a.hasAttribute('selected');return b})():true,ce=bb?(function(){var b=[],a=i.createElement('div'),c;a.appendChild(i.createElement('p')).setAttribute('class','xXx');a.appendChild(i.createElement('p')).setAttribute('class','xxx');if(G(i)&&(a.querySelectorAll('[class~=xxx]').length!=2||a.querySelectorAll('.xXx').length!=2)){b.push('(?:\\[[\\x20\\t\\n\\r\\f]*class\\b|\\.'+C+')')}a.removeChild(a.firstChild);a.removeChild(a.firstChild);a.appendChild(i.createElement('p')).setAttribute('class','');try{a.querySelectorAll('[class^=""]').length===1&&b.push('\\[\\s*.*(?=\\^=|\\$=|\\*=).*]')}catch(e){}a.removeChild(a.firstChild);c=i.createElement('input');c.setAttribute('type','checkbox');c.setAttribute('checked','checked');a.appendChild(c);try{a.querySelectorAll(':checked').length!==1&&b.push(':checked')}catch(e){}a.removeChild(a.firstChild);(c=i.createElement('input')).setAttribute('type','hidden');a.appendChild(c);try{a.querySelectorAll(':enabled').length===1&&b.push(':enabled',':disabled')}catch(e){}a.removeChild(a.firstChild);a.appendChild(i.createElement('a')).setAttribute('href','x');a.querySelectorAll(':link').length!==1&&b.push(':link');a.removeChild(a.firstChild);if(by){b.push('\\[\\s*value','\\[\\s*ismap','\\[\\s*checked','\\[\\s*disabled','\\[\\s*multiple','\\[\\s*readonly','\\[\\s*selected')}a=null;return b.length?new RegExp(b.join('|')):{'test':function(){return false}}})():true,cf=new RegExp(!(bw&&bx)?'^(?:\\*|[.#]?-?[_a-zA-Z]{1}'+p+')$':'^#?-?[_a-zA-Z]{1}'+p+'$'),cg={'a':1,'A':1,'area':1,'AREA':1,'link':1,'LINK':1},ch={'9':1,'11':1},ci={checked:1,disabled:1,ismap:1,multiple:1,readonly:1,selected:1},R={value:'defaultValue',checked:'defaultChecked',selected:'defaultSelected'},bz={'class':'className','for':'htmlFor'},cj={'action':2,'cite':2,'codebase':2,'data':2,'href':2,'longdesc':2,'lowsrc':2,'src':2,'usemap':2},bA={'class':0,'accept':1,'accept-charset':1,'align':1,'alink':1,'axis':1,'bgcolor':1,'charset':1,'checked':1,'clear':1,'codetype':1,'color':1,'compact':1,'declare':1,'defer':1,'dir':1,'direction':1,'disabled':1,'enctype':1,'face':1,'frame':1,'hreflang':1,'http-equiv':1,'lang':1,'language':1,'link':1,'media':1,'method':1,'multiple':1,'nohref':1,'noresize':1,'noshade':1,'nowrap':1,'readonly':1,'rel':1,'rev':1,'rules':1,'scope':1,'scrolling':1,'selected':1,'shape':1,'target':1,'text':1,'type':1,'valign':1,'valuetype':1,'vlink':1},ck={'accept':1,'accept-charset':1,'alink':1,'axis':1,'bgcolor':1,'charset':1,'codetype':1,'color':1,'enctype':1,'face':1,'hreflang':1,'http-equiv':1,'lang':1,'language':1,'link':1,'media':1,'rel':1,'rev':1,'target':1,'text':1,'type':1,'vlink':1},z={},S={'=':"n=='%m'",'^=':"n.indexOf('%m')==0",'*=':"n.indexOf('%m')>-1",'|=':"(n+'-').indexOf('%m-')==0",'~=':"(' '+n+' ').indexOf(' %m ')>-1",'$=':"n.substr(n.length-'%m'.length)=='%m'"},D={ID:new RegExp('^#('+p+')|'+Z),TAG:new RegExp('^('+p+')|'+Z),CLASS:new RegExp('^\\.('+p+'$)|'+Z),NAME:/\[\s*name\s*=\s*((["']*)([^'"()]*?)\2)?\s*\]/},q={spseudos:/^\:(root|empty|nth)?-?(first|last|only)?-?(child)?-?(of-type)?(?:\(([^\x29]*)\))?(.*)/,dpseudos:/^\:([\w]+|[^\x00-\xa0]+)(?:\((["']*)(.*?(\(.*\))?[^'"()]*?)\2\))?(.*)/,attribute:new RegExp('^\\['+F+'\\](.*)'),children:/^[\x20\t\n\r\f]*\>[\x20\t\n\r\f]*(.*)/,adjacent:/^[\x20\t\n\r\f]*\+[\x20\t\n\r\f]*(.*)/,relative:/^[\x20\t\n\r\f]*\~[\x20\t\n\r\f]*(.*)/,ancestor:/^[\x20\t\n\r\f]+(.*)/,universal:/^\*(.*)/,id:new RegExp('^#('+p+')(.*)'),tagName:new RegExp('^('+p+')(.*)'),className:new RegExp('^\\.('+p+')(.*)')},bB={Structural:{'root':3,'empty':3,'nth-child':3,'nth-last-child':3,'nth-of-type':3,'nth-last-of-type':3,'first-child':3,'last-child':3,'only-child':3,'first-of-type':3,'last-of-type':3,'only-of-type':3},Others:{'link':3,'visited':3,'target':3,'lang':3,'not':3,'active':3,'focus':3,'hover':3,'checked':3,'disabled':3,'enabled':3}},cl=function(b,a){var c=-1,f;if(b.length===0&&Array.slice)return Array.slice(a);while((f=a[++c]))b[b.length]=f;return b},bC=function(b,a,c){var f=-1,k;while((k=a[++f]))c(b[b.length]=k);return b},bd=function(b,a){var c=-1,f=null;while((f=a[++c])){if(f.getAttribute('id')==b){break}}return f},I=!cc?function(b,a){a||(a=i);b=b.replace(/\\/g,'');if(o||a.nodeType!=9){return bd(b,a.getElementsByTagName('*'))}return a.getElementById(b)}:function(b,a){var c=null;a||(a=i);b=b.replace(/\\/g,'');if(o||a.nodeType!=9){return bd(b,a.getElementsByTagName('*'))}if((c=a.getElementById(b))&&c.name==b&&a.getElementsByName){return bd(b,a.getElementsByName(b))}return c},cm=function(b,a){var c=b=='*',f=a,k=[],j=f.firstChild;c||(b=b.toUpperCase());while((f=j)){if(f.tagName>'@'&&(c||f.tagName.toUpperCase()==b)){k[k.length]=f}if(j=f.firstChild||f.nextSibling)continue;while(!j&&(f=f.parentNode)&&f!=a){j=f.nextSibling}}return k},A=!bw&&bc?function(b,a){a||(a=i);return M.call(a.getElementsByTagName?a.getElementsByTagName(b):cm(b,a),0)}:function(b,a){var c=-1,f=[],k,j=(a||i).getElementsByTagName(b);if(b=='*'){var g=-1;while((k=j[++c])){if(k.nodeName>'@')f[++g]=k}}else{while((k=j[++c])){f[c]=k}}return f},bD=function(b,a){return be('[name="'+b.replace(/\\/g,'')+'"]',a||i)},J=!bx&&bc?function(b,a){return M.call((a||i).getElementsByClassName(b.replace(/\\/g,'')),0)}:function(b,a){a||(a=i);var c=-1,f=c,k=[],j,g=A('*',a),h=a.ownerDocument||a,d=G(h),m=Q(h),r=d?b.toLowerCase():b;b=' '+r.replace(/\\/g,'')+' ';while((j=g[++c])){r=m?j.getAttribute('class'):j.className;if(r&&r.length&&(' '+(d?r.toLowerCase():r).replace(bt,' ')+' ').indexOf(b)>-1){k[++f]=j}}return k},bE='compareDocumentPosition'in n?function(b,a){return(b.compareDocumentPosition(a)&16)==16}:'contains'in n?function(b,a){return b!==a&&b.contains(a)}:function(b,a){while((a=a.parentNode)){if(a===b)return true}return false},cn=function(b){var a=0,c,f=b[t]||(b[t]=++T);if(!K[f]){c={};b=b.firstChild;while(b){if(b.nodeName>'@'){c[b[t]||(b[t]=++T)]=++a}b=b.nextSibling}c.length=a;K[f]=c}return K[f]},co=function(b,a){var c=0,f,k=b[t]||(b[t]=++T);if(!w[k]||!w[k][a]){f={};b=b.firstChild;while(b){if(b.nodeName.toUpperCase()==a){f[b[t]||(b[t]=++T)]=++c}b=b.nextSibling}f.length=c;w[k]||(w[k]={});w[k][a]=f}return w[k]},bF=!cd?function(b,a){return b.getAttribute(a)||''}:function(b,a){a=a.toLowerCase();if(R[a]in b){return b[R[a]]||''}return(cj[a]?b.getAttribute(a,2)||'':ci[a]?b.getAttribute(a)?a:'':((b=b.getAttributeNode(a))&&b.value)||'')},bf=!by?function(b,a){return b.hasAttribute(a)}:function(b,a){a=a.toLowerCase();a=a in bz?bz[a]:a;if(R[a]in b){return!!b[R[a]]}b=b.getAttributeNode(a);return!!(b&&(b.specified||b.nodeValue))},cp=function(b){b=b.firstChild;while(b){if(b.nodeType==3||b.nodeName>'@')return false;b=b.nextSibling}return true},cq=function(b){return bf(b,'href')&&cg[b.nodeName]},cr=function(b,a){return E(b,'',a||false)},cs=function(b){for(var a in b){if(a=='VERBOSITY'){bG=!!b[a]}else if(a=='SIMPLENOT'){bH=!!b[a];bg={};bh={};bi={};bj={};bk=false;O=new RegExp(bP,'g')}else if(a=='SHORTCUTS'){bI=!!b[a]}else if(a=='USE_QSAPI'){bk=!!b[a]&&bb;O=new RegExp(Y,'g')}}},u=function(b){if(bG){if(typeof s.DOMException!=='undefined'){var a=new Error();a.name='SYNTAX_ERR';a.message='(Selectors) '+b;a.code=12;throw a;}else{throw new Error(12,'SYNTAX_ERR: (Selectors) '+b);}}else{var c=s.console;if(c&&c.log){c.log(b)}else{if(/exception/i.test(b)){s.status=b;s.defaultStatus=b}else{s.status+=b}}}},bH=true,bI=false,bG=true,bk=bb,bl='f&&f(c[k]);r[r.length]=c[k];continue main;',bJ=i.createElement('nAv').nodeName=='nAv'?'.toUpperCase()':'',E=function(b,a,c){var f=-1,k={},j,g;if((j=b.match(ba))){while((g=j[++f])){g=g.replace(P,'');if(!k[g]){k[g]=true;a+=f>0?(c?'e=c[k];':'e=k;'):'';a+=L(g,c?bl:'f&&f(k);return true;')}}}if(c){return new Function('c,s,r,d,h,g,f','var N,n,x=0,k=-1,e;main:while(e=c[++k]){'+a+'}return r;')}else{return new Function('e,s,r,d,h,g,f','var N,n,x=0,k=e;'+a+'return false;')}},L=function(b,a){var c,f,k,j,g,h,d,m,r,v,l;g=0;while(b){if((d=b.match(q.universal))){c=true}else if((d=b.match(q.id))){a='if('+(o?'s.getAttribute(e,"id")':'(e.submit?s.getAttribute(e,"id"):e.id)')+'=="'+d[1]+'"){'+a+'}'}else if((d=b.match(q.tagName))){a='if(e.nodeName'+(o?'=="'+d[1]+'"':bJ+'=="'+d[1].toUpperCase()+'"')+'){'+a+'}'}else if((d=b.match(q.className))){a='if((n='+(o?'s.getAttribute(e,"class")':'e.className')+')&&n.length&&(" "+'+(H?'n.toLowerCase()':'n')+'.replace('+bt+'," ")+" ").indexOf(" '+(H?d[1].toLowerCase():d[1])+' ")>-1){'+a+'}'}else if((d=b.match(q.attribute))){if(d[3])d[3]=d[3].replace(/^\x22|\x22$/g,'').replace(/^\x27|\x27$/g,'');h=d[1].split(':');h=h.length==2?h[1]:h[0]+'';if(d[2]&&!S[d[2]]){u('Unsupported operator in attribute selectors "'+b+'"');return''}if(d[2]&&d[3]&&(l=S[d[2]])){bA['class']=H?1:0;d[3]=d[3].replace(/\\([0-9a-f]{2,2})/,'\\x$1');v=(o?ck:bA)[h.toLowerCase()];l=l.replace(/\%m/g,v?d[3].toLowerCase():d[3])}else{v=false;l=d[2]=='='?'n==""':'false'}h='n=s.'+(d[2]?'get':'has')+'Attribute(e,"'+d[1]+'")'+(v?'.toLowerCase();':';');a=h+'if('+(d[2]?l:'n')+'){'+a+'}'}else if((d=b.match(q.adjacent))){g++;a=bv?'var N'+g+'=e;if(e&&(e=e.previousElementSibling)){'+a+'}e=N'+g+';':'var N'+g+'=e;while(e&&(e=e.previousSibling)){if(e.nodeName>"@"){'+a+'break;}}e=N'+g+';'}else if((d=b.match(q.relative))){g++;a=bv?('var N'+g+'=e;e=e.parentNode.firstElementChild;while(e&&e!=N'+g+'){'+a+'e=e.nextElementSibling}e=N'+g+';'):('var N'+g+'=e;e=e.parentNode.firstChild;while(e&&e!=N'+g+'){if(e.nodeName>"@"){'+a+'}e=e.nextSibling}e=N'+g+';');}else if((d=b.match(q.children))){g++;a='var N'+g+'=e;if(e&&e!==h&&e!==g&&(e=e.parentNode)){'+a+'}e=N'+g+';';}else if((d=b.match(q.ancestor))){g++;a='var N'+g+'=e;while(e&&e!==h&&e!==g&&(e=e.parentNode)){'+a+'}e=N'+g+';';}else if((d=b.match(q.spseudos))&&bB.Structural[b.match(bs)[0]]){switch(d[1]){case'root':a='if(e===h){'+a+'}';break;case'empty':a='if(s.isEmpty(e)){'+a+'}';break;default:if(d[1]&&d[5]){if(d[5]=='n'){a='if(e!==h){'+a+'}';break;}else if(d[5]=='even'){f=2;k=0;}else if(d[5]=='odd'){f=2;k=1;}else{k=((j=d[5].match(/(-?\d+)$/))?parseInt(j[1],10):0);f=((j=d[5].match(/(-?\d*)n/))?parseInt(j[1],10):0);if(j&&j[1]=='-')f=-1;}l=d[4]?'n[N]':'n';h=d[2]=='last'&&k>=0?l+'.length-('+(k-1)+')':k;l=l+'[e.'+t+']';v=k<1&&f>1?'('+l+'-('+h+'))%'+f+'==0':f>+1?(d[2]=='last')?'('+l+'-('+h+'))%'+f+'==0':l+'>='+h+'&&('+l+'-('+h+'))%'+f+'==0':f<-1?(d[2]=='last')?'('+l+'-('+h+'))%'+f+'==0':l+'<='+h+'&&('+l+'-('+h+'))%'+f+'==0':f===0?l+'=='+h:(d[2]=='last')?f==-1?l+'>='+h:l+'<='+h:f==-1?l+'<='+h:l+'>='+h;a=(d[4]?'N=e.nodeName'+bJ+';':'')+'if(e!==h){n=s.getIndexesBy'+(d[4]?'NodeName':'NodeType')+'(e.parentNode'+(d[4]?',N':'')+');if('+v+'){'+a+'}}';}else{f=d[2]=='first'?'previous':'next';j=d[2]=='only'?'previous':'next';k=d[2]=='first'||d[2]=='last';l=d[4]?'&&n.nodeName!=e.nodeName':'&&n.nodeName<"@"';a='if(e!==h){'+('n=e;while((n=n.'+f+'Sibling)'+l+');if(!n){'+(k?a:'n=e;while((n=n.'+j+'Sibling)'+l+');if(!n){'+a+'}')+'}')+'}';}break;}}else if((d=b.match(q.dpseudos))&&bB.Others[b.match(bs)[0]]){switch(d[1]){case'not':h=d[3].replace(P,'');if(bH&&!bQ.test(h)){u('Negation pseudo-class only accepts simple selectors "'+b+'"');return'';}else{if('compatMode'in i){a='N='+E(h,'',false)+'(e,s,r,d,h,g);if(!N){'+a+'}';}else{a='if(!s.match(e, "'+h.replace(/\x22/g,'\\"')+'",r)){'+a+'}';}}break;case'checked':a='if(((typeof e.form!=="undefined"&&(/radio|checkbox/i).test(e.type))||/option/i.test(e.nodeName))&&(e.checked||e.selected)){'+a+'}';break;case'enabled':a='if(((typeof e.form!=="undefined"&&!(/hidden/i).test(e.type))||s.isLink(e))&&!e.disabled){'+a+'}';break;case'disabled':a='if(((typeof e.form!=="undefined"&&!(/hidden/i).test(e.type))||s.isLink(e))&&e.disabled){'+a+'}';break;case'lang':v='';if(d[3])v=d[3].substr(0,2)+'-';a='do{(n=e.lang||"").toLowerCase();if((n==""&&h.lang=="'+d[3].toLowerCase()+'")||(n&&(n=="'+d[3].toLowerCase()+'"||n.substr(0,3)=="'+v.toLowerCase()+'"))){'+a+'break;}}while((e=e.parentNode)&&e!==g);';break;case'target':j=i.location?i.location.hash:'';if(j){a='if(e.id=="'+j.slice(1)+'"){'+a+'}';}break;case'link':a='if(s.isLink(e)&&!e.visited){'+a+'}';break;case'visited':a='if(s.isLink(e)&&e.visited){'+a+'}';break;case'active':if(o)break;a='if(e===d.activeElement){'+a+'}';break;case'hover':if(o)break;a='if(e===d.hoverElement){'+a+'}';break;case'focus':if(o)break;a=bX?'if(e===d.activeElement&&d.hasFocus()&&(e.type||e.href)){'+a+'}':'if(e===d.activeElement&&(e.type||e.href)){'+a+'}';break;default:break;}}else{h=false;r=true;for(h in z){if((d=b.match(z[h].Expression))){m=z[h].Callback(d,a);a=m.source;r=m.status;if(r)break;}}if(!r){u('Unknown pseudo-class selector "'+b+'"');return'';}if(!h){u('Unknown token in selector "'+b+'"');return'';}}if(!d){u('Invalid syntax in selector "'+b+'"');return'';}b=d&&d[d.length-1];}return a;},bm=function(b,a,c,f){var k,j,g;if(!b||b.nodeName<'A'||!a)return false;if(c&&c.nodeType==1){if(!bE(c,b))return false;}a=a.replace(P,'');c||(c=i);if(bq!=c){bq=c;n=(i=b.ownerDocument||b).documentElement;H=G(i);o=Q(i);}if(k=bo!=a){if((j=a.match(O))&&j[0]==a){bo=a;U=(j=a.match(ba)).length<2;}else{u('The string "'+a+'", is not a valid CSS selector');return false;}}if(o&&!(g=bj[a])){g=bj[a]=U?new Function('e,s,r,d,h,g,f','var N,n,x=0,k=e;'+L(a,'f&&f(k);return true;')+'return false;'):E(a,'',false);}else if(!(g=bi[a])){g=bi[a]=U?new Function('e,s,r,d,h,g,f','var N,n,x=0,k=e;'+L(a,'f&&f(k);return true;')+'return false;'):E(a,'',false);}K={};w={};return g(b,bK,[],i,n,c||i,f);},be=function(b,a,c){var f,k,j,g,h,d,m;if(arguments.length===0){u('Missing required selector parameters');return[];}else if(b===''){u('Empty selector string');return[];}else if(typeof b!='string'){return[];}b=b.replace(P,'');a||(a=i);if(bI){if(bV.test(b)){b=a.nodeType==9?'* '+b:a.id?'#'+a.id+' '+b:b;}if(bW.test(b)){b=b+' *';}}if(cf.test(b)){switch(b.charAt(0)){case'#':if((j=I(b.slice(1),a))){c&&c(j);return[j];}return[];case'.':g=J(b.slice(1),a);break;default:g=A(b,a);break;}return c?bC([],g,c):g;}if(bk&&!ce.test(b)&&ch[a.nodeType]){bn=null;try{g=a.querySelectorAll(b);}catch(e){bn=e;if(b==='')throw e;}if(g){switch(g.length){case 0:return[];case 1:j=g.item(0);c&&c(j);return[j];default:return c?bC([],g,c):bc?M.call(g):cl([],g);}}}if(br!=a){br=a;n=(i=a.ownerDocument||a).documentElement;H=G(i);o=Q(i);}if(k=bp!=b){if((h=b.match(O))&&h[0]==b){bp=b;N=(h=b.match(ba)).length<2;}else{u('The string "'+b+'", is not a valid CSS selector');return[];}}if(N&&a.nodeType!=11){if(k){h=b.match(bU);m=h[h.length-1];B=m.split(':not')[0];}if((h=B.match(D.ID))&&(m=h[1])){if((j=I(m,a))){if(bm(j,b)){c&&c(j);return[j];}}return[];}else if((h=b.match(D.ID))&&(m=h[1])){if((j=I(m,i))){if(/[>+~]/.test(b)){a=j.parentNode;}else{b=b.replace('#'+m,'*');a=j;}}else return[];}if(bu){if((h=B.match(D.CLASS))&&(m=h[1])){if((g=J(m,a)).length===0){return[];}}else if((h=B.match(D.TAG))&&(m=h[1])){if((g=A(m,a)).length===0){return[];}}}else{if((h=B.match(D.TAG))&&(m=h[1])){if((g=A(m,a)).length===0){return[];}}else if((h=B.match(D.CLASS))&&(m=h[1])){if((g=J(m,a)).length===0){return[];}}}}if(!g){g=A('*',a);}if(o&&!(d=bh[b])){d=bh[b]=N?new Function('c,s,r,d,h,g,f','var N,n,x=0,k=-1,e;main:while(e=c[++k]){'+L(b,bl)+'}return r;'):E(b,'',true);}else if(!(d=bg[b])){d=bg[b]=N?new Function('c,s,r,d,h,g,f','var N,n,x=0,k=-1,e;main:while(e=c[++k]){'+L(b,bl)+'}return r;'):E(b,'',true);}K={};w={};return d(g,bK,[],i,n,a,c);},T=1,t='uniqueID'in n?'uniqueID':'CSS_ID',K={},w={},bg={},bh={},bi={},bj={},bK={getIndexesByNodeType:cn,getIndexesByNodeName:co,getAttribute:bF,hasAttribute:bf,byClass:J,byName:bD,byTag:A,byId:I,isEmpty:cp,isLink:cq,select:be,match:bm};s.NW||(s.NW={});NW.Dom={byId:I,byTag:A,byName:bD,byClass:J,getAttribute:bF,hasAttribute:bf,match:bm,select:be,compile:cr,contains:bE,configure:cs,registerOperator:function(b,a){if(!S[b]){S[b]=a}},registerSelector:function(b,a,c){if(!z[b]){z[b]={};z[b].Expression=a;z[b].Callback=c}}}})(this);

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());


/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
(function(w) {
  "use strict";
  w.matchMedia = w.matchMedia || function(doc, undefined) {
    var bool, docElem = doc.documentElement, refNode = docElem.firstElementChild || docElem.firstChild, fakeBody = doc.createElement("body"), div = doc.createElement("div");
    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);
    return function(q) {
      div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';
      docElem.insertBefore(fakeBody, refNode);
      bool = div.offsetWidth === 42;
      docElem.removeChild(fakeBody);
      return {
        matches: bool,
        media: q
      };
    };
  }(w.document);
})(this);

/*! Respond.js v1.4.0: min/max-width media query polyfill. (c) Scott Jehl. MIT Lic. j.mp/respondjs  */
(function(w) {
  "use strict";
  var respond = {};
  w.respond = respond;
  respond.update = function() {};
  var requestQueue = [], xmlHttp = function() {
    var xmlhttpmethod = false;
    try {
      xmlhttpmethod = new w.XMLHttpRequest();
    } catch (e) {
      xmlhttpmethod = new w.ActiveXObject("Microsoft.XMLHTTP");
    }
    return function() {
      return xmlhttpmethod;
    };
  }(), ajax = function(url, callback) {
    var req = xmlHttp();
    if (!req) {
      return;
    }
    req.open("GET", url, true);
    req.onreadystatechange = function() {
      if (req.readyState !== 4 || req.status !== 200 && req.status !== 304) {
        return;
      }
      callback(req.responseText);
    };
    if (req.readyState === 4) {
      return;
    }
    req.send(null);
  };
  respond.ajax = ajax;
  respond.queue = requestQueue;
  respond.regex = {
    media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
    keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
    urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
    findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
    only: /(only\s+)?([a-zA-Z]+)\s?/,
    minw: /\([\s]*min\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/,
    maxw: /\([\s]*max\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/
  };
  respond.mediaQueriesSupported = w.matchMedia && w.matchMedia("only all") !== null && w.matchMedia("only all").matches;
  if (respond.mediaQueriesSupported) {
    return;
  }
  var doc = w.document, docElem = doc.documentElement, mediastyles = [], rules = [], appendedEls = [], parsedSheets = {}, resizeThrottle = 30, head = doc.getElementsByTagName("head")[0] || docElem, base = doc.getElementsByTagName("base")[0], links = head.getElementsByTagName("link"), lastCall, resizeDefer, eminpx, getEmValue = function() {
    var ret, div = doc.createElement("div"), body = doc.body, originalHTMLFontSize = docElem.style.fontSize, originalBodyFontSize = body && body.style.fontSize, fakeUsed = false;
    div.style.cssText = "position:absolute;font-size:1em;width:1em";
    if (!body) {
      body = fakeUsed = doc.createElement("body");
      body.style.background = "none";
    }
    docElem.style.fontSize = "100%";
    body.style.fontSize = "100%";
    body.appendChild(div);
    if (fakeUsed) {
      docElem.insertBefore(body, docElem.firstChild);
    }
    ret = div.offsetWidth;
    if (fakeUsed) {
      docElem.removeChild(body);
    } else {
      body.removeChild(div);
    }
    docElem.style.fontSize = originalHTMLFontSize;
    if (originalBodyFontSize) {
      body.style.fontSize = originalBodyFontSize;
    }
    ret = eminpx = parseFloat(ret);
    return ret;
  }, applyMedia = function(fromResize) {
    var name = "clientWidth", docElemProp = docElem[name], currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[name] || docElemProp, styleBlocks = {}, lastLink = links[links.length - 1], now = new Date().getTime();
    if (fromResize && lastCall && now - lastCall < resizeThrottle) {
      w.clearTimeout(resizeDefer);
      resizeDefer = w.setTimeout(applyMedia, resizeThrottle);
      return;
    } else {
      lastCall = now;
    }
    for (var i in mediastyles) {
      if (mediastyles.hasOwnProperty(i)) {
        var thisstyle = mediastyles[i], min = thisstyle.minw, max = thisstyle.maxw, minnull = min === null, maxnull = max === null, em = "em";
        if (!!min) {
          min = parseFloat(min) * (min.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
        }
        if (!!max) {
          max = parseFloat(max) * (max.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
        }
        if (!thisstyle.hasquery || (!minnull || !maxnull) && (minnull || currWidth >= min) && (maxnull || currWidth <= max)) {
          if (!styleBlocks[thisstyle.media]) {
            styleBlocks[thisstyle.media] = [];
          }
          styleBlocks[thisstyle.media].push(rules[thisstyle.rules]);
        }
      }
    }
    for (var j in appendedEls) {
      if (appendedEls.hasOwnProperty(j)) {
        if (appendedEls[j] && appendedEls[j].parentNode === head) {
          head.removeChild(appendedEls[j]);
        }
      }
    }
    appendedEls.length = 0;
    for (var k in styleBlocks) {
      if (styleBlocks.hasOwnProperty(k)) {
        var ss = doc.createElement("style"), css = styleBlocks[k].join("\n");
        ss.type = "text/css";
        ss.media = k;
        head.insertBefore(ss, lastLink.nextSibling);
        if (ss.styleSheet) {
          ss.styleSheet.cssText = css;
        } else {
          ss.appendChild(doc.createTextNode(css));
        }
        appendedEls.push(ss);
      }
    }
  }, translate = function(styles, href, media) {
    var qs = styles.replace(respond.regex.keyframes, "").match(respond.regex.media), ql = qs && qs.length || 0;
    href = href.substring(0, href.lastIndexOf("/"));
    var repUrls = function(css) {
      return css.replace(respond.regex.urls, "$1" + href + "$2$3");
    }, useMedia = !ql && media;
    if (href.length) {
      href += "/";
    }
    if (useMedia) {
      ql = 1;
    }
    for (var i = 0; i < ql; i++) {
      var fullq, thisq, eachq, eql;
      if (useMedia) {
        fullq = media;
        rules.push(repUrls(styles));
      } else {
        fullq = qs[i].match(respond.regex.findStyles) && RegExp.$1;
        rules.push(RegExp.$2 && repUrls(RegExp.$2));
      }
      eachq = fullq.split(",");
      eql = eachq.length;
      for (var j = 0; j < eql; j++) {
        thisq = eachq[j];
        mediastyles.push({
          media: thisq.split("(")[0].match(respond.regex.only) && RegExp.$2 || "all",
          rules: rules.length - 1,
          hasquery: thisq.indexOf("(") > -1,
          minw: thisq.match(respond.regex.minw) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
          maxw: thisq.match(respond.regex.maxw) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
        });
      }
    }
    applyMedia();
  }, makeRequests = function() {
    if (requestQueue.length) {
      var thisRequest = requestQueue.shift();
      ajax(thisRequest.href, function(styles) {
        translate(styles, thisRequest.href, thisRequest.media);
        parsedSheets[thisRequest.href] = true;
        w.setTimeout(function() {
          makeRequests();
        }, 0);
      });
    }
  }, ripCSS = function() {
    for (var i = 0; i < links.length; i++) {
      var sheet = links[i], href = sheet.href, media = sheet.media, isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";
      if (!!href && isCSS && !parsedSheets[href]) {
        if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
          translate(sheet.styleSheet.rawCssText, href, media);
          parsedSheets[href] = true;
        } else {
          if (!/^([a-zA-Z:]*\/\/)/.test(href) && !base || href.replace(RegExp.$1, "").split("/")[0] === w.location.host) {
            if (href.substring(0, 2) === "//") {
              href = w.location.protocol + href;
            }
            requestQueue.push({
              href: href,
              media: media
            });
          }
        }
      }
    }
    makeRequests();
  };
  ripCSS();
  respond.update = ripCSS;
  respond.getEmValue = getEmValue;
  function callMedia() {
    applyMedia(true);
  }
  if (w.addEventListener) {
    w.addEventListener("resize", callMedia, false);
  } else if (w.attachEvent) {
    w.attachEvent("onresize", callMedia);
  }
})(this);

/**
  * IE8
  */
// @codekit-prepend "../bower_components/fix-ie/src/IE8-child-elements.js";
// @codekit-prepend "../bower_components/fix-ie/src/IE8-offsets.js";
// @codekit-prepend "../bower_components/fix-ie/src/text-content.js";
// @codekit-prepend "../bower_components/fix-ie/src/IE8-getComputedStyle.js";
// @codekit-prepend "components/IE8-preventDefault.js";
// @codekit-prepend "components/IE8-stopPropagation.js";
// @codekit-prepend "components/IE8-addEventListener.js";

/**
  * NWMatcher
  * https://github.com/dperini/nwmatcher
  *
  * selectivizr
  * https://github.com/keithclark/selectivizr
  */
// @codekit-prepend "components/nwmatcher-1.2.3-min.js";
// @codekit-prepend "../bower_components/Selectivizr bower/selectivizr.js";

/**
  * matchmedia 
  * https://github.com/paulirish/matchMedia.js
  *
  * respond
  * https://github.com/scottjehl/Respond
  */
// @codekit-prepend "../bower_components/matchMedia/matchMedia.js";
// @codekit-prepend "../bower_components/respond/dest/respond.src.js";

// codekit-prepend "components/IE8-getComputedStyle.js";


