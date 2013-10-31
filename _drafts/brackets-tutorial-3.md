---
layout: post
title:  "Writing Brackets extension - part 3"
categories: tutorial brackets
img: theseus-node.png
---

Node.js has become the engine not only for building great event-driven server, but an impressive amount of library, transpiler and tools we use every day in our workflow. In previous articles, I've tried to explain the basis of Brackets extension and show the extenisibility of a native application written with HTML, CSS and javascript ♥. In this tutorial we are going to see how to exploit the full potential of node.js inside our favorite code editor.

##Brackets node process

At startup, *brackets-shell*, the layer responsible for interacting with native APIs, creates a node.js process and some communication channel with it (in our case, we're interested in a http/web-socket server). That means that all we need is already in place: a node process and a (easy) API to commmunicate with it.

Brackets internally uses the [Chrome Debugger Protocol](https://developers.google.com/chrome-developer-tools/docs/debugger-protocol) to exchange messages with the node process, and allows extension developers to access it through two main component: `NodeConnection` for the "browser" side and `DomainManager` in the "node" side.

###Registering node commands and events with DomainManager

First of all, let's introduce *domains*: a domain is a set of functionalities exposed in terms of `commands` - either syncronous or asyncronous - and `events`. You can think of a domain as a *module* which exposes methods (commands) and can fire custom events, to communicate something without being questioned.

When you write the code to be executed inside node, your module have to expose a `init` method which receives the `DomainManager` object as first parameter. This object is a singleton instance (shared by all extensions) and exposes a bunch of interesting methods:

* `registerDomain`: before being able to expose our node functionalities, we should register our own domain. This method takes two parameter, `domainName`, a string unique identifier (choose a reasonably *namespaced* name, to avoid collisions) and `version`, an hash with `minor` and `major` properties (which is not directly used by Brackets but can be used by your client code if necessary)
* `registerCommand`: used to expose a function running in node to Brackets. It requires the domain identifier, a string for identifying the command, the function to executed when the command is invoked and a boolean to define whether the command is asyncronous or not. Here's the signature from Brackets-shell [source](https://github.com/adobe/brackets-shell/blob/master/appshell/node-core/DomainManager.js#L119):

```javascript
/**
 * Registers a new command with the specified domain. If the domain does
 * not yet exist, it registers the domain with a null version.
 * @param {string} domainName The domain name.
 * @param {string} commandName The command name.
 * @param {Function} commandFunction The callback handler for the function.
 *    The function is called with the arguments specified by the client in the
 *    command message. Additionally, if the command is asynchronous (isAsync
 *    parameter is true), the function is called with an automatically-
 *    constructed callback function of the form cb(err, result). The function
 *    can then use this to send a response to the client asynchronously.
 * @param {boolean} isAsync See explanation for commandFunction param
 * @param {?string} description Used in the API documentation
 * @param {?Array.<{name: string, type: string, description:string}>} parameters
 *    Used in the API documentation.
 * @param {?Array.<{name: string, type: string, description:string}>} returns
 *    Used in the API documentation.
 */
function registerCommand(domainName, commandName, commandFunction, isAsync, description, parameters, returns) { /*...*/ };
```
* `registerEvent`: when you want the code inside node to asyncronously notify Brackets of something, you'll have to register a domain event. Pass in the `domainName` and the name of the event you're registering.
* `emitEvent`: trigger the event previously declared. A part from the domain and event names you can pass as third parameter - but beware, it will be converted to *JSON*. No function here!

That said, it's clearly time to get our hands dirty, and put our effort in something practical: 

###A domain at work

Inside the root folder of your extension, create a `node` folder (not required, but a useful convention) and an `ExampleDomain.js` inside it here's a basic 