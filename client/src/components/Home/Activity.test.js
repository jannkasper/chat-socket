import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Activity from './Activity';
import { Provider } from 'react-redux';
import configureStore from '../../store';

const store = configureStore();

//jest.mock('components/T'); // Need store

describe('Activity component', () => {
  it('should display', () => {
    const activity = {
      type: '',
    };
    const { asFragment } = render(
      <Provider store={store}>
        <Activity activity={activity} scrollToBottom={jest.fn()} />
      </Provider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display TEXT_MESSAGE', () => {
    const activity = {
      type: 'TEXT_MESSAGE',
      username: 'alice',
      timestamp: new Date('2020-03-14T11:01:58.135Z').valueOf(),
      text: 'Hi!',
    };
    const { asFragment } = render(
      <Provider store={store}>
        <Activity activity={activity} scrollToBottom={jest.fn()} />
      </Provider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display USER_ENTER', () => {
    const activity = {
      type: 'USER_ENTER',
      username: 'alice',
    };
    const { asFragment } = render(
      <Provider store={store}>
        <Activity activity={activity} scrollToBottom={jest.fn()} />
      </Provider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display USER_EXIT', () => {
    const activity = {
      type: 'USER_EXIT',
      username: 'alice',
    };
    const { asFragment } = render(
      <Provider store={store}>
        <Activity activity={activity} scrollToBottom={jest.fn()} />
      </Provider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display TOGGLE_LOCK_ROOM', () => {
    const activity = {
      type: 'TOGGLE_LOCK_ROOM',
      locked: true,
      username: 'alice',
    };
    const { asFragment, rerender } = render(
      <Provider store={store}>
        <Activity activity={activity} scrollToBottom={jest.fn()} />
      </Provider>,
    );

    expect(asFragment()).toMatchSnapshot();

    activity.locked = false;

    rerender(
      <Provider store={store}>
        <Activity activity={activity} scrollToBottom={jest.fn()} />
      </Provider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
