# `<video>` and `<audio>` made easy. One file. Any browser. Same UI.

* Author: John Dyer [http://j.hn/](http://j.hn/)
* Website: [http://mediaelementjs.com/](http://mediaelementjs.com/)
* License: GPLv2/MIT
* Meaning: Please use this everywhere and it'd be swell if you'd 
link back here.
* Thanks: my employer, [Dallas Theological Seminary](http://www.dts.edu/)
* Contributors: [mikesten](https://github.com/mikesten), [sylvinus](https://github.com/sylvinus), [mattfarina](https://github.com/mattfarina), [romaninsh](https://github.com/romaninsh), [fmalk](https://github.com/fmalk), [jeffrafter](https://github.com/jeffrafter), [sompylasar](https://github.com/sompylasar), [andyfowler](https://github.com/andyfowler), [RobRoy](https://github.com/RobRoy), [jakearchibald](https://github.com/jakearchibald), [seanhellwig](https://github.com/seanhellwig), [CJ-Jackson](https://github.com/CJ-Jackson), [kaichen](https://github.com/kaichen), [gselva](https://github.com/gselva), [erktime](https://github.com/erktime), [bradleyboy](https://github.com/bradleyboy), [kristerkari](https://github.com/kristerkari), [rmhall](https://github.com/rmhall), [tantalic](https://github.com/tantalic), [madesign](http://github.com/madesign), [aschempp](http://github.com/aschempp), [gavinlynch](https://github.com/gavinlynch), [Birol2010](http://github.com/Birol2010)


## Installation and Usage

_MediaElementPlayer: HTML5 `<video>` and `<audio>` player_

A complete HTML/CSS audio/video player built on top `MediaElement.js` and `jQuery`. Many great HTML5 players have a completely separate Flash UI in fallback mode, but MediaElementPlayer.js uses the same HTML/CSS for all players.

### 1. Add Script and Stylesheet

	<script src="jquery.js"></script>
	<script src="mediaelement-and-player.min.js"></script>
	<link rel="stylesheet" href="mediaelementplayer.css" />

### 2. Option A: Single H.264 file

If your users have JavaScript and Flash, this is the easist route for all browsers and mobile devices.
	
	<video src="myvideo.mp4" width="320" height="240"></video>

### 2. Option B: Multiple codecs with Flash fall-through when JavaScript is disabled

This includes multiple codecs for various browsers (H.264 for IE and Safari, WebM for Chrome, Firefox 4, and Opera, Ogg for Firefox 3) as well as a Flash fallback for non HTML5 browsers with JavaScript disabled.

	<video width="320" height="240" poster="poster.jpg" controls="controls" preload="none">
		<source type="video/mp4" src="myvideo.mp4" />
		<source type="video/webm" src="myvideo.webm" />
		<source type="video/ogg" src="myvideo.ogv" />
		<object width="320" height="240" type="application/x-shockwave-flash" data="flashmediaelement.swf">
			<param name="movie" value="flashmediaelement.swf" /> 
			<param name="flashvars" value="controls=true&amp;poster=myvideo.jpg&amp;file=myvideo.mp4" /> 		
			<img src="myvideo.jpg" width="320" height="240" title="No video playback capabilities" />
		</object>
	</video>

### 3. Run startup script

Make sure this is not in the `<head>` tag or iOS 3 will fail.

	<script>
	// jQuery method
	$('video').mediaelementplayer();
	</script>
	
	<script>
	// normal JavaScript 
	var player = new MediaElementPlayer('#player');
	</script>	

## How it Works: 
_MediaElement.js: HTML5 `<video>` and `<audio>` shim_

`MediaElement.js` is a set of custom Flash and Silverlight plugins that mimic the HTML5 MediaElement API for browsers that don't support HTML5 or don't support the media codecs you're using. 
Instead of using Flash as a _fallback_, Flash is used to make the browser seem HTML5 compliant and enable codecs like H.264 (via Flash) and even WMV (via Silverlight) on all browsers.

	<script src="mediaelement.js"></script>
	<video src="myvideo.mp4" width="320" height="240"></video>
	
	<script>
	var v = document.getElementsByTagName("video")[0];
	new MediaElement(v, {success: function(media) {
		media.play();
	}});
	</script>

You can use this as a standalone library if you wish, or just stick with the full MediaElementPlayer.