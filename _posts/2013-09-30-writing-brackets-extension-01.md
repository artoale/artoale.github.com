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

Right, let's add it, right now!

##Always start with ponies

If the internet teached us something is that there are never enough ponies and unicorns around - and that certainly applies to brackets too. Let's add some sparkling happiness to our new web editor! (Many thanks to my dear friend [Paolo Chillari](https://github.com/flea89) for suggestion the topic of this very first tutorial!)

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


#### Let's try it!

Yeah, but...it does nothing!

Ok, just add a line to the `appReady` callback:

```javascript
    AppInit.appReady(function () {
        console.log("I'm a fabulous unicorn!");
    });
```
Our v0.0.1 is ready to go! Restart brackets via `Debug > Reload Brackets` or `Cmd+R` on Mac and open the dev tools to see the magic!

Oh, damn it. I forgot to tell you - yep, this may sound crazy but even the debugging tool your used to when writing web app are available for Brackets, including Chromium Developer Tools. Just go on `Debug > Show developer tools`(`Cmd+alt+I` on Mac) and open the console tab. You should be able to see the *"I'm a unicorn"* text right there.

Nice, isn't it? But, as you may have noticed...this doesn't really look like a unicorn, sadly it's just a sentence.
How can we improve that?

###Loading static files with require.js

Require.js and AMD in general are great for building structured, modular code...but there's another interesting feature: static file loading.
It's very usefull when you need to load non-js resource like **template** or like in our case....unicorns!

Let's start with some fabulousness [ASCII-ART](http://www.ascii-art.de/)

add a `lib` folder inside your project root and create a text file inside it (let's call it `unicorn.txt`).
Now we're ready for some real goodness.

````
                                                    /
                                                  .7
                                       \       , //
                                       |\.--._/|//
                                      /\ ) ) ).'/
                                     /(  \  // /
                                    /(   J`((_/ \
                                   / ) | _\     /
                                  /|)  \  eJ    L
                                 |  \ L \   L   L
                                /  \  J  `. J   L
                                |  )   L   \/   \
                               /  \    J   (\   /
             _....___         |  \      \   \```
      ,.._.-'        '''--...-||\     -. \   \
    .'.=.'                    `         `.\ [ Y
   /   /                                  \]  J
  Y / Y                                    Y   L
  | | |          \                         |   L
  | | |           Y                        A  J
  |   I           |                       /I\ /
  |    \          I             \        ( |]/|
  J     \         /._           /        -tI/ |
   L     )       /   /'-------'J           `'-:.
   J   .'      ,'  ,' ,     \   `'-.__          \
    \ T      ,'  ,'   )\    /|        ';'---7   /
     \|    ,'L  Y...-' / _.' /         \   /   /
      J   Y  |  J    .'-'   /         ,--.(   /
       L  |  J   L -'     .'         /  |    /\
       |  J.  L  J     .-;.-/       |    \ .' /
       J   L`-J   L____,.-'`        |  _.-'   |
        L  J   L  J                  ``  J    |
        J   L  |   L                     J    |
         L  J  L    \                    L    \
         |   L  ) _.'\                    ) _.'\
         L    \('`    \                  ('`    \
          ) _.'\`-....'                   `-....'
         ('`    \
          `-.___/
```

Copy-pase the text above in the `unicorn.txt`file and load it into our javascript file...how? By using the require function described before.
In order to load static file with require js we have to specify their format before the file path in the call to the require function.
In our case the string become `text!lib/unicorn.txt`: we're loading a text file called `unicorn.txt` inside the `lib`folder (relative to our extension root).
Edit your `main.js` in order to look something like this:

```javascript
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule('utils/AppInit'),
        unicornAscii = require('text!lib/unicorn.txt');


    AppInit.appReady(function () {
        console.log(unicornAscii);
    });
});
```
Save everything and `Cmd+R` again: you should now see a beautiful unicorn bringing you some happiness to the dev tools.

##Adding a menu command

Yeah, this is already pretty good, we've got unicorns in our editors...but we cannot add more!
Luckly, Brackets give you the ability to add create custom commands and add them to the main menus (and even to create new ones, if you really have to). That said, we're speaking about commands and menus....what shall we need? But it's easy, the `CommandManager` and the `Menus` modules.

They both expose a lot of menu and constant to work with this stuff, but for now, let's focus to what we need to add more unicorns (if you want a broader overview of what commands offers in terms of API, have a look at the `src/command`directory, brackets source code, and spot the **exports**).

For our purpose, we only need a couple of method:

1. `CommandManager.register` allow us to register a new command inside brackets. This method requires (in order) the command name used to create the menu item, a command identifier string (which should be unique) and a function that will be executed when your command is run.
2. `Menus.getMenu` is used to retrieve the menu instance to which we want to add our command...since adding ponies is very helpfull, from now on we'll be considering `helpMenu` the one we're going to use.
3. `helpMenu.addMenuItem` is, as you may immagine, the method we will use to add our command to the editor

Ready? first start with loading the right module from Brackets core and define a constant to identify our command:

```javascript
var CommandManager = brackets.getModule("command/CommandManager"),
            Menus  = brackets.getModule("command/Menus"),
            CORNIFY_CMD_ID = "artoale.cornify";
```

Note that the ID I've picked is **scoped**, in order to avoid name collision with other extensions.

Now we have everything we need to write our new command and register it

```javascript
var cornify = function () {
    console.log(unicornAscii);
}
//...in AppInit
CommandManager.register("Gimme some love", CORNIFY_CMD_ID, cornify);
var helpMenu = Menus.getMenu(Menus.AppMenuBar.HELP_MENU);
helpMenu.addMenuItem(CORNIFY_CMD_ID);
```


If you put everything correctly together you should finally have something like this

```javascript
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule('utils/AppInit'),
        CommandManager = brackets.getModule("command/CommandManager"),
        Menus  = brackets.getModule("command/Menus"),
        CORNIFY_CMD_ID = "artoale.cornify",
        unicornAscii = require('text!lib/unicorn.txt');


    var cornify = function () {
        console.log(unicornAscii);
    };


    AppInit.appReady(function () {
        var helpMenu = Menus.getMenu(Menus.AppMenuBar.HELP_MENU);

        CommandManager.register("Gimme some love", CORNIFY_CMD_ID, cornify);
        helpMenu.addMenuItem(CORNIFY_CMD_ID);
    });
});
```

Once again, reload brackets.

You should now see in the `Help` menu our newly created voice. Hit the button and have a look! Now we can create endless unicorns!

##Make it glitter

Things are getting interesting now. We have a nice unicorn displaying in our dev console....but what about the main IDE? We don't want to switch to the dev tool each time we need some happiness!

Fortunately, there's a nice piece of javascript (one of the best piece of code ever written) that can help us: [Cornify][]

Create a new file inside your lib subdir and call it `cornify.js`. I've prepared for you a slightly modified version wich include support for require.js: really, it's just the original code wrapped within the `define` call and globals made locals and assigned as property of the `exports` object. We don't really care about it's implementation (as long as it provide us with sparkly happiness) so just copy and paste the code below.

```javascript
define(function (require, exports, module) {
    var cornify_count = 0;
    var cornify_add = function () {
        cornify_count += 1;
        var cornify_url = 'http://www.cornify.com/';
        var div = document.createElement('div');
        div.style.position = 'fixed';

        var numType = 'px';
        var heightRandom = Math.random() * .75;
        var windowHeight = 768;
        var windowWidth = 1024;
        var height = 0;
        var width = 0;
        var de = document.documentElement;
        if (typeof (window.innerHeight) == 'number') {
            windowHeight = window.innerHeight;
            windowWidth = window.innerWidth;
        } else if (de && de.clientHeight) {
            windowHeight = de.clientHeight;
            windowWidth = de.clientWidth;
        } else {
            numType = '%';
            height = Math.round(height * 100) + '%';
        }

        div.onclick = cornify_add;
        div.style.zIndex = 10;
        div.style.outline = 0;

        if (cornify_count == 15) {
            div.style.top = Math.max(0, Math.round((windowHeight - 530) / 2)) + 'px';
            div.style.left = Math.round((windowWidth - 530) / 2) + 'px';
            div.style.zIndex = 1000;
        } else {
            if (numType == 'px') div.style.top = Math.round(windowHeight * heightRandom) + numType;
            else div.style.top = height;
            div.style.left = Math.round(Math.random() * 90) + '%';
        }

        var img = document.createElement('img');
        var currentTime = new Date();
        var submitTime = currentTime.getTime();
        if (cornify_count == 15) submitTime = 0;
        img.setAttribute('src', cornify_url + 'getacorn.php?r=' + submitTime + '&url=' + document.location.href);
        var ease = "all .1s linear";
        //div.style['-webkit-transition'] = ease;
        //div.style.webkitTransition = ease;
        div.style.WebkitTransition = ease;
        div.style.WebkitTransform = "rotate(1deg) scale(1.01,1.01)";
        //div.style.MozTransition = "all .1s linear";
        div.style.transition = "all .1s linear";
        div.onmouseover = function () {
            var size = 1 + Math.round(Math.random() * 10) / 100;
            var angle = Math.round(Math.random() * 20 - 10);
            var result = "rotate(" + angle + "deg) scale(" + size + "," + size + ")";
            this.style.transform = result;
            //this.style['-webkit-transform'] = result;
            //this.style.webkitTransform = result;
            this.style.WebkitTransform = result;
            //this.style.MozTransform = result;
            //alert(this + ' | ' + result);
        }
        div.onmouseout = function () {
            var size = .9 + Math.round(Math.random() * 10) / 100;
            var angle = Math.round(Math.random() * 6 - 3);
            var result = "rotate(" + angle + "deg) scale(" + size + "," + size + ")";
            this.style.transform = result;
            //this.style['-webkit-transform'] = result;
            //this.style.webkitTransform = result;
            this.style.WebkitTransform = result;
            //this.style.MozTransform = result;
        }
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(div);
        div.appendChild(img);

        // Add stylesheet.
        if (cornify_count == 5) {
            var cssExisting = document.getElementById('__cornify_css');
            if (!cssExisting) {
                var head = document.getElementsByTagName("head")[0];
                var css = document.createElement('link');
                css.id = '__cornify_css';
                css.type = 'text/css';
                css.rel = 'stylesheet';
                css.href = 'http://www.cornify.com/css/cornify.css';
                css.media = 'screen';
                head.appendChild(css);
            }
            cornify_replace();
        }
    }

    var cornify_replace = function () {
        // Replace text.
        var hc = 6;
        var hs;
        var h;
        var k;
        var words = ['Happy', 'Sparkly', 'Glittery', 'Fun', 'Magical', 'Lovely', 'Cute', 'Charming', 'Amazing', 'Wonderful'];
        while (hc >= 1) {
            hs = document.getElementsByTagName('h' + hc);
            for (k = 0; k < hs.length; k++) {
                h = hs[k];
                h.innerHTML = words[Math.floor(Math.random() * words.length)] + ' ' + h.innerHTML;
            }
            hc -= 1;
        }
    }


    exports.add = cornify_add;
});
```

As you can deduct from the last line, we expose an `add` method which we're going to use in our extension.
First, we need to load this as a dependency in our `main.js` file (and we can replace the cornify variable since we don't need it anymore):

```javascript
var cornify = require('lib/cornify');
```

Notice that, since we are including an AMD module we have stripped out the `text!` prefix and we don't even have to specify the `.js` extension.
At this moment `cornify` correspond to the `export` object inside our dependency: it's an object with the (exported) `add` method.
In that case we have to change another line, because the `register` module requires a function, not an object!

```javascript
CommandManager.register("Gimme some love", CORNIFY_CMD_ID, cornify.add.bind(cornify));
```

In this particular case calling `bind` not required we could have simply passed `cornify.add` along...but since we're supposed not to know the internals of each and every library we use, this is a nice tip to make sure that the `add` function is called with the proper context. For more on context binding see [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).

Your final script should look like this:

```javascript
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule('utils/AppInit'),
        CommandManager = brackets.getModule("command/CommandManager"),
        Menus  = brackets.getModule("command/Menus"),
        CORNIFY_CMD_ID = "artoale.cornify";


    var cornify = require('lib/cornify');


    AppInit.appReady(function () {
        var helpMenu = Menus.getMenu(Menus.AppMenuBar.HELP_MENU);

        CommandManager.register("Gimme some love", CORNIFY_CMD_ID, cornify.add.bind(cornify));
        helpMenu.addMenuItem(CORNIFY_CMD_ID);
    });
});
```

I suppose at this point you've get it but anyway, save everything, reload brackets and run again your command... **that's pure joy!**

##Bonus: keyboard shortcut

Developers usually love their keyboard more than their mother, and since Brackets is developed for them, adding a keybinding to your commands is as easy as that:

```javascript
helpMenu.addMenuItem(CORNIFY_CMD_ID, "Ctrl+Alt+U");
```

This tell our editor to bind our command to the specified keystroke combination (and don't warry, `Ctrl` is replaced by `Cmd` automatically on Mac OS X).

That's all for part 1. If you have corrections or suggestions for next parts let me know in the comments (or on G+). I'll be writing on manipulating the editor content (maybe something on accessing Quick Edit) and how to use node.js internal process for greater good!

[sublime]: http://www.sublimetext.com/
[webstorm]: http://www.jetbrains.com/webstorm/
[brackets]: http://brackets.io
[Mustache]: https://github.com/janl/mustache.js/
[jQuery]: http://jquery.com/
[Cornify]: http://www.cornify.com/
