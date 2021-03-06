# imagepreview.js
A lightweight possibility to display images and galleries. Inspired by fancybox. Uses plain javascript, no dependencies.

## Usage
In order to use imagePreview.js, download the js, the css and the png files and include the js and css ones in your page:

````html
<link rel="stylesheet" type="text/css" href="imagePreview.css">
<script type="text/javascript" src="imagePreview.js"></script>
<script type="text/javascript">
    imagePreview();
</script>
````

You need to assign the CSS class `imagePreviewSource` to the `img` elements you wish to use for the preview / gallery.

Optionally, you can specify an external launcher element, such as a button, which launches the gallery on click, by setting its id to `imagePreviewLauncher`.

It is possible to deactivate that clicking the individual `img` elements themselves lauches the gallery, if you wish to go external-launcher-only. To do so, pass `true` as a parameter to `imagePreview`. If you pass `false` or omit the parameter, clicking the pictures themselves will launch the gallery as well, as I already mentioned.

Last but not least, passing `true` as a second parameter initializes imagePreview without relying on the `load` event of the `window` object, which can be useful when you are not calling imagePreview at page load.
