import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import Search from './components/Search';
import { Provider } from 'react-redux';
import store from './Data/store';

test('render All Component', () => {
  render(<Provider store={store}><Search /></Provider>);

  const btnSelect = screen.getByRole('button');

  expect(btnSelect).toBeInTheDocument();
  userEvent.click(btnSelect);
});