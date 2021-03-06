(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Ripple = factory());
}(this, (function () { 'use strict';

function createRippleNode (_ref) {
    var top = _ref.top,
        left = _ref.left,
        width = _ref.width,
        height = _ref.height,
        pageX = _ref.pageX,
        pageY = _ref.pageY,
        cssNameSpace = _ref.cssNameSpace,
        background = _ref.background,
        duration = _ref.duration;

    var $rippleNode = document.createElement('div');
    $rippleNode.className = cssNameSpace;

    var radius = Math.sqrt(width * width + height * height);
    var diameter = 2 * radius;

    $rippleNode.style.width = diameter + 'px';
    $rippleNode.style.height = diameter + 'px';
    $rippleNode.style.borderRadius = diameter + 'px';
    $rippleNode.style.left = pageX - left - radius + 'px';
    $rippleNode.style.top = pageY - top - radius + 'px';
    $rippleNode.style.background = background;
    $rippleNode.style.transitionDuration = duration + 'ms';
    $rippleNode.className = cssNameSpace + '--ready';
    return $rippleNode;
}

function createContainerNode (cssNameSpace) {
    var $containerNode = document.createElement('div');
    $containerNode.className = cssNameSpace + '-container';
    return $containerNode;
}

function touchStart (event) {
    event.stopPropagation();
    var $el = event.currentTarget;
    if ('true' === $el.dataset.rippleIsDisabled) {
        return;
    }

    var options = {
        cssNameSpace: $el.dataset.rippleCssNameSpace,
        background: $el.dataset.rippleBackground,
        duration: $el.dataset.rippleDuration
    };

    if (!$el.dataset.ripplePosition) {
        var position = getComputedStyle($el).position;
        $el.dataset.ripplePosition = position;
    }

    $el.dataset.rippleCancel = 'false';

    if (!/absolute|relative|fixed|sticky/.test($el.dataset.ripplePosition)) {
        $el.style.position = 'relative';
    }

    var $containerNode = void 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = $el.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var childNode = _step.value;

            if (options.cssNameSpace + '-container' === childNode.className) {
                $containerNode = childNode;
                break;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var _$el$getBoundingClien = $el.getBoundingClientRect(),
        top = _$el$getBoundingClien.top,
        left = _$el$getBoundingClien.left,
        width = _$el$getBoundingClien.width,
        height = _$el$getBoundingClien.height;

    var points = event.touches;
    var pageX = points[0].pageX;
    var pageY = points[0].pageY;

    var $rippleNode = createRippleNode({
        top: top,
        left: left,
        width: width,
        height: height,
        pageX: pageX,
        pageY: pageY,
        cssNameSpace: options.cssNameSpace,
        background: options.background,
        duration: options.duration
    });

    var transitionendCount = 0;
    var removeRippleNode = function removeRippleNode(event) {
        event.stopPropagation();
        if (0 === transitionendCount) {
            $containerNode.removeChild($rippleNode);
        }
        transitionendCount++;
    };
    $rippleNode.addEventListener('transitionend', removeRippleNode);
    $rippleNode.addEventListener('webkitTransitionEnd', removeRippleNode);

    if (!$containerNode) {
        $containerNode = createContainerNode(options.cssNameSpace);

        $el.appendChild($containerNode);
    }

    $containerNode.appendChild($rippleNode);
}

function touchMove (event) {
    event.stopPropagation();
    var $el = event.currentTarget;

    if ('true' === $el.dataset.rippleIsDisabled) {
        return;
    }
    $el.dataset.rippleCancel = 'true';
}

function touchEnd (event) {
    event.stopPropagation();
    var points = event.touches;
    var $el = event.currentTarget;

    if ('true' === $el.dataset.rippleIsDisabled) {
        return;
    }

    var options = {
        cssNameSpace: $el.dataset.rippleCssNameSpace
    };
    var $rippleNode = $el.querySelector('.' + options.cssNameSpace + '--ready');
    if ('true' == $el.dataset.rippleCancel) {
        $rippleNode.remove();
    } else {
        $rippleNode.className = options.cssNameSpace + '--start';
    }
}

var cssNameSpace = 'ripple';
var duration = 600;
var background = 'currentColor';
var zIndex = 1;
var isDisabled = false;

var defaultConfig = {
    cssNameSpace: cssNameSpace,
    background: background,
    duration: duration,
    zIndex: zIndex,
    isDisabled: isDisabled
};

var runRipple = function runRipple(el, binding) {
    var cssNameSpace = defaultConfig.cssNameSpace,
        background = defaultConfig.background,
        duration = defaultConfig.duration;

    var bindingValue = binding.value || {};

    el.dataset.rippleBackground = bindingValue.background || background;
    el.dataset.rippleDuration = bindingValue.duration || duration;
    el.dataset.rippleIsDisabled = false === bindingValue || bindingValue.isDisabled;
    el.dataset.rippleCssNameSpace = bindingValue.cssNameSpace || cssNameSpace;

    el.addEventListener('touchstart', touchStart);
    el.addEventListener('touchmove', touchMove);
    el.addEventListener('touchend', touchEnd);
};

var plugin = {
    install: function install(Vue) {
        Vue.directive('ripple', {
            inserted: function inserted(el, binding) {
                runRipple(el, binding);
            },
            componentUpdated: function componentUpdated(el, binding) {
                runRipple(el, binding);
            },
            unbind: function unbind(el) {
                el.removeEventListener('touchstart', touchStart);
                el.removeEventListener('touchmove', touchMove);
                el.removeEventListener('touchend', touchEnd);
            }
        });
    }
};
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

return plugin;

})));
