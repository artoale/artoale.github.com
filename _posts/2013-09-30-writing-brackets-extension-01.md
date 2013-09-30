---
layout: post
title:  "Writing Brackets extension part 1"
date:   2013-09-25 17:35:42
categories: brackets tutorial
img: brackets_logo.svg
---

As web developers and lovers, we all have tried different tools, IDE and text editors to improve our daily workflow and enjoy writing exciting web app more and more. Apart from the old-fashioned vim/emacs lover, most of us currently use either [Sublime Text][sublime] (with its great collection of plugin) or [WebStorm][webstorm]. Both have great features, plugins and support but there's a new player that is going to change the rules: [Adobe Brackets][brackets]

To summarize why I think Brackets in a couple of quarter is winning the web editors challange:

1. Dude, it's open source! Yep, even if developed and supported by Adobe, brackets is completely open source (and please, don't ask me why open is better)
2. Bracket itself IS a web app: it's built with all the technologies we love, HTML, CSS and javascript and runs in a chromium shell so yes, if you're a web developer, you can help improving it (by, for instance, writing an extension!)
3. Even if it's not in alpha yet, is already pretty stable, a lot of extensions have been developed and ships with some cool and peculiar features itself (quick edit, live developement, tern code intelligence, jslint, sass support and so on)

Ok. Got it. It's nice. But it's missing &lt;THIS FEATURE&gt;!
Right, me too. Let's add it, right now!

##Always start with ponies

If the internet teached us something is that there are never enough poines and unicorns around - and that certainly applies to brackets too. Let's add some sparkling happyness to our new web editor!

###Project set-up

First thing to do (after installing and enjoying brackets, of course) is to locate the extension folder. Just go to `Help > Show extensions folder` from the menu. It should be something like `~/Library/Application Support/brackets/extensions` for Mac and `C:\Users\<Your Username>\AppData\Roaming\Brackets\extensions` for Windows.

Go into the `user` subfolder and create our new project root: `brackets-cornify`.


{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"Si
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}



[sublime]: https://github.com/mojombo/jekyll
[webstorm]:    http://jekyllrb.com
[brackets]:    http://brackets.io
