import { vi, describe, expect, test } from 'vitest';
import { Item } from '../../service/Modeldel';
import {
  validateItem,
  make_reservation,
} from '../../Cloud Functions/createReservationion';

describe('create_reservation cloud functions', () => {
  test('ValidateItem Test 1', async () => {
    vi.spyOn(Item, 'findById').mockImplementationOnce(() => Promise.resolve(null));
    const result = await validateItem('123', '123');
    expect(result).toStrictEqual('No item found.');
  });

  test('ValidateItem Test 2', async () => {
    vi.spyOn(Item, 'findById').mockImplementationOnce(() =>
      Promise.resolve({ status: 'Offered', typeOfTransaction: 'Rent' })
    );
    const result = await validateItem('123', '123');
    expect(result).toStrictEqual('Item not available for Rent.');
  });

  test('ValidateItem Test 3', async () => {
    vi.spyOn(Item, 'findById').mockImplementationOnce(() =>
      Promise.resolve({
        status: 'available',
        typeOfTransaction: 'Rent',
        createdBy: '123',
      })
    );
    const result = await validateItem('123', '123');
    expect(result).toStrictEqual('You cannot purchase your own item');
  });

  test('ValidateItem Test 4', async () => {
    vi.spyOn(Item, 'findById').mockImplementationOnce(() =>
      Promise.resolve({
        status: 'available',
        typeOfTransaction: 'Rent',
        currentOwner: '123',
      })
    );
    const result = await validateItem('123', '123');
    expect(result).toStrictEqual('You cannot purchase your own item');
  });

  test('ValidateItem Test 5', async () => {
    vi.spyOn(Item, 'findById').mockImplementationOnce(() =>
      Promise.resolve({
        createdBy: '456',
        status: 'available',
        currentOwner: '456',
      })
    );
    const result = await validateItem('123', '123');
    expect(result).toBe(undefined);
  });

  test('make_reservation Test 1', async () => {
    vi.spyOn(Item, 'findByIdAndUpdate').mockImplementationOnce(() =>
      Promise.resolve({
        status: 'offered',
      })
    );

    const result = await make_reservation('123', '123');
    expect(result.status).toBe('offered');
  });
});
