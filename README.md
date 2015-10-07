# imagepreview.js
A lightweight possibility to  preview single images and display entire galleries. Aka a basic fancybox clone. Uses plain javascript, no dependencies.

## Usage
In order to use imagePreview.js, download the js, the css and the png files and include the js and css ones in your page:

````html
<link rel="stylesheet" type="text/css" href="imagePreview.css">
<script type="text/javascript" src="imagePreview.js"></script>
<script type="text/javascript">
    imagePreview(false);
</script>
````

You need to assign the CSS class `imagePreviewSource` to the `img` elements you wish to use for the preview / gallery.

Optionally, you can specify an external launcher element, such as a button, which launches the gallery (duh), by setting its id to `imagePreviewLauncher`.

It is possible to deactivate that clicking the individual `img` elements themselves lauches the gallery, if you wish to go external-launcher-only. To do so, pass `true` as a parameter to `imagePreview` (or just omit the parameter). If you pass `true`, clicking the pictures themselves will launch the gallery as well, as I already mentioned.

Last but not least, passing `true` as a second parameter initializes imagePreview without relying on the `load` event of the `window` object, which can be useful when you are not calling imagePreview at page load.
