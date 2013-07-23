/*!
 * jQuery List Animate 0.2.0
 *
 * http://www.agenciaeffect.com.br
 *
 * Copyright 2013 Agência Effect
 * Released under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
	$.fn.listAnimate = function(settings) {
		var defaultSettings = {
			// calculo sendo feito pela altura ou largura
			orientation: 'vertical',
			// como mostrar o element que aparecerá
			showAnimate: 'slideToRight',
			// como esconder o elemento que vai sair da lista
			hideAnimate: 'slideToLeft',
			// tempo para as animações
			timeAnimateShow: 1000,
			timeAnimateHide: 1000,
			// calbacks
			onElementHide: function() {},
			onBeforeInit: function() {},
		};

		var settings = $.extend({}, defaultSettings, settings);

		return this.each(function() {
			var listAnimate = new ListAnimate($(this), settings);
			listAnimate.init();
			$(this).data('_listAnimate', listAnimate);
			$(this).data('_listAnimate').animationStopped = true;
		});
	};

	function ListAnimate(element, settings) {
		this.settings = settings;
		this.element = element;
		return this;
	}

	ListAnimate.prototype = {
		/*
		 * Inicia o sistema no container
		 * Define a posição de cada elemento e adiciona um atributo data-index que contém a posição dele dentro do container
		 */
		init: function() {
			this.settings.onBeforeInit.call();
			var _self = this;
			if (this.settings.orientation == 'vertical') {
				var topDistance = 0;
				var elementsToCalculate = this.element.find('> *');
				var elementsAnimated = 0;
				elementsToCalculate.each(function(index) {
					if ($(this).is(':visible')) {
						$(this).css({
							top: topDistance
						});
						topDistance += $(this).outerHeight(true);
					}
					$(this).attr('data-index', index);
					$(this).css('position', 'absolute');
				});

				_self.element.css('height', _self.getTotalHeight());
			}
		},
		/*
		 * Troca um elemento.
		 * Recebe o index de um elemento pra sair e o que vai aparecer
		 * index iniciam com 0
		 */
		changeElement: function(indexToHide, indexToShow) {
			var _self = this;
			_self.element.data('_listAnimate').animationStopped = false;
			_self.hideElement(indexToHide, true, function() {
				_self.showElement(indexToShow, function(){
					_self.element.data('_listAnimate').animationStopped = true;
				});
			});
		},

		/*
		 * Esconde um elemento e reposiciona a lista
		 */
		hideElement: function(indexPosition, noAnimateContainer, callback) {
			var _self = this;
			var elementCache = this.element.find('li').eq(indexPosition);
			if (elementCache.is(':visible')) {
				if (this.settings.hideAnimate == 'slideToLeft') {
					if (noAnimateContainer === undefined) {
						var timeToEachIteration = parseInt(_self.settings.timeAnimateHide / 3);
					} else {
						var timeToEachIteration = parseInt(_self.settings.timeAnimateHide / 2);
					}
					var animateParams = {
						left: -elementCache.outerWidth(true),
					}
					elementCache.clearQueue().animate(animateParams, timeToEachIteration, function() {
						$(this).css('display', 'none');
						var elementsToCalculate = _self.element.find('> *:visible');
						var topDistance = 0;
						var elementsAnimated = 0;
						elementsToCalculate.each(function() {
							$(this).clearQueue().animate({
								top: topDistance,
							}, timeToEachIteration, function() {
								elementsAnimated++;
								if (elementsAnimated == elementsToCalculate.length) {
									if (noAnimateContainer === undefined) {
										_self.element.clearQueue().animate({
											height: _self.getTotalHeight(),
										}, timeToEachIteration, function() {
											if (typeof callback == 'function') {
												callback.call();
											}
										});
									} else {
										if (typeof callback == 'function') {
											callback.call();
										}
									}
								}
							});
							topDistance += $(this).outerHeight(true);
						});
					});
				}
			}
		},

		/*
		 * Mostra um elemento e reposiciona os elementos que estão depois dele
		 */
		showElement: function(indexPosition, callback) {
			var _self = this;
			if (_self.settings.showAnimate == 'slideToRight') {
				var elementCache = _self.element.find('li').eq(indexPosition);
				if (elementCache.not(':visible')) {
					var nextElements = elementCache.nextAll();
					if (nextElements.length > 0) {
						timeToEachIteration = parseInt(_self.settings.timeAnimateShow / 3);
					} else {
						timeToEachIteration = parseInt(_self.settings.timeAnimateShow / 2);
					}

					elementCache.css('display', 'block');

					// Aumenta a altura do container
					_self.element.clearQueue().animate({
						height: _self.getTotalHeight(),
					}, timeToEachIteration, function() {

						// define o Top do elemento a ser mostrado
						var prevElement = elementCache.prevAll(':visible');
						var totalHeightPrevElements = 0;
						prevElement.each(function() {
							totalHeightPrevElements += $(this).outerHeight(true);
						});
						elementCache.css('top', totalHeightPrevElements);

						// se existir elementos depois do elemento a ser mostrado ele anima eles também
						if (nextElements.length > 0) {
							var nextElementsAnimated = 0;
							nextElements.each(function() {
								var cssTopElement = parseInt($(this).css('top'));
								$(this).clearQueue().animate({
									top: isNaN(cssTopElement) ? 0 : cssTopElement + elementCache.outerHeight(true)
								}, timeToEachIteration, function() {
									nextElementsAnimated++;
									// último elemento animado, mostra o elemento a ser mostrado
									if (nextElementsAnimated = nextElements.length) {
										elementCache.clearQueue().animate({
											left: 0,
										}, timeToEachIteration, function() {
											if (typeof callback == 'function') {
												callback.call();
											}
										});
									}
								});
							});
						} else {
							elementCache.clearQueue().animate({
								left: 0,
							}, timeToEachIteration, function() {
								if (typeof callback == 'function') {
									callback.call();
								}
							});
						}
					});
				}
			}
		},

		getTotalHeight: function() {
			var totalHeight = 0;
			this.element.find('> *:visible').each(function() {
				totalHeight += $(this).outerHeight(true);
			});
			return totalHeight;
		},
	}
})(jQuery);