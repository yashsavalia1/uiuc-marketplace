import { RecordModel } from "pocketbase";

export interface Listing extends RecordModel {
  title: string;
  description: string;
  price: number;
  images: string[];
  lister: string;
  published: boolean;
  tags: string[];
  views: number;
}