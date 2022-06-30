import {IItem} from "../mongoose/item_model";

export type data = {
  id: string;
};

export type foundItem = (Document & IItem) | null;
