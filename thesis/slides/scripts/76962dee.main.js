/*globals Reveal, hljs*/

(function () {
    'use strict';
    var basePath = 'bower_components/reveal.js/';
    var revealDep = [
        {
            src: 'lib/js/classList.js',
            condition: function () {
                return !document.body.classList;
            }
        },
        {
            src: 'plugin/markdown/marked.js',
            condition: function () {
                return !!document.querySelector('[data-markdown]');
            }
        },
        {
            src: 'plugin/markdown/markdown.js',
            condition: function () {
                return !!document.querySelector('[data-markdown]');
            }
        },
        {
            src: 'plugin/highlight/highlight.js',
            async: true,
            callback: function () {
                hljs.initHighlightingOnLoad();
            }
        },
        {
            src: 'plugin/zoom-js/zoom.js',
            async: true,
            condition: function () {
                return !!document.body.classList;
            }
        },
        {
            src: 'plugin/notes/notes.js',
            async: true,
            condition: function () {
                return !!document.body.classList;
            }
        }
    ];

    revealDep = revealDep.map(function (dep) {
        dep.src = basePath + dep.src;
        return dep;
    });

    // Full list of configuration options available here:
    // https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
        controls: true,
        progress: true,
        history: true,
        center: true,
        theme: Reveal.getQueryHash().theme, // available themes are in /styles/theme
        transition: Reveal.getQueryHash().transition || 'concave', // default/cube/page/concave/zoom/linear/fade/none

        // Parallax scrolling
        // parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
        // parallaxBackgroundSize: '2100px 900px',

        // Optional libraries used to extend on reveal.js
        dependencies: revealDep
    });
}());

/*jshint browser: true*/
/*globals d3, $ */
(function () {
    'use strict';
    var m = [20, 20, 20, 20],
        w = 800 - m[1] - m[3],
        h = 500 - m[0] - m[2];
    var stepDelay = 600;
    var tree = d3.layout.tree()
        .size([w, h]);
    tree.value(function (d) {
        return d.depth;
    });
    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.x, d.y];
        });

    var vis = d3.selectAll('.svg-body').append('svg:svg')
        .attr('width', w + m[1] + m[3])
        .attr('height', h + m[0] + m[2])
        .append('svg:g')
        .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');

    var data = {
        name: 'html',
        children: [{
            name: 'head',
            children: [{
                name: 'link'
            }, {
                name: 'script'
            }]
        }, {
            name: 'body',
            children: [{
                name: 'nav',
                children: [{
                    name: 'a'
                }, {
                    name: 'button'
                }]
            }, {
                name: 'section',
                children: [{
                    name: 'article',
                    children: [{
                        name: 'h1'
                    }, {
                        name: 'p'
                    }]
                }]
            }]
        }]
    };
    var p = function (property) {
        return function (d) {
            return d[property];
        };
    };

    var update = function (root) {
        var nodes = tree.nodes(root),
            links = tree.links(nodes);

        var node = vis.selectAll('g.node')
            .data(nodes, p('name'));

        var nodeUpdate = node.transition()
            .duration(stepDelay)
            .attr('transform', function (d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

        var nodeEnter = node.enter().append('svg:g')
            .attr('class', 'node')
            .attr('style', 'display:none;')
            .attr('transform', function (d) {
                var p = d.parent || d;
                //p =  d.children && d.children[0];
                return 'translate(' + p.x + ',' + p.y + ')';
            });

        nodeEnter.append('svg:rect')
            .attr('width', 20)
            .attr('height', 20)
            .attr('y', -10)
            .attr('x', -10)
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('fill-opacity', 1)
            .attr('fill', 'steelblue')
            .attr('stroke-opacity', 1);
        //        .attr('height', 20)

        nodeEnter.append('svg:text')
            .attr('x', 0)
            .attr('dy', '.3em')
            .attr('text-anchor', 'middle')
            .attr('fill-opacity', 0)
            .text(p('name'));

        var nodeTransitionEnter = nodeEnter.transition()
            .duration(stepDelay)
            .delay(function (d) {
                return (d.depth - 1) * stepDelay;
            })

        .attr('style', 'display:block;')
            .attr('transform', function (d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

        nodeTransitionEnter.select('rect')
            .delay(function (d) {
                return (d.depth) * stepDelay;
            })
            .attr('width', 80)
            .attr('x', -40)
            .attr('fill-opacity', 1)
            .attr('fill', 'white')
            .attr('stroke-opacity', 1);

        nodeTransitionEnter.select('text')
            .delay(function (d) {
                return (d.depth) * stepDelay;
            })
            .attr('fill-opacity', 1);




        var nodeExit = node.exit().transition()
            .duration(stepDelay)
            .remove();
        nodeExit.select('rect')
            .attr('width', 20)
            .attr('x', -10)
        //            .attr('fill-opacity', 1)
        //            .attr('fill', 'steelblue')
        .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0);

        nodeExit.select('text')
            .style('fill-opacity', 0);

        nodeExit.selectAll('circle')
            .attr('r', 0);

        var link = vis.selectAll('path.link')
            .data(links, function (d) {
                return d.target.name;
            });

        link.transition()
            .duration(stepDelay)
            .attr('d', diagonal);

        // Enter any new links at the parent's previous position.
        link.enter().insert('svg:path', 'g')
            .attr('class', 'link')
            .attr('d', function (d) {
                var p = d.source;
                var o = {
                    x: p.x,
                    y: p.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .transition()
            .delay(function (d) {
                return (d.target.depth - 1) * stepDelay;
            })
            .duration(stepDelay)
            .attr('d', diagonal);

        // Transition links to their new position.


        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(stepDelay)
            .attr('d', function (d) {
                var p = d.target;
                var o = {
                    x: p.x,
                    y: p.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();
    };



    Reveal.addEventListener('fragmentshown', function (event) {
        var id = event.fragment.dataset.fragmentId;
        var newData;
        if (id === 'start') {
            newData = data;
        } else if (id === 'render') {
            newData = {
                name: 'html',
                children: [{
                    name: 'body',
                    children: [{
                        name: 'nav',
                        children: [{
                            name: 'a',
                            children: [{
                                name: ':after'
                            }]
                        }, {
                            name: 'button'
                        }]
                    }, {
                        name: 'section',
                        children: [{
                            name: 'article',
                            children: [{
                                name: 'p'
                            }]
                        }]
                    }]
                }]
            };
        }
        if (newData) {
            update(newData);
        }
        // event.fragment = the fragment DOM element
    });
}());
