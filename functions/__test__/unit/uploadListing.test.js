import { afterAll, describe, expect, test, vi } from 'vitest';
import { uploadDataIntoDatabase } from '../../Cloud Functions/uploadListing';
import { Item } from '../../service/Model';
import mongoose from 'mongoose';

describe('UploadListing modules', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  test('An item should be returned', async () => {
    vi.spyOn(Item.prototype, 'save').mockImplementationOnce(() => Promise.resolve());
    vi.spyOn(mongoose, 'connect').mockImplementationOnce(() => Promise.resolve());
    const result = await uploadDataIntoDatabase(
      'Test Item 1',
      'Description',
      'RENT',
      2,
      'MAIL',
      [],
      undefined,
      '123456'
    );

    expect(result.name).toBe('Test Item 1');
    expect(result.description).toStrictEqual('Description');
    expect(result.typeOfTransaction).toStrictEqual('RENT');
    expect(result.status).toBe('available');
    expect(result.price).toStrictEqual(2);
    expect(result.durationOfRent).toStrictEqual(604800);
  });
});
