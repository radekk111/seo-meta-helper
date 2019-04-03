# SEO meta helper

Simple node.js app for quick result of SEO meta tags of any website:
- Meta title
- Meta description
- Open Graph data
- Twitter cards

App will scrape whole html code and will get meta tags of all links (anchors) in selected code.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install seo-meta-helper.

```bash
npm i seo-meta-helper
```

## Usage
Create a file called ***meta-helper.js***

Require installed package into file:
```javscript
const metaHelper = require('seo-meta-helper')
```
Now call command
```bash
node meta-helper.js
```
in root of your project, type url and see results:

![Seo meta helper screenshot](https://raw.githubusercontent.com/radekk111/seo-meta-helper/master/public/img/seo-meta-helper.png "Seo meta helper screenshot")

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.