import { describe, expect, vi, test } from 'vitest';
import {
  validateListingFormInputs,
  saveItemIntoDatabase,
} from '../src/upload_listing';
import { Item } from '../mongoose/item_model';

describe('validateListingFormInputs', () => {
  test('Empty Name', () => {
    const { error } = validateListingFormInputs('', 'Hi', 'Rent', 'Send to me');
    expect(error).toBeDefined();
  });

  test('Empty Description', () => {
    const { error } = validateListingFormInputs('Hi', '', 'Rent', 'Send to me');
    expect(error).toBeDefined();
  });

  test('Empty type of transaction', () => {
    const { error } = validateListingFormInputs('Hi', 'NH', '', 'Send to me');
    expect(error).toBeDefined();
  });

  test('Empty deliveryInformation', () => {
    const { error } = validateListingFormInputs('Hi', 'Hi', 'Rent', '');
    expect(error).toBeDefined();
  });

  test('All fields are filled', () => {
    const { error } = validateListingFormInputs('a', 'b', 'c', 'd');
    expect(error).toBeUndefined();
  });
});

describe('saveItemIntoDatabase', () => {
  test('If the saving process is successful', async () => {
    vi.spyOn(Item.prototype, 'save').mockResolvedValueOnce({});
    const { success, message } = await saveItemIntoDatabase(
      'a',
      2,
      'c',
      'd',
      'e',
      ['a'],
      'f',
      'g'
    );
    expect(success).toBe(true);
    expect(typeof message).toBe('object');
  });

  test('If the saving process is unsuccessful', async () => {
    vi.spyOn(Item.prototype, 'save').mockRejectedValueOnce({
      message: 'Something went wrong',
    });
    const { success, message } = await saveItemIntoDatabase(
      'a',
      2,
      'c',
      'd',
      'e',
      ['a'],
      'f',
      'g'
    );
    expect(success).toBe(false);
    expect(typeof message).toBe('string');
    expect(message).toBe('Something went wrong');
  });
});
