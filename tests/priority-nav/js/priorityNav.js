function priorityNav(e,l,i,n){function t(){var e=getOuterWidth(d),l,t,r,s=window.innerWidth,o=getOuterWidth(a);if(e>=c[c.length-1]||i>s)a.classList.add("is-hidden"),l=e,t=c.length;else if(a.classList.remove("is-hidden"),l=e-o,n>s)t=0;else for(var h=0,v=c.length;v>h;h++)l>=c[h]&&l<c[h+1]?t=h+1:l<c[0]&&(t=0);var g=d.querySelectorAll(".visible-links > li");if(r=g.length?g.length:0,t>r)for(var f=r;t>f;){var y=d.querySelectorAll(".visible-links"),p=d.querySelectorAll(".hidden-links > li");append(y,p[0]),f++}else if(r>t)for(var f=r;f>t;){var g=d.querySelectorAll(".visible-links > li"),p=d.querySelectorAll(".hidden-links > li");prepend(u,g[g.length-1]),f--}var p=d.querySelectorAll(".hidden-links > li"),k;k=p.length?p.length:0,a.setAttribute("data-count",k)}var i="undefined"!=typeof i&&i!==!1&&null!==i?i:0,n="undefined"!=typeof n&&n!==!1&&null!==n?n:0,r=document,d=r.querySelector(e),s=d.querySelector("ul"),o=s.children;d.classList.add("js-priority-nav"),s.classList.add("visible-links"),prepend(d,'<button class="js-nav-toggle is-hidden" data-count="">'+l+"</button>"),append(d,'<ul class="hidden-links is-hidden"></ul>');for(var a=d.querySelector(".js-nav-toggle"),u=d.querySelector(".hidden-links"),c=[],h=[],v=[],g=0,f=o.length;f>g;g++){var y=c[c.length-1],p=getOuterWidth(o[g]),k=y?y+p:p;c.push(k)}t(),window.addEventListener("resize",function(){t()}),a.addEventListener("click",function(){d.querySelector(".hidden-links").classList.toggle("is-hidden")})}