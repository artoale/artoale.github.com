---
layout: post
title:  "Writing Brackets extension - part 1"
date:   2013-09-30 17:35:42
categories: tutorial brackets
img: brackets_logo.svg
---

As web developers and lovers, we all have tried different tools, IDE and text editors to improve our daily workflow and enjoy writing exciting web app more and more. Apart from the old-fashioned vim/emacs lover, most of us currently use either [Sublime Text][sublime] (with its great collection of plugin) or [WebStorm][webstorm]. Both have great features, plugins and support but there's a new player that is going to change the rules: [Adobe Brackets][brackets]

To summarize why I think Brackets, in a couple of quarter, is winning the web editors challange:

1. Dude, it's open source! Yep, even if developed and supported by Adobe, brackets is completely open source (and please, don't ask me why open is better)
2. Bracket itself IS a web app: it's built with all the technologies we love, HTML, CSS and javascript and runs in a chromium shell so yes, if you're a web developer, you can help improving it (by, for instance, writing an extension!)
3. Even if it's not in alpha yet, is already pretty stable, a lot of extensions have been developed and it ships with some cool and peculiar features itself (quick edit, live developement, tern code intelligence, jslint, sass support and so on)

Ok. Got it. It's nice. But it's missing &lt;THIS FEATURE&gt;!
Right, me too. Let's add it, right now!

##Always start with ponies

If the internet teached us something is that there are never enough ponies and unicorns around - and that certainly applies to brackets too. Let's add some sparkling happyness to our new web editor!

###Project set-up

First thing to do (after installing and enjoying brackets, of course) is to locate the extension folder. Just go to `Help > Show extensions folder` from the menu. It should be something like `~/Library/Application Support/brackets/extensions` for Mac and `C:\Users\<Your Username>\AppData\Roaming\Brackets\extensions` for Windows.

Go into the `user` subfolder and create our new project root: `cornify-brackets`.
What you need at this point are just two files:

1. `main.js`: the javascript file that contain the startup code for the extension
2. `package.json`: defining all the relevant metadata for our project (extension name, version number, repository etc...)


Let's start with the latter:
{% highlight json %}
{
    "name": "cornify-brackets",
    "title": "Cornify",
    "description": "add",
    "homepage": "http://artoale.com{{page.url}}",
    "version": "0.0.1",
    "author": "Alessandro Artoni <artoale@gmail.com> (https://github.com/artoale)",
    "license": "MIT",
    "engines": {
        "brackets": ">=0.31.0"
    }
}
{% endhighlight %}

The format is quite straightforward, especially for those who already have some experihence with node.js and npm since the format is almost exactly the same. All these information will become particularly useful for when we'll publish our extension.

Ready to write some code? Sorry, just a few moments. Before we can start coding you have to know that brackets extension use the [AMD CommonJS Wrapper](http://requirejs.org/docs/api.html#cjsmodule). Which means that your code will be wrapped in a callback passed to the `define` global function. Inside that callback you'll be passed in three object: `require`: a function for managing your own dependencies, `exports` and `module`, to be used exclusively, which allow to expose functionality to the rest of the world.

Ok, that said, we're ready to go!

###Main.js structure

Let's start with the backbone definition of our plugin:
{% highlight javascript %}
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

/** Simple extension that adds a "File > Hello World" menu item */
define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule("utils/AppInit");


    AppInit.appReady(function () {
        //...
    });
});

{% endhighlight %}

From this code you can already undestand some important concepts:

####Globals
From within your code, you've access to some global variables:

1. `window`: The browser global object. If, as likely, you're a web developer, you're already familiar with this.
2. `brackets`: Used to access all brackets specific functionalities and submodules (in particular the `brackets.getModule` function allows you to retrieve the module you need - as defined in brackets source code).
3. `Mustache`: Brackets uses [Mustache][] as a templating language, which means that....you can use it!
4. `$` and `jQuery`: Yes, nobody like DOM manipulation (do you?) fortunately, [jQuery][] (v2.0+) comes embedded within the editor to relieve you from that pain!
5. `define`: we've already seen that :)

####Plugin Initialization
When we write a piece of code that runs in the browser, we usually listen (directly or not) to the `document.onload` event, to be sure that all the HTML has been parsed, the images are loaded and the DOM is ready. Since brackets needs to do some more complicated stuff at startup, registering an event on the onload event is not safe, part of the editor may not be loaded yet (requirejs is used for loading modules and it'is asyncronous) and you may not be able to access all the functionality you need. For that reason good guys brackets developers has gifted us with the `utils/AppInint` module. Our inizialization code should be passed as a callback to its `appReady` event (and not the `htmlReady`, since it's ***always*** fired before plugins are loaded!).





[sublime]: http://www.sublimetext.com/
[webstorm]: http://www.jetbrains.com/webstorm/
[brackets]: http://brackets.io
[Mustache]: https://github.com/janl/mustache.js/
[jQuery]: http://jquery.com/
