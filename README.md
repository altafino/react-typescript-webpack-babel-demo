# React TypeScript Starter
> React, Jest, Enzyme, PostCSS, and Webpack, with Hot Module Replacement and Service Workers, using
TypeScript and Babel.

This is a full-featured starter kit for React projects using TypeScript, with all of the necessary
configuration taken care of. It just needs React Router, Redux/MobX, a CSS framework, and some API
to feed it data. It borrows techniques from `create-react-app` and the Webpack config is heavily
commented throughout.

I'm using a Babel [preset](https://github.com/adamelliotfields/babel-preset-react-latest) I made
which only transpiles JSX and ES7+ code to ES6 (targets modern browsers only).

The folder structure follows Maven's
[Standard Directory Layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html)
for Java projects.

### Notes

**TypeScript**
 - Use `allowSyntheticDefaultImports: true` to avoid using `import * as React from 'react'`. This is
because React does not have a default export. If you need to access types, you can use a named
import (e.g., `import React, { ComponentType } from 'react'`).
 - When using synthetic default imports, React will warn that `PropTypes` and `createClass` are
deprecated if you do `import * as React from 'react'` (because you're importing everything,
including deprecated stuff).
 - Set `target` and `module` to `esnext`, and `jsx` to `preserve` and let Babel handle
transpilation. Babel allows more fine-grained control by using presets and plugins.
 - You must have `module` set to `esnext` to use dynamic imports (presumably when code-splitting
with Webpack). You must also be on TypeScript v2.4 or greater.
 - Set `moduleResolution` to `node` so TypeScript can find your imported modules.
 - Use `experimentalDecorators: true` if you're using MobX or Radium (or any decorator-based
library).
 - You cannot use angle brackets to type assert (cast) in `.tsx` files (e.g.,
`(<string>foo).length`). You must use the new `as` syntax (e.g., `(foo as string).length`).
TypeScript will interpret `<string>` as a React component named `string`. An example of this is
`render(<App />, document.getElementById('root') as Element)`.
 - To import a file (e.g., `import logo from ./logo.svg`), you need to add a `.d.ts` file with
`declare module '*.svg'` in the same directory as the file(s) you want to import (i.e., `./logo.svg`
and `./logo.d.ts`). You'll obviously still need to use `file-loader` to handle the file.
 - If you are using CSS Modules, replace `css-loader` with `typings-for-css-modules-loader` in
Webpack to generate typings for CSS Modules variables on the fly.

To print the compiled TypeScript output to stdout, use the `--outFile /dev/stdout` option from the
command line. This option only works on Linux/macOS and only works with `amd` or `system` modules.
For example:

```sh
tsc src/main/webapp/components/App.tsx --outFile /dev/stdout --target esnext --module system --jsx preserve --allowSyntheticDefaultImports --experimentalDecorators
```

**Jest**
 - Requires either a custom preprocessor or `ts-jest`.
 - When using `ts-jest` and `jsx: preserve`, you must set `useBabelrc: true` (and obviously have a
`.babelrc` with either a preset or plugin to transpile JSX).
 - When running tests in Webstorm, your Jest configuration must be in JSON format. This only applies
to Webstorm's built-in Jest test runner, not when using Webstorm to run NPM scripts. This isn't
specific to TypeScript, but worth mentioning because you have to have a custom Jest configuration to
work with TypeScript.

**Webpack**
 - You can either use `ts-loader` and `babel-loader` if you want complete control over your
TypeScript and Babel settings, or use `awesome-typescript-loader` which includes Babel, caching,
and splitting type checking and compiling to separate processes.
 - If you do use `ts-loader`, use `fork-ts-checker-webpack-plugin` to split type checking and
compilation. See the [performance optimizations](#performance-optimizations) section for more
details.
 - Note that I was unable to get Hot Module Replacement working with `ts-loader`, but others have.
HMR worked out of the box with `awesome-typescript-loader`.
 - In order to omit file extensions when importing files (e.g, `import App from './App'`), you need
to add `.tsx` and `.js` (and optionally `.ts`), to the `resolve.extensions` array. Doing this will
override the default `.js` and `.json` extensions, and you'll definitely need `.js` in there to
work with any 3rd-party library. This isn't any different than what you normally must do with JSX
files.

### Performance Optimizations

[John Reilly](https://github.com/johnnyreilly) wrote an excellent
[post](https://medium.com/webpack/typescript-webpack-super-pursuit-mode-83cc568dea79) about
increasing performance in Webpack, with an emphasis on TypeScript projects.

I've found that `thread-loader` and `cache-loader` actually slow down smaller projects due to the
initial startup overhead and took a couple seconds to refresh the browser in development mode
(compared to near-instant otherwise). Experiment with them when your Webpack builds start taking
minutes and not seconds.

Overall, I found `awesome-typescript-loader` with `useCache: true` to offer the best performance and
make the most sense for me since I'm using both TypeScript and Babel.
