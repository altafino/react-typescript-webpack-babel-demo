import React, { ComponentLifecycle } from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render, ShallowWrapper } from 'enzyme';

// Need to mock App.css and logo.svg
import App from '../../../main/webapp/components/App';
import Mock = jest.Mock;

describe('<App />', () => {
  // Basic Jest test
  test('renders without crashing', () => {
    const div: HTMLElement = document.createElement('div');

    ReactDOM.render(<App />, div);
  });

  // Enzyme shallow test
  test('has class name App', () => {
    const wrapper: ShallowWrapper = shallow(<App />);

    expect(wrapper.is('.App')).toBe(true);
  });

  // Enzyme mount test
  test('called componentDidMount after mounting', () => {
    const componentDidMount: Mock<ComponentLifecycle<{}, {}>> = jest.fn();

    App.prototype.componentDidMount = componentDidMount;

    mount(<App />);

    expect(componentDidMount).toBeCalled();
  });

  // Enzyme static render test
  test('renders an h1 with the text "React TypeScript Starter"', () => {
    const wrapper: Cheerio = render(<App />);

    expect(wrapper.find('h1').text()).toEqual('React TypeScript Starter');
  });
});
