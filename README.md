listAnimate
===========
listAnimate is a handler to change/hide/show elements in a list of block-level elements.

How to use
----------
+ Loads jQuery
+ Insert listAnimate script
+ Initialize plugin on document ready
```javascript
$(element).listAnimate();
```

To call any method use:
```javascript
$(element).data('_listAnimate').methodName(params);
```

*Checkout the demo.html*

Settings
--------
```javascript
var defaultSettings = {
  // only this in this version
	orientation: 'vertical',
	// how the element will show
	// only this in this version
	showAnimate: 'slideToRight',
	// how the element will hide
	// only this in this version
	hideAnimate: 'slideToLeft',
	// time for animate
	timeAnimateShow: 1000,
	timeAnimateHide: 1000,
	// calbacks
	onElementHide: function() {},
	onBeforeInit: function() {},
};
```

Methods
-------
```javascript
/**
* Change an element in list identified by your index with another index to show
*
* @method changeElement
* @param {Integer} indexToHide
* @param {Integer} indexToShow
*/
changeElement: function(indexToHide, indexToShow)
```

```javascript
/**
* Show element in the list and fix the height of container
*
* @method showElement
* @param {Integer} indexPosition - index position in list to show
* @param {Function} callback
*/
showElement: function(indexPosition, callback) {
```

```javascript
/**
* Hide element in the list and fix the height of container
*
* @method hideElement
* @param {Integer} indexPosition - index position in list to hide
* @param {Boolean} noAnimateContainer - animate container
* @param {Function} callback
*/
hideElement: function(indexPosition, noAnimateContainer, callback)
```

"Properties"
------------
For now i only create a way to check if the element is in a proccess of animating.
To check just call as follow:

```javascript
// will return a boolean
$(element).data('_listAnimate').animationStopped;
```
