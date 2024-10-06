import { RecordModel } from "pocketbase";

export interface Listing extends RecordModel {
  title: string;
  description: string;
  price: number;
  lister: string;
  images: string[];
}