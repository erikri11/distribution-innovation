import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressValidation from './address-validation';

describe('Address Validation', () => {
  test('shows default country text "Norway"', () => {
    render(<AddressValidation />);
    const selectedCountry = screen.getAllByRole('combobox')[0];
    expect(selectedCountry).toHaveTextContent('Norway');
  });

  test('opens the country dropdown and shows options', async () => {
    render(<AddressValidation />);
    const selectedCountry = screen.getAllByRole('combobox')[0];

    await act(async () => {
      userEvent.click(selectedCountry);
    });

    expect(screen.getByRole('option', { name: 'Norway' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Sweden' })).toBeInTheDocument();
  });

  test('selecting "Sweden" updates the combobox text', async () => {
    render(<AddressValidation />);
    const selectedCountry = screen.getAllByRole('combobox')[0];

    await act(async () => {
      userEvent.click(selectedCountry);
    });
    await act(async () => {
      userEvent.click(screen.getByRole('option', { name: 'Sweden' }));
    });

    expect(selectedCountry).toHaveTextContent('Sweden');
  });

  test('validate button has no success/error icon initially', () => {
    render(<AddressValidation />);
    const validateBtn = screen.getByRole('button', { name: /validate/i });

    expect(validateBtn.querySelector('.icon-success')).toBeNull();
    expect(validateBtn.querySelector('.icon-error')).toBeNull();
  });
});