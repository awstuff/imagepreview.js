/**
 *	imagePreview - A simple function for creating a nice popup view and gallery of images, aka a basic fancybox clone.
 *	No dependencies, just plain native js
 *
 *
 *	Example code (within <head>):
 *
 *	<link rel="stylesheet" type="text/css" href="imagePreview.css">
 *	<script type="text/javascript" src="imagePreview.js"></script>
 *	<script type="text/javascript">
 *		imagePreview(false);
 *	</script>
 *
 *	Copyright 2016 Adrian Wirth
 *	Released under the MIT license
 */

function imagePreview (launcherOnly, notOnWinLoad) {
	if (launcherOnly !== true) {
		launcherOnly = false;
	}
	if (notOnWinLoad !== true) {
		notOnWinLoad = false;
	}

	var sourceImages = [];	// the actual image elements
	var body = null;	// the html body
	var img = null;		// the img element used within imagePreview
	var imgContainer = null;	// the container of said img element
	var previous = null;	// link to the previous image
	var next = null;	// link to the next image
	var toGoIndex = 0;	// index of the image chosen to display
	var previousSize = {
		height: -1,
		width: -1
	};
	var isFirstImageToBeShown = true;	// indicates that the image in question is the first to be shown in this preview

	/*
	 *	basic initialization and attachment of eventlisteners
	 */
	var initialize = function () {
		sourceImages = document.getElementsByClassName("imagePreviewSource");
		body = document.body;

		if (launcherOnly === false) {   // attach click listeners to the source images themselves
			for (var i = 0; i < sourceImages.length; i++) {
				sourceImages[i].addEventListener("click", function () {
					showPreview(this);
				});
			}
		}

		var imagePreviewLauncher = document.getElementById("imagePreviewLauncher");

		if (imagePreviewLauncher) { // attach click listener to the launcher
		    imagePreviewLauncher.addEventListener("click", function () {
				showPreview(sourceImages[0]);
			});
		}
	};

	if (notOnWinLoad) { // initialize instantly
		initialize();
	} else {
		window.addEventListener("load", function () {   // initialize deferred
			initialize();
		});
	}

	/*
	 *	close the open imagePreview
	 */
	function closePreview () {
		var overlay = document.getElementById("imagePreviewOverlay");
		if (!overlay) {
		    return;
		}

		overlay.style.opacity = 0;
		setTimeout(function () {	// wait for the opacity transition of the overlay to be over.
			body.removeChild(overlay);
		}, 500);

		var container = document.getElementById("imagePreviewContainer");	// important: there's a reason the imgContainer variable isn't used here
		if (!container) {
		    return;
		}

		body.removeChild(container);
		body.style.overflow = "";
		isFirstImageToBeShown = true;   // the next image is the first one
	}

	/*
	 *	Obtains the image url of the specified element, if possible by taking the src attribute, otherwise by taking (and trimming) the css backgroundImage
	 */
	function getSrc (element) {
		return element.src || element.style.backgroundImage.slice(4, -1).replace(/"|'/g, "");
	}

	/*
	 *	next/previous controls configuration
	 */
	function renderControls (index) {
	    toGoIndex = index;

		var isFirstImage = index === 0;
		var isLastImage = index === sourceImages.length - 1;

		previous.style.visibility = next.style.visibility = "";

		if (isFirstImage) {
			previous.style.visibility = "hidden";
		}

		if (isLastImage) {
			next.style.visibility = "hidden";
		}
	}

	/*
	 *	show the specified image and adjust the size of the imgContainer
	 */
	function renderImage (imgSource) {
	    img.style.opacity = 0;	// fade out the old image

		var doAllTheStuff = function () {
			img.style.maxWidth = img.style.minWidth = img.style.width = img.style.height = "";
			img.style.visibility = "hidden";

			imgContainer.style.width = "";
			imgContainer.style.height = "";

			img.setAttribute("src", imgSource);

			var originalSize = {
				height: img.offsetHeight,
				width: img.offsetWidth
			};

			var windowSize = {
				height: window.innerHeight || document.documentElement.clientHeight || body.clientHeight,
				width: window.innerWidth || document.documentElement.clientWidth || body.clientWidth
			};

			var heightIsSmallerThanWidth = windowSize.height < windowSize.width;

			var scale = {
				height: parseInt(0.85 * windowSize.height),
				width: parseInt(0.85 * windowSize.width)
			};

			var newSize = {};

			var setSizes = function (heightIsSmaller) {
				if (heightIsSmaller) {
					img.style.maxHeight = scale.height + "px";
					img.style.width = parseInt(originalSize.width * scale.height / originalSize.height) + "px";	// ie 9 and 10 need both height and width to be explicitly set
				} else {
					img.style.maxWidth = scale.width + "px";
					img.style.height = parseInt(originalSize.height * scale.width / originalSize.width) + "px";	// ie 9 and 10 need both height and width to be explicitly set
				}

				newSize = {
					height: img.offsetHeight,
					width: img.offsetWidth
				};
			};

			setSizes(heightIsSmallerThanWidth);

			if (newSize.height > windowSize.height || newSize.width > windowSize.width) {	// if one of the sizes exceeds the window size, recalculate
				setSizes(!heightIsSmallerThanWidth);    // yes, this is slightly hacky
			}

			imgContainer.style.width = newSize.width + "px";
			imgContainer.style.minWidth = newSize.width + "px";
			imgContainer.style.maxWidth = newSize.width + "px";
			imgContainer.style.height = newSize.height + "px";
			imgContainer.style.minHeight = newSize.height + "px";
			imgContainer.style.maxHeight = newSize.height + "px";

			if (isFirstImageToBeShown) {    // previousSize does not really exist in this case (no previous image)
				previousSize.height = newSize.height;
				previousSize.width = newSize.width;
				isFirstImageToBeShown = false;  // the next image is not the first one anymore
			}

			if (newSize.height === previousSize.height && newSize.width === previousSize.width) {   // no change in size
			    img.style.visibility = "visible";

			    getComputedStyle(img).opacity;  // force rerender

				//setTimeout(function () {	// weird hack for the opacity transition of the img to work
					img.style.opacity = 1;
				//}, 50);	// firefox needs a relatively high value for this to work
			} else {
				setTimeout(function () {	// wait for the width transition of the container to be over
					img.style.visibility = "visible";
					img.style.opacity = 1;
				}, 250);
			}

			previousSize.height = newSize.height;
			previousSize.width = newSize.width;
		};

		if (isFirstImageToBeShown) {    // there is no old image, so waiting is not necessary
			doAllTheStuff();
		} else {
			setTimeout(function () {	// wait for the opacity transition of the old image to be over
				doAllTheStuff();
			}, 250);
		}
	}

	/*
	 *	open the imagePreview and attach event listeners
	 */
	function showPreview (e) {
		var isValidIndex = function (index) {
			return index >= 0 && index < sourceImages.length;
		};

		var previousHandler = function () {	// move to the previous image
		    if (!isValidIndex(toGoIndex - 1)) {
		        return;
		    }

			toGoIndex--;
			renderImage(getSrc(sourceImages[toGoIndex]));
			renderControls(toGoIndex);
		};

		var nextHandler = function () {	// move to the next image
		    if (!isValidIndex(toGoIndex + 1)) {
		        return;
		    }

			toGoIndex++;
			renderImage(getSrc(sourceImages[toGoIndex]));
			renderControls(toGoIndex);
		};

		var pageHeight = Math.max(body.scrollHeight, body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

		body.style.overflow = "hidden";

		var overlay = document.createElement("div");
		overlay.setAttribute("id", "imagePreviewOverlay");
		overlay.style.height = pageHeight + "px";
		overlay.addEventListener("click", closePreview);

		imgContainer = document.createElement("div");
		imgContainer.setAttribute("id", "imagePreviewContainer");
		imgContainer.setAttribute("tabindex", -3);  // is this really necessary?
		imgContainer.style.visibility = "hidden";
		imgContainer.addEventListener("keydown", function (ev) {
			if (ev.keyCode === 27) {	// escape key
				closePreview();
			} else if (ev.keyCode === 37) {	// left arrow key
				previousHandler();
			} else if (ev.keyCode === 39) {	//right arrow key
				nextHandler();
			}
		});

		img = document.createElement("img");
		img.setAttribute("id", "imagePreviewImg");
		img.setAttribute("alt", "ImagePreview");

		var closeBox = document.createElement("div");
		closeBox.setAttribute("id", "imagePreviewCloseBox");
		closeBox.addEventListener("click", closePreview);

		previous = document.createElement("div");
		previous.setAttribute("id", "imagePreviewPrevious");
		previous.style.visibility = "hidden";
		previous.addEventListener("click", previousHandler);

		next = document.createElement("div");
		next.setAttribute("id", "imagePreviewNext");
		next.style.visibility = "hidden";
		next.addEventListener("click", nextHandler);

		imgContainer.appendChild(img);
		imgContainer.appendChild(closeBox);
		imgContainer.appendChild(previous);
		imgContainer.appendChild(next);

		body.appendChild(overlay);
		body.appendChild(imgContainer);

		overlay.style.opacity = 0;

		getComputedStyle(overlay).opacity;  // force rerender

		//setTimeout(function () {	// weird hack for the opacity transition of the overlay to work
			overlay.style.opacity = 0.7;
			renderImage(getSrc(e));
			renderControls(Array.prototype.indexOf.call(sourceImages, e));
			imgContainer.style.visibility = "";
			imgContainer.focus();
		//}, 50);	// firefox needs a relatively high value for this to work
	}
}
