# earthly

An ES8 compatible, down-to-earth build tool.

## Usage

### Example with Browserify

``` javascript
const earthly = require("earthly");
const browserify = require("browserify");

earthly.task("browserify", [ "a.js", "b.js" ], async () => {
	const bundle = await earthly.stream(browserify("a.js").bundle());
	await earthly.writeFile("bundle.js", bundle);
});

earthly.go();

```
