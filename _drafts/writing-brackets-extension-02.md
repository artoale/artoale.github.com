---
layout: post
title:  "Writing Brackets extension - part 2"
categories: tutorial brackets
img: dino.png
---

A lot of editors and IDEs (or their plugin) offer the ability to automatically insert snipped of code when a specific sequence is typed. In this tutorial we're going to see how to insert beautiful creatures the same way (and yes, you will be able to adapt the code to insert real snippets but...that's boring!)

I'm going to assume that you're familiar with the concepts of [part 1]({% post_url 2013-09-30-writing-brackets-extension-01 %}), in particular the extensions basic file tree, Brackets module loading, the AMD module definition and how to create new commands and menu items. TodaywWe will be focusing on how to interact with the current open document, react to text changes and inject text in the editor.

##The Editor and Document objects

As you may now, brackets makes use of the great [CodeMirror][] text editor component. The [Editor](https://github.com/adobe/brackets/blob/master/src/editor/Editor.js) object is basically a CodeMirror wrapper that exposes all sort of methods and events to interact with the functionalities of the editor itself: cursors position, text selection, scrolling, inline widgets, keystrokes and many more.

An Editor instance is always connected with a Document instance which, on its side, offers methods and events to access and modify the text *content*: you can get the text, replace it, insert some and so on...




[CodeMirror]: http://codemirror.net/

