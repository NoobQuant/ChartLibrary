# revealpres

Example project for a slideshow using <a href="https://github.com/hakimel/reveal.js">reveal.js</a> and <a href="https://github.com/NoobQuant/animlib">animlib</a> (wrapper for d3.js).

**How to use**
- Clone animlib to *revealpres/*: *git clone https://github.com/NoobQuant/animlib.git*
- Clone reveal.js (3.8.0) to *revealpres/*: *git clone --branch 3.8.0 --depth 1 https://github.com/hakimel/reveal.js.git*
- Copy items from folder *customstuff* to correct places in under *reveal.js/*:
 - *customstuf/nqtheme.css* under *reveal.js/css/theme*
 - *customstuff/plugins/d3js* under *reveal.js/plugin/*
 - *customstuff/plugins/embed-tweet/* under *reveal.js/plugin/*
- Run presentation *index.html* on localhost server.