import {Schema, model, Types} from "mongoose";

// 1. Creates an interface representing  a document in MongoDB
export interface IItem {
  _id: Types.ObjectId | string | undefined;
  createdBy: string;
  name: string;
  price: number;
  description: string;
  typeOfTransaction: string;
  deliveryInformation: string;
  currentOwner: string;
  durationOfRent?: number;
  tags: [string];
  timeCreated: number;
  status: string;
  offeredBy?: string;
  nextAvailableDate?: number;
  imageURL: string;
  rentalPeriod: number
}

// 2. Create a Schema corresponding to the document interface.
const itemSchema = new Schema<IItem>({
  createdBy: {type: String, required: true},
  name: {type: String, required: true},
  price: {type: Number, required: true, default: 0},
  typeOfTransaction: {type: String, required: true},
  deliveryInformation: {type: String, required: true},
  currentOwner: {type: String, required: true},
  durationOfRent: Number,
  tags: Array<string>,
  timeCreated: {type: Number, required: true, default: Date.now()},
  status: {required: true, type: String, default: "available"},
  offeredBy: String,
  nextAvailableDate: Number,
  imageURL: String,
  rentalPeriod: Number,
});

// 3. Create a Model
export const Item = model<IItem>("items", itemSchema);
