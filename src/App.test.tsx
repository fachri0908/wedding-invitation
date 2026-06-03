import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders couple names in hero', () => {
  render(<App />);
  expect(screen.getByText(/Pernikahan/i)).toBeInTheDocument();
});
