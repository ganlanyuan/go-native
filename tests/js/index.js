var d = document,
    w = window;

// addEventListener 
// removeEventListener 
// window.innerWidth 
// window.innerHeight
var 
    addEventBtn = d.querySelector('.add-event-listener'),
    removeEventBtn = d.querySelector('.remove-event-listener'),
    eventOutput = d.querySelector('.event-listener-output'),
    wwOutput = d.querySelector('.window-width-output');

function showWindowWidth() {
  var 
      ww = w.innerWidth,
      wh = w.innerHeight;
      
  wwOutput.innerHTML = "Window: " + ww + " x " + wh;
}

w.addEventListener('load', showWindowWidth);

addEventBtn.addEventListener('click', function (e) {
  eventOutput.innerHTML = "Resize Listener added";
  w.addEventListener('resize', showWindowWidth);
});

removeEventBtn.addEventListener('click', function (e) {
  eventOutput.innerHTML = "Resize Listener removed";
  w.removeEventListener('resize', showWindowWidth);
});

// preventDefault
var 
    link = d.querySelector('.preventDefault a');
link.addEventListener('click', function (e) {
  e.preventDefault();
});

// node.textContent
var txtNode = d.querySelector('.text-content'),
    txtNodeO = d.querySelector('.text-content-output');
txtNodeO.textContent = txtNode.textContent;
// alert(txtNode);

// classList
var 
    ad = document.querySelector('#addClasses'),
    rm = document.querySelector('#removeClasses'),
    tg = document.querySelector('#toggleClass');

ad.classList.add('bold', 'pink', 'underline', 'heading');
rm.classList.remove('bold', 'pink', 'underline', 'italic', 'heading');
tg.classList.toggle('pink', true);
tg.classList.toggle('italic', false);

// el.childElementCount
// el.firstElementChild
// el.lastElementChild
// el.nextElementSibling
// el.previousElementSibling
var 
    parentEl = d.querySelector('.parent-element'),
    parentElO = d.querySelector('.parent-element-output'),
    childCount = parentEl.childElementCount,
    firstChild = parentEl.firstElementChild,
    lastChild = parentEl.lastElementChild,
    prevEl = parentEl.previousElementSibling,
    nextEl = parentEl.nextElementSibling;
firstChild.classList.add('first');
lastChild.classList.add('last');
prevEl.classList.add('prev');
nextEl.classList.add('next');
parentElO.textContent = "childElementCount: " + childCount;

// ChildNode.remove
// window.getComputedStyle
// window.pageXOffset
// window.pageYOffset
// Array.isArray
// Number.isNaN
// Date.now
// String.prototype.trim
// String.prototype.repeat
