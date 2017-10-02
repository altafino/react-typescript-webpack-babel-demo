import './App.css';

import React, { Component, HTMLProps } from 'react';

import logo from './AppLogo.svg';

// // Logs the name of the method - quick test to ensure decorators are working
// const log = (target: object, name: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
//   // tslint:disable-next-line:no-console
//   console.log(`${name}()`);
//
//   return descriptor;
// };

class App extends Component<{}, {}> {
  // @log
  public render () {
    const props: HTMLProps<object> = {
      alt: 'logo',
      className: 'App-logo',
      src: logo
    };

    // Making sure object destructuring and rest operator work
    const { src, ...rest }: HTMLProps<object> = props;

    return (
      <div className='App'>
        <div className='App-header'>
          {/* Making sure spreading props works */}
          <img src={src} {...rest} />
          <h1>React TypeScript Demo</h1>
        </div>
        <p className='App-intro'>
          To get started, edit <code>src/components/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
