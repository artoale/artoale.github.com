---
layout: post
title:  "Writing Brackets extension - part 3"
categories: tutorial brackets
img: theseus-node.png
---

Node.js has become the engine not only for building great event-driven server, but an impressive amount of library, transpiler and tools we use every day in our workflow. In previous articles, I've tried to explain the basis of Brackets extension and show the extenisibility of a native application written with HTML, CSS and javascript ♥. In this tutorial we are going to see how to exploit the full potential of node.js inside our favorite code editor.

##Brackets node process

At startup, *brackets-shell*, the layer responsible for interacting with native APIs, creates a node.js process and some communication channel with it (in our case, we're interested in a http/web-socket server). That means that all we need is already in place: a node process and a (easy) API to commmunicate with it.

Brackets uses the [Chrome Debugger Protocol](https://developers.google.com/chrome-developer-tools/docs/debugger-protocol) to exchange messages with node process. 
