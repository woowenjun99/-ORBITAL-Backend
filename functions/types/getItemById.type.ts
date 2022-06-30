import {IItem} from "../mongoose/item_model";

export type data = {
  itemId: string;
};

export type foundItem = (Document & IItem) | null;
