const draggable = pane => {
	/*
 * @author https://twitter.com/blurspline / https://github.com/zz85
 * See post @ http://www.lab4games.net/zz85/blog/2014/11/15/resizing-moving-snapping-windows-with-js-css/
 */

	// Minimum resizable area
	var minWidth = 60;
	var minHeight = 40;

	// Thresholds
	var FULLSCREEN_MARGINS = -10;
	var MARGINS = 4;

	// End of what's configurable.
	var clicked = null;
	var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

	var rightScreenEdge, bottomScreenEdge;

	var preSnapped;

	var b, x, y;

	var redraw = false;

	function setBounds(element, x, y, w, h) {
		element.style.left = x + 'px';
		element.style.top = y + 'px';
		element.style.width = w + 'px';
		element.style.height = h + 'px';
	}

	// Mouse events
	pane.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mousemove', onMove);
	document.addEventListener('mouseup', onUp);

	// Touch events
	pane.addEventListener('touchstart', onTouchDown);
	document.addEventListener('touchmove', onTouchMove);
	document.addEventListener('touchend', onTouchEnd);

	function onTouchDown(e) {
		onDown(e.touches[0]);
		e.preventDefault();
	}

	function onTouchMove(e) {
		onMove(e.touches[0]);
	}

	function onTouchEnd(e) {
		if (e.touches.length == 0) onUp(e.changedTouches[0]);
	}

	function onMouseDown(e) {
		onDown(e);
		e.preventDefault();
	}

	function onDown(e) {
		calc(e);

		var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;

		clicked = {
			x: x,
			y: y,
			cx: e.clientX,
			cy: e.clientY,
			w: b.width,
			h: b.height,
			isResizing: isResizing,
			isMoving: !isResizing && canMove(),
			onTopEdge: onTopEdge,
			onLeftEdge: onLeftEdge,
			onRightEdge: onRightEdge,
			onBottomEdge: onBottomEdge,
		};
	}

	function canMove() {
		return x > 0 && x < b.width && y > 0 && y < b.height && y < 30;
	}

	function calc(e) {
		b = pane.getBoundingClientRect();
		x = e.clientX - b.left;
		y = e.clientY - b.top;

		onTopEdge = y < MARGINS;
		onLeftEdge = x < MARGINS;
		onRightEdge = x >= b.width - MARGINS;
		onBottomEdge = y >= b.height - MARGINS;

		rightScreenEdge = window.innerWidth - MARGINS;
		bottomScreenEdge = window.innerHeight - MARGINS;
	}

	var e;

	function onMove(ee) {
		calc(ee);

		e = ee;

		redraw = true;
	}

	function animate() {
		requestAnimationFrame(animate);

		if (!redraw) return;

		redraw = false;

		if (clicked && clicked.isResizing) {
			if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + 'px';
			if (clicked.onBottomEdge)
				pane.style.height = Math.max(y, minHeight) + 'px';

			if (clicked.onLeftEdge) {
				var currentWidth = Math.max(
					clicked.cx - e.clientX + clicked.w,
					minWidth
				);
				if (currentWidth > minWidth) {
					pane.style.width = currentWidth + 'px';
					pane.style.left = e.clientX + 'px';
				}
			}

			if (clicked.onTopEdge) {
				var currentHeight = Math.max(
					clicked.cy - e.clientY + clicked.h,
					minHeight
				);
				if (currentHeight > minHeight) {
					pane.style.height = currentHeight + 'px';
					pane.style.top = e.clientY + 'px';
				}
			}

			return;
		}

		if (clicked && clicked.isMoving) {
			// moving
			pane.style.top = e.clientY - clicked.y + 'px';
			pane.style.left = e.clientX - clicked.x + 'px';

			return;
		}

		// This code executes when mouse moves without clicking

		// style cursor
		if ((onRightEdge && onBottomEdge) || (onLeftEdge && onTopEdge)) {
			pane.style.cursor = 'nwse-resize';
		} else if ((onRightEdge && onTopEdge) || (onBottomEdge && onLeftEdge)) {
			pane.style.cursor = 'nesw-resize';
		} else if (onRightEdge || onLeftEdge) {
			pane.style.cursor = 'ew-resize';
		} else if (onBottomEdge || onTopEdge) {
			pane.style.cursor = 'ns-resize';
		} else if (canMove()) {
			pane.style.cursor = 'move';
		} else {
			pane.style.cursor = 'default';
		}
	}

	animate();

	function onUp(e) {
		calc(e);

		if (clicked && clicked.isMoving) {
			// Snap

			preSnapped = null;
		}

		clicked = null;
	}
};

const $curtain = document.createElement('x-curtain');
const $header = document.createElement('x-curtain-header');
const $blinds = document.createElement('x-curtain-blinds');
const $string = document.createElement('x-curtain-string');

const [$blindLeft, $blindRight] = [
	document.createElement('x-curtain-blind'),
	document.createElement('x-curtain-blind'),
];

document.body.appendChild($curtain);
[$header, $blinds, $string].forEach(_ => $curtain.appendChild(_));
[$blindLeft, $blindRight].forEach(_ => $blinds.appendChild(_));

$curtain.style.height = '200px';
$curtain.style.width = '200px';
$curtain.style.top = '200px';
$curtain.style.left = '200px';

$string.addEventListener('click', ev => {
	$curtain.classList.toggle('open');
});

draggable($curtain);
