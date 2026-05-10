import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

export function launchTui() {
  const { waitUntilExit } = render(React.createElement(App));
  return waitUntilExit();
}
