# slush-jspm

[![Build Status](https://travis-ci.org/NathanielInman/slush-jspm.svg?branch=master)](https://travis-ci.org/NathanielInman/slush-jspm) [![dependency Status](https://david-dm.org/NathanielInman/slush-jspm/status.svg?style=flat)](https://david-dm.org/NathanielInman/slush-jspm) [![devDependency Status](https://david-dm.org/NathanielInman/slush-jspm/dev-status.svg?style=flat)](https://david-dm.org/NathanielInman/slush-jspm#info=devDependencies)

Slush generator jspm makes ES6 modular development easy!

## Table of Contents

* [Installation](#installation)
* [File Structure](#file-structure)
* [Notes](#notes)
* [Thanks](#thanks)

## Installation

Simply install [slush][2], this generator and [jspm][3] globally:

```
npm install -g slush slush-jspm jspm
mkdir appName
cd appName
slush jspm
```

to run...

```
npm start
```

to build javascript when production ready...

```
npm run build
```

And just like that, you're on the way to making your app!

## File Structure

Unlike many other slush generators, this generator is completely unopinionated about
what you do with your assets. This build process is JUST FOR JAVASCRIPT. There is no
moving of assets or compiling of css, jade etc. Adding a build process would be very
easy with this slim structure if one is necessary.
```
project
├─ dist
├─ src
├─ package.json
└─ README.md
```

## Notes

The boilerplate comes with a tiny library called Easel. Easel sets up a canvas
that will fit the perspective of the window and automatically adjust in size when
the window is resized. It's an extremely small library and sets up a few variables
that I find very useful:

* **ctx** : *context of the canvas*
* **v.w** : *viewport width in pixels*
* **v.h** : *viewport height in pixels*
* **r(number)** : *returns a decimal between 0 and number*
* **r(number,0,1)** : *returns an integer between 0 and number*
* **r(num1,num2)** : *returns a decimal between num1 and num2*
* **r(num1,num2,1)** : *returns an integer between num1 and num2*
* **Easel.background** : *color to flood the canvas with when it redraws*
* **Easel.redraw()** : *override this function to handle redraws on resize, or call it by hand*

## Thanks

This boilerplate of mine is just a combination of great tools, all credit goes to
those who actually put in all the hard work to create them.

- There have been many [Slush][1] generators that have been instrumental in getting
  all those pesky apps developed on time. It's great to finally have an alternative
  to Yeoman.
- Dropped Traceur for [Babel][2] (formerly 6to5) because it has more readable compiled
  code. You can gather more specifics on comparisons of the two at their website.
- [JSPM][3] is a package manager that sits ontop of npm, github or browserify to load 
  modules using SystemJS.

[1]:https://github.com/slushjs/slush
[2]:https://github.com/babel/babel
[3]:https://jspm.io
