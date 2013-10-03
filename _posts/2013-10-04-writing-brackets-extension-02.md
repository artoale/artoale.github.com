---
layout: post
title:  "Writing Brackets extension - part 2"
date:   2013-10-04
categories: tutorial brackets
img: dino.png
---

A lot of editors and IDEs (or their plugin) offer the ability to automatically insert snippet of code when a specific sequence is typed. In this tutorial we're going to see how to insert beautiful creatures the same way (and yes, you will be able to adapt the code to insert real snippets but...that's boring!)

I'm going to assume that you're familiar with the concepts of [part 1]({% post_url 2013-09-30-writing-brackets-extension-01 %}), in particular the extensions basic file tree, Brackets module loading, the AMD module definition and how to create new commands and menu items. TodaywWe will be focusing on how to interact with the current open document, react to text changes and inject text in the editor.

##The Editor and Document objects

As you may now, brackets makes use of the great [CodeMirror][] text editor component. The `Editor` object is basically a CodeMirror wrapper that exposes all sort of methods and events to interact with the functionalities of the editor itself: cursors position, text selection, scrolling, inline widgets, keystrokes and many more

An `Editor` instance is always connected with a `Document` instance which, on its side, offers methods and events to access and modify the text *content*: you can get the whole text, replace it completely or selectively, insert more and so on...

Get hold of the current visible editor is simple: we only need the `EditorManager` brackets module. Let's start with a simple extension scaffold project (like we did in part 1) and add the code necessary to get the `Editor`.

First we create a `package.json` with the necessary metadata:

{% highlight json %}
{
    "name": "cornsnippet-brackets",
    "title": "CornSnippet",
    "description": "Unicorn and dinos for your own good",
    "homepage": "http://artoale.com{{page.url}}",
    "version": "0.0.1",
    "author": "Alessandro Artoni <artoale@gmail.com> (https://github.com/artoale)",
    "license": "MIT",
    "engines": {
        "brackets": ">=0.31.0"
    }
}
{% endhighlight %}

and go ahead with the `main.js`

{% highlight javascript %}
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule("utils/AppInit"),
        EditorManager = brackets.getModule("editor/EditorManager");


    AppInit.appReady(function () {
        var currentEditor = EditorManager.getCurrentFullEditor();
    });
});

{% endhighlight %}

Ok, great...now we have our `Editor` instance....what shall we do with that? Most snippet tools react to a text sequence e.g (fn to generate a function, cls to generate a class...) followed by a `Tab` keystroke. We certainly don't want to do less!

##Brackets events

Apart from some exceptions (`AppInit.appReady` being one) Brackets uses jQuery event system for dispatching notification all over the application. How does it work? Well, you may not know it, but you can use jQuery to wrap not only DOM node, but even [plain javascript object][jQplain]. This way you can use the same paradigm of event handling not only for your page elements but event for your application logic.

To register an event handler you should do something like `$(object).on('eventName', eventHandler)`;

###Editor events

All `Editor` instances dispatch the following events (from [Editor.js](https://github.com/adobe/brackets/blob/master/src/editor/Editor.js#L42)):

1. `keyEvent`: When any key event happens in the editor (whether it changes the text or not). Event handlers are passed ({Editor}, {KeyboardEvent}). The 2nd arg is the raw DOM event. Note: most listeners will only want to respond when event.type === "keypress".
2. `cursorActivity`: When the user moves the cursor or changes the selection, or an edit occurs.  Note: do not listen to this in order to be generally informed of edits--listen to the "change" event on Document instead.
3.  `scroll`: When the editor is scrolled, either by user action or programmatically.
4. `lostContent`: When the backing Document changes in such a way that this Editor is no longer able to display accurate text.
5.  `optionChange`: Triggered when an option for the editor is changed. The 2nd arg to the listener is a string containing the editor option that is changing. The 3rd arg, which can be any data type, is the new value for the editor option.

A you may understand, we want to listen to the `keyEvent` and, exactly as Brackets doc suggests, when the event is of type *keypress*. We could define the event listener like this:

```javascript
var keyEventHandler = function ($event, editor, event) {
    if ((event.type === "keydown") && (event.keyCode === KeyEvent.DOM_VK_TAB)) {
        console.log("Tab pressed!");
    }
};
```
and in our `appReady`:

```javascript
currentEditor.on('keyEvent', keyEventHandler);
```

As you can see Brackets API provides us an easy way to detect which key has been pressed, via the `KeyEvent` module (inside *utils*) that, of course, we can load with  `brackets.getModule("utils/KeyEvent")`.

If you've followed the instruction, you should end up with a `main.js` that look like this:

```javascript
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule("utils/AppInit"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        KeyEvent = brackets.getModule("utils/KeyEvent");

    var keyEventHandler = function ($event, editor, event) {
        if ((event.type === "keydown") && (event.keyCode === KeyEvent.DOM_VK_TAB)) {
            console.log("Tab pressed!");
        }
    };

    AppInit.appReady(function () {
        var currentEditor = EditorManager.getCurrentFullEditor();
        $(currentEditor).on('keyEvent', keyEventHandler);
    });
});
```

Ready to test? Save everything, hit `Cmd+R`, then open the dev tools..when you press Tab in your editor you will see the "Tab pressed" message appear in the console...nice isn't it? If you play with that, you may notice that unfortunately, this functionality works only for the file that was open when we restarted Brackets...and that's because we registered the listener on that `Editor` only! (Remember....each editor -> one document). How can we fix that? But with another event, of course.

####React to editor switch

What's cool is that we don't even need other modules, we already have everything we need...we just need to know that the `EditorManager` module fires the `activeEditorChange` event each time the current editor changes (focus on another file, open inline editor, close the current file etc.). The event handler parameters are quite straightforward: the jQuery event, the newly focused `Editor` (if any) and the one just left (again, where applicable). Ok, we're good to implement a new event handler:

```javascript
var activeEditorChangeHandler = function ($event, focusedEditor, lostEditor) {
    if (lostEditor) {
        $(lostEditor).off("keyEvent", keyEventHandler);
    }

    if (focusedEditor) {
        $(focusedEditor).on("keyEvent", keyEventHandler);
    }
};

//inside appReady
$(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
```

Notice that, to avoid duplicate event handler and possible memory leaks, first thing we do is to remove the handler from the previous editor, then we register it on the new one...save, reload and try it now! You should see that even when switching between different files you still have the message logged when pressing tab.

Yeah, that may be nice...but we still don't have neither unicorn nor dinos! You're right...and even if we haven't implement the real snippet functionality yet, let's start with writing some support modules and get the beats ready.

##Preparing unicorns and dinosaurs!

Create a `lib` folder and a `beasts` folder inside it. Add two files, one being `unicorn.txt` from [part 1]({% post_url 2013-09-30-writing-brackets-extension-01 %}#toc_6), the other name it `dino.txt` and fill it with this scary creature

```
        .-=-==--==--.
       ..-=="  ,'o`)      `.
     ,'         `"'         \
    :  (                     `.__...._
    |                  )    /         `-=-.
    :       ,vv.-._   /    /               `---==-._
     \/\/\/VV ^ d88`;'    /                         `.
         ``  ^/d88P!'    /             ,              `._
            ^/    !'   ,.      ,      /                  "-,,__,,--'""""-.
           ^/    !'  ,'  \ . .(      (         _           )  ) ) ) ))_,-.\
          ^(__ ,!',"'   ;:+.:%:a.     \:.. . ,'          )  )  ) ) ,"'    '
          ',,,'','     /o:::":%:%a.    \:.:.:         .    )  ) _,'
           """'       ;':::'' `+%%%a._  \%:%|         ;.). _,-""
                  ,-='_.-'      ``:%::)  )%:|        /:._,"
                 (/(/"           ," ,'_,'%%%:       (_,'
                                (  (//(`.___;        \
                                 \     \    `         `
                                  `.    `.   `.        :
                                    \. . .\    : . . . :
                                     \. . .:    `.. . .:
                                      `..:.:\     \:...\
                                       ;:.:.;      ::...:
                                       ):%::       :::::;
                                   __,::%:(        :::::
                                ,;:%%%%%%%:        ;:%::
                                  ;,--""-.`\  ,=--':%:%:\
                                 /"       "| /-".:%%%%%%%\
                                                 ;,-"'`)%%)
                                                /"      "|

```

We can then create a simple objects that map string to their respective animal. Call it snippet.js and put it inside your lib folder:

```javascript
define(function (require, exports, module) {
    "use strict";
    var unicorn = require("text!./beasts/unicorn.txt"),
        dino = require("text!./beasts/dino.txt"),
        snippets = Object.create(null);

    snippets.dino = dino;
    snippets.unicorn = unicorn;

    module.exports = snippets;
});
```

Here we load our ASCII-ARTs and assign them to a **clean** object - we used `Object.create(null)` to make sure only the properties we have defined will be present on that object.
Since we want our `snippet` module to be exactly the same as the `snippets` object, we can completely override the what is exported by assigning it to `module.exports` instead of adding properties to the `export` object.

Now that our beasts are ready to spread cuteness (or not) we can move back to the `main.js` and see how we can make them part of our editor!


##Interacting with the text

The main idea is that, each time `Tab` is pressed we check if the word immediately before the cursor correspond to one of the registered snippets, if yes, we replace it with our wonderful beast otherwise, we let the editor work as usual.

We first write an helper function that, given a string containing the current line and an integer for the cursor position, returns the last word that immediately precedes the cursor:

```javascript
var parseLine = function (line, cursorColumn){
    var words;
    line = line.substring(0, cursorColumn);
    //split the line in "words" made of alphanumeric char or underscores (a-zA-Z0-9 and _)
    words = line.split(/\W/);
    return words[words.length - 1];
};
```

We consider only the string "before" the cursor by calling `substring` and we then split the remaining string using as separator each non-word characters (according to RegExp definition). The last item is thereby returned.

How do we get the current line and the cursor position? We need the `Editor` instance here, so we're going to expand the keydown event handler a little:

```javascript
var snippet = require("lib/snippet");
//...
var keyEventHandler = function ($event, editor, event) {
    var cursorPosition,
        line,
        snippetKey;
    if ((event.type === "keydown") && (event.keyCode === KeyEvent.DOM_VK_TAB)) {
        cursorPosition = editor.getCursorPos();
        line = editor.document.getLine(cursorPosition.line);
        snippetKey = parseLine(line, cursorPosition.ch);
        if (snippets[snippetKey]) {
            console.log(snippets[snippetKey]);
            event.preventDefault();
        }
    }
};
```

The `getCursorPos` method return an object containing the the cursor current **logical** line and character offset (if the line is broken into two or more by the editor, it's still a single line!). Moreover, the `editor.document` property holds the `Document` instance wich allow us to retrieve the document text content - in that case, the current line only.
Once again, save everything and reload brackets; if you did everything correctly and tipe `unicorn` or `dino` followd by `Tab` you'll get the most fantastic creature in your console.

You may have noticed in the last bit of code, I've added an `event.preventDefault()` call. Since the desired final behaviour is to replace the text with the associated snippet we don't want a `Tab` character to be added to the text.

Yeah...what about the desired ***final*** behaviour? We're just logging into the console! Don't worry, we're getting there.

##Replacing text in the document

Finally, we've got there: we are able to identify the registered snippets key, we can load dinosaurs and unicorns we still have to replace the key with the actual beast!

Again, it's text we're dealing with, so the `document` object is involved...since we want to replace text the `document.replaceRange` seems a reasonable choice, doesn't it?  This method take as parameters a string, with the new content to insert and one or two `position` object like that one (exactly like `cursorPosition`):

```javascript
{
    line: 234,
    ch: 12
}
```

If you specify two `position` those identify a range of text to be replaced but you can specify one only, in that case the text is only inserted at the specified point.
Wow, it's easy: we only need to add a couple of line!

```javascript
//...
start = {
    line: cursorPosition.line,
    ch: cursorPosition.ch - snippetKey.length
};
editor.document.replaceRange(snippets[snippetKey], start, cursorPosition);
//...
```

As noted before, since cursorPosition already has the required format, we can use it directly, and create the 'start' postion by removing the legnht of the snippet key from the cursor position.
Really? Yeah, that's it....see it all toghether:

```javascript
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule("utils/AppInit"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        KeyEvent = brackets.getModule("utils/KeyEvent");

    var snippets = require("lib/snippet");

    var parseLine = function (line, cursorPosition) {
        var words;
        line = line.substring(0, cursorPosition);
        //split the line in "words" made of alphanumeric char or underscores (a-zA-Z0-9 and _)
        words = line.split(/\W/);
        return words[words.length - 1];
    };

    var keyEventHandler = function ($event, editor, event) {
        var cursorPosition,
            line,
            snippetKey,
            start;
        if ((event.type === "keydown") && (event.keyCode === KeyEvent.DOM_VK_TAB)) {
            cursorPosition = editor.getCursorPos();
            line = editor.document.getLine(cursorPosition.line);
            snippetKey = parseLine(line, cursorPosition.ch);
            if (snippets[snippetKey]) {
                start = {
                    line: cursorPosition.line,
                    ch: cursorPosition.ch - snippetKey.length
                };
                editor.document.replaceRange(snippets[snippetKey], start, cursorPosition);
                event.preventDefault();
            }
        }
    };

    var activeEditorChangeHandler = function ($event, focusedEditor, lostEditor) {
        if (lostEditor) {
            $(lostEditor).off("keyEvent", keyEventHandler);
        }

        if (focusedEditor) {
            $(focusedEditor).on("keyEvent", keyEventHandler);
        }
    };

    AppInit.appReady(function () {
        var currentEditor = EditorManager.getCurrentFullEditor();
        $(currentEditor).on('keyEvent', keyEventHandler);
        $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
    });
});

```

If you enjoyed this post stay tuned...some nodejs goodnes coming soon!

[jQplain]: http://api.jquery.com/jQuery/#working-with-plain-objects
[CodeMirror]: http://codemirror.net/

