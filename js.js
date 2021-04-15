// alert
window.addEventListener('load', function () {

  var button = document.getElementById('alert-trigger');

  button.addEventListener('click', addAlert);

});

/*
* @function addAlert
*
* @desc Adds an alert to the page
*
* @param   {Object}  event  -  Standard W3C event object
*
*/

function addAlert (event) {

  var example = document.getElementById('example');
  var template = document.getElementById('alert-template').innerHTML;

  example.innerHTML = template;

}



// Simple accordion pattern example
'use strict';

Array.prototype.slice.call(document.querySelectorAll('.Accordion')).forEach(function (accordion) {

  // Allow for multiple accordion sections to be expanded at the same time
  var allowMultiple = accordion.hasAttribute('data-allow-multiple');
  // Allow for each toggle to both open and close individually
  var allowToggle = (allowMultiple) ? allowMultiple : accordion.hasAttribute('data-allow-toggle');

  // Create the array of toggle elements for the accordion group
  var triggers = Array.prototype.slice.call(accordion.querySelectorAll('.Accordion-trigger'));
  var panels = Array.prototype.slice.call(accordion.querySelectorAll('.Accordion-panel'));


  accordion.addEventListener('click', function (event) {
    var target = event.target;

    if (target.classList.contains('Accordion-trigger')) {
      // Check if the current toggle is expanded.
      var isExpanded = target.getAttribute('aria-expanded') == 'true';
      var active = accordion.querySelector('[aria-expanded="true"]');

      // without allowMultiple, close the open accordion
      if (!allowMultiple && active && active !== target) {
        // Set the expanded state on the triggering element
        active.setAttribute('aria-expanded', 'false');
        // Hide the accordion sections, using aria-controls to specify the desired section
        document.getElementById(active.getAttribute('aria-controls')).setAttribute('hidden', '');

        // When toggling is not allowed, clean up disabled state
        if (!allowToggle) {
          active.removeAttribute('aria-disabled');
        }
      }

      if (!isExpanded) {
        // Set the expanded state on the triggering element
        target.setAttribute('aria-expanded', 'true');
        // Hide the accordion sections, using aria-controls to specify the desired section
        document.getElementById(target.getAttribute('aria-controls')).removeAttribute('hidden');

        // If toggling is not allowed, set disabled state on trigger
        if (!allowToggle) {
          target.setAttribute('aria-disabled', 'true');
        }
      }
      else if (allowToggle && isExpanded) {
        // Set the expanded state on the triggering element
        target.setAttribute('aria-expanded', 'false');
        // Hide the accordion sections, using aria-controls to specify the desired section
        document.getElementById(target.getAttribute('aria-controls')).setAttribute('hidden', '');
      }

      event.preventDefault();
    }
  });

  // Bind keyboard behaviors on the main accordion container
  accordion.addEventListener('keydown', function (event) {
    var target = event.target;
    var key = event.which.toString();

    var isExpanded = target.getAttribute('aria-expanded') == 'true';
    var allowToggle = (allowMultiple) ? allowMultiple : accordion.hasAttribute('data-allow-toggle');

    // 33 = Page Up, 34 = Page Down
    var ctrlModifier = (event.ctrlKey && key.match(/33|34/));

    // Is this coming from an accordion header?
    if (target.classList.contains('Accordion-trigger')) {
      // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
      // 38 = Up, 40 = Down
      if (key.match(/38|40/) || ctrlModifier) {
        var index = triggers.indexOf(target);
        var direction = (key.match(/34|40/)) ? 1 : -1;
        var length = triggers.length;
        var newIndex = (index + length + direction) % length;

        triggers[newIndex].focus();

        event.preventDefault();
      }
      else if (key.match(/35|36/)) {
        // 35 = End, 36 = Home keyboard operations
        switch (key) {
          // Go to first accordion
          case '36':
            triggers[0].focus();
            break;
            // Go to last accordion
          case '35':
            triggers[triggers.length - 1].focus();
            break;
        }
        event.preventDefault();

      }

    }
  });

  // These are used to style the accordion when one of the buttons has focus
  accordion.querySelectorAll('.Accordion-trigger').forEach(function (trigger) {

    trigger.addEventListener('focus', function (event) {
      accordion.classList.add('focus');
    });

    trigger.addEventListener('blur', function (event) {
      accordion.classList.remove('focus');
    });

  });

  // Minor setup: will set disabled state, via aria-disabled, to an
  // expanded/ active accordion which is not allowed to be toggled close
  if (!allowToggle) {
    // Get the first expanded/ active accordion
    var expanded = accordion.querySelector('[aria-expanded="true"]');

    // If an expanded/ active accordion is found, disable
    if (expanded) {
      expanded.setAttribute('aria-disabled', 'true');
    }
  }

});



























/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   slider.js
*
*   Desc:   Slider widget that implements ARIA Authoring Practices
*/

// Create Slider that contains value, valuemin, valuemax, and valuenow
var Slider = function (domNode)  {

  this.domNode = domNode;
  this.railDomNode = domNode.parentNode;

  this.valueDomNode = false;

  this.valueMin = 0;
  this.valueMax = 100;
  this.valueNow = 50;

  this.railWidth = 0;

  this.thumbWidth  = 8;
  this.thumbHeight = 28;

  this.keyCode = Object.freeze({
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'pageUp': 33,
    'pageDown': 34,
    'end': 35,
    'home': 36
  });
};

// Initialize slider
Slider.prototype.init = function () {

  if (this.domNode.getAttribute('aria-valuemin')) {
    this.valueMin = parseInt((this.domNode.getAttribute('aria-valuemin')));
  }
  if (this.domNode.getAttribute('aria-valuemax')) {
    this.valueMax = parseInt((this.domNode.getAttribute('aria-valuemax')));
  }
  if (this.domNode.getAttribute('aria-valuenow')) {
    this.valueNow = parseInt((this.domNode.getAttribute('aria-valuenow')));
  }

  this.railWidth = parseInt(this.railDomNode.style.width.slice(0, -2));

  this.valueDomNode = this.railDomNode.nextElementSibling;

  if (this.valueDomNode) {

    this.valueDomNode.innerHTML = '0';
    this.valueDomNode.style.left = (this.railDomNode.offsetLeft + this.railWidth + 10) + 'px';
    this.valueDomNode.style.top = (this.railDomNode.offsetTop - 8) + 'px';
  }

  if (this.domNode.tabIndex != 0) {
    this.domNode.tabIndex = 0;
  }

  this.domNode.style.width = this.thumbWidth + 'px';
  this.domNode.style.height = this.thumbHeight + 'px';
  this.domNode.style.top = (this.thumbHeight / -2) + 'px';

  this.domNode.addEventListener('keydown',    this.handleKeyDown.bind(this));
  // add onmousedown, move, and onmouseup
  this.domNode.addEventListener('mousedown', this.handleMouseDown.bind(this));

  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));

  this.railDomNode.addEventListener('click', this.handleClick.bind(this));

  this.moveSliderTo(this.valueNow);

};

Slider.prototype.moveSliderTo = function (value) {

  if (value > this.valueMax) {
    value = this.valueMax;
  }

  if (value < this.valueMin) {
    value = this.valueMin;
  }

  this.valueNow = value;

  this.domNode.setAttribute('aria-valuenow', this.valueNow);

  var pos = Math.round(
    (this.valueNow * this.railWidth) / (this.valueMax - this.valueMin)
  ) - (this.thumbWidth / 2);

  this.domNode.style.left = pos + 'px';

  if (this.valueDomNode) {
    this.valueDomNode.innerHTML = this.valueNow.toString();
  }

  updateColorBox();

};

Slider.prototype.handleKeyDown = function (event) {

  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.left:
    case this.keyCode.down:
      this.moveSliderTo(this.valueNow - 1);
      flag = true;
      break;

    case this.keyCode.right:
    case this.keyCode.up:
      this.moveSliderTo(this.valueNow + 1);
      flag = true;
      break;

    case this.keyCode.pageDown:
      this.moveSliderTo(this.valueNow - 10);
      flag = true;
      break;

    case this.keyCode.pageUp:
      this.moveSliderTo(this.valueNow + 10);
      flag = true;
      break;

    case this.keyCode.home:
      this.moveSliderTo(this.valueMin);
      flag = true;
      break;

    case this.keyCode.end:
      this.moveSliderTo(this.valueMax);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.preventDefault();
    event.stopPropagation();
  }

};

Slider.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.railDomNode.classList.add('focus');
};

Slider.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
  this.railDomNode.classList.remove('focus');
};

// Initialise Sliders on the page
window.addEventListener('load', function () {

  var sliders = document.querySelectorAll('[role=slider]');;

  for (var i = 0; i < sliders.length; i++) {
    var s = new Slider(sliders[i]);
    s.init();
  }

});

Slider.prototype.handleMouseDown = function (event) {

  var self = this;

  var handleMouseMove = function (event) {

    var diffX = event.pageX - self.railDomNode.offsetLeft;
    self.valueNow = parseInt(((self.valueMax - self.valueMin) * diffX) / self.railWidth);
    self.moveSliderTo(self.valueNow);

    event.preventDefault();
    event.stopPropagation();
  };

  var handleMouseUp = function (event) {

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

  };

    // bind a mousemove event handler to move pointer
  document.addEventListener('mousemove', handleMouseMove);

  // bind a mouseup event handler to stop tracking mouse movements
  document.addEventListener('mouseup', handleMouseUp);

  event.preventDefault();
  event.stopPropagation();

  // Set focus to the clicked handle
  this.domNode.focus();

};

// handleMouseMove has the same functionality as we need for handleMouseClick on the rail
Slider.prototype.handleClick = function (event) {

  var diffX = event.pageX - this.railDomNode.offsetLeft;
  this.valueNow = parseInt(((this.valueMax - this.valueMin) * diffX) / this.railWidth);
  this.moveSliderTo(this.valueNow);

  event.preventDefault();
  event.stopPropagation();

};

/* ---------------------------------------------------------------- */
/*                  Change color of the Box                         */
/* ---------------------------------------------------------------- */

updateColorBox = function () {

  function getColorHex () {
    var r = parseInt(document.getElementById('idRedValue').getAttribute('aria-valuenow')).toString(16);
    var g = parseInt(document.getElementById('idGreenValue').getAttribute('aria-valuenow')).toString(16);
    var b = parseInt(document.getElementById('idBlueValue').getAttribute('aria-valuenow')).toString(16);

    if (r.length === 1) {
      r = '0' + r;
    }
    if (g.length === 1) {
      g = '0' + g;
    }
    if (b.length === 1) {
      b = '0' + b;
    }

    return '#' + r + g + b;
  }

  function getColorRGB () {
    var r = document.getElementById('idRedValue').getAttribute('aria-valuenow');
    var g = document.getElementById('idGreenValue').getAttribute('aria-valuenow');
    var b = document.getElementById('idBlueValue').getAttribute('aria-valuenow');

    return r + ', ' + g + ', ' + b;
  }

  var node = document.getElementById('idColorBox');

  if (node) {

    var color = getColorHex();

    node.style.backgroundColor = color;

    node = document.getElementById('idColorValueHex');
    node.value = color;

    node = document.getElementById('idColorValueRGB');
    node.value = getColorRGB();

  }
};