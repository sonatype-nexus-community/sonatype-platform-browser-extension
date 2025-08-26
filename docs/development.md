---
title: Developing & Contribution
layout: default
menus:
  main:
    title: Development
    weight: 500
---

Development of this extension is done with the following tools:

- Node v22.x
- NPM v10.9.x
- [Sonatype React Shared Components](https://github.com/sonatype/sonatype-react-shared-components) v14.x

All other dependencies are defined in our `package.json`.

## Testing

We use `jest` for testing. To run tests simply run:

~~~ shell
npm run jest
~~~

## Documentation

To update the documentation (this site), you need to have:
1. Ruby installed - see [here](https://www.ruby-lang.org/en/documentation/installation/)
2. Bundler installed - see [here](https://bundler.io/)

Then run:

~~~ bash
bundle install
jekyll serve      # This will generate the site and host it locally for you at http://localhost:4000
~~~