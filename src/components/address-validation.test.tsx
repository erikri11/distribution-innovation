import { render} from '@testing-library/react';
import AddressValidation from './address-validation';

test('should render successfully', () => {
  const { baseElement } = render(
    <AddressValidation />
  );
  expect(baseElement).toBeTruthy();
});