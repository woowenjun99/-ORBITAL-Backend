import { connectDatabase, closeDatabase, clearDatabase } from '../db';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { Item } from '../../service/Model';
import { findItemsInDatabase } from '../../Cloud Functions/filterAndSearch';

describe('filterAndSearchLogic', async () => {
  beforeAll(async () => {
    await connectDatabase('orbital_testing');
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('If the search and tag does not match any object, returns an empty array', async () => {
    const item = new Item({
      name: 'Test',
      status: 'available',
      typeOfTransaction: 'Rent',
      createdBy: '456',
      currentOwner: '456',
    });

    await item.save();
    const results = await findItemsInDatabase(undefined, 'hi');
    expect(results.length).toBe(0);
  });

  test('If the search matches any object, return an array with the item', async () => {
    const item = new Item({
      name: 'Test',
      status: 'available',
      typeOfTransaction: 'Rent',
      createdBy: '456',
      currentOwner: '456',
    });

    await item.save();
    const results = await findItemsInDatabase(undefined, 'te');
    expect(results.length).toBeGreaterThan(0);
  });

  test('If the search matches any object but the tags does not, no item should be returned, assuming there is only 1 item and the search passes', async () => {
    const item = new Item({
      name: 'Test',
      status: 'available',
      typeOfTransaction: 'Rent',
      createdBy: '456',
      currentOwner: '456',
      tags: ['1'],
    });

    await item.save();
    const results = await findItemsInDatabase(['2'], 'te');
    expect(results.length).toBe(0);
  });

  test('If both the items and the tags matches an item, the item should be returned', async () => {
    const item = new Item({
      name: 'Test',
      status: 'available',
      typeOfTransaction: 'Rent',
      createdBy: '456',
      currentOwner: '456',
      tags: ['1'],
    });

    await item.save();
    const results = await findItemsInDatabase(['1'], 'te');
    expect(results.length).toBeGreaterThan(0);
  });

  test('If both the items and the tags matches an item but there is an additional tag, the item should not be returned', async () => {
    const item = new Item({
      name: 'Test',
      status: 'available',
      typeOfTransaction: 'Rent',
      createdBy: '456',
      currentOwner: '456',
      tags: ['1'],
    });

    await item.save();
    const results = await findItemsInDatabase(['1', '2'], 'te');
    expect(results.length).toBe(0);
  });

  test('If a tag is provided but not the search, 1 item should be returned', async () => {
    const item = new Item({
      name: 'Test',
      status: 'available',
      typeOfTransaction: 'Rent',
      createdBy: '456',
      currentOwner: '456',
      tags: ['1'],
    });

    await item.save();
    const results = await findItemsInDatabase(['1'], '');
    expect(results.length).toBeGreaterThan(0);
  });
});
