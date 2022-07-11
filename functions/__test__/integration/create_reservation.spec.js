import { connectDatabase, closeDatabase, clearDatabase } from '../db';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import {
  validateItem,
  make_reservation,
} from '../../Cloud Functions/createReservation';
import { Item } from '../../service/Model';

describe('Should spin up a memory', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  test('If no item is found, the "No item found" message should be shown.', async () => {
    const error = await validateItem('62b7d1b7dd67e5f67cab0145', '123');
    expect(error).toBe('No item found.');
  });

  test('If the item is already on offer, user should not be able to make reservation', async () => {
    const item = new Item({
      _id: '62b7d1b7dd67e5f67cab0145',
      status: 'offered',
      typeOfTransaction: 'Rent',
    });
    await item.save();
    const error = await validateItem('62b7d1b7dd67e5f67cab0145', '123');
    expect(error).toBe('Item not available for Rent.');
  });

  test('If the user is the owner of the item, he should not be able to make reservation', async () => {
    const item = new Item({
      _id: '62b7d1b7dd67e5f67cab0145',
      status: 'available',
      typeOfTransaction: 'Rent',
      createdBy: '123',
    });
    await item.save();
    const error = await validateItem('62b7d1b7dd67e5f67cab0145', '123');
    expect(error).toBe('You cannot purchase your own item');
  });

  test('If the user currently possess the item, he should not be able to make reservation', async () => {
    const item = new Item({
      _id: '62b7d1b7dd67e5f67cab0145',
      status: 'available',
      typeOfTransaction: 'Rent',
      createdBy: '456',
      currentOwner: '123',
    });
    await item.save();
    const error = await validateItem('62b7d1b7dd67e5f67cab0145', '123');
    expect(error).toBe('You cannot purchase your own item');
  });

  test('If the user does not possess the item, does not currently have the item and the item status is available, there should not be an error message.', async () => {
    const item = new Item({
      _id: '62b7d1b7dd67e5f67cab0145',
      status: 'available',
      typeOfTransaction: 'Rent',
      createdBy: '456',
      currentOwner: '456',
    });
    await item.save();
    const error = await validateItem('62b7d1b7dd67e5f67cab0145', '123');
    expect(error).toBe(undefined);
  });

  test('make_reservation', async () => {
    const item = new Item({
      _id: '62b7d1b7dd67e5f67cab0145',
      status: 'available',
      typeOfTransaction: 'Rent',
      createdBy: '456',
      currentOwner: '456',
    });
    await item.save();
    const result = await make_reservation('62b7d1b7dd67e5f67cab0145', '123');
    expect(result.status).toBe('offered');
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  }, 30000);
});
