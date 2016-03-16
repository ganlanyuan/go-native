var d = document,
    w = window;

// addEventListener 
// removeEventListener 
// window.innerWidth 
// window.innerHeight
// window.pageXOffset
// window.pageYOffset
var 
    addEventBtn = d.querySelector('.add-event-listener'),
    removeEventBtn = d.querySelector('.remove-event-listener'),
    eventOutput = d.querySelector('.event-listener-output'),
    wwOutputSize = d.querySelector('.window-width-output .size');
    wwOutputOffset = d.querySelector('.window-width-output .offset');

function showWindowSize() {
  var 
      ww = w.innerWidth,
      wh = w.innerHeight;
      
  wwOutputSize.innerHTML = "Window: " + ww + " x " + wh + "<br />";
}
function showPageOffset() {
  var 
      wx = w.pageXOffset,
      wy = w.pageYOffset;
      
  wwOutputOffset.innerHTML = "Page offset: " + wx + " x " + wy;
}

w.addEventListener('load', showWindowSize);
w.addEventListener('load', showPageOffset);

addEventBtn.addEventListener('click', function (e) {
  eventOutput.innerHTML = "Resize Listener added";
  w.addEventListener('resize', showWindowSize);
  w.addEventListener('scroll', showPageOffset);
});

removeEventBtn.addEventListener('click', function (e) {
  eventOutput.innerHTML = "Resize Listener removed";
  w.removeEventListener('resize', showWindowSize);
  w.removeEventListener('scroll', showPageOffset);
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
// lastChild.classList.add('last');
prevEl.classList.add('prev');
nextEl.classList.add('next');
parentElO.textContent = "childElementCount: " + childCount;

// ChildNode.remove
var childRm = d.querySelector('.parent-remove strong'),
    btnRm = d.querySelector('.btn-remove');
btnRm.addEventListener('click', function () {
  childRm.remove();
});

// window.getComputedStyle
// Array.isArray
// Number.isNaN
// Date.now
// String.prototype.trim
// String.prototype.repeat
