import { RecordModel } from "pocketbase";

export interface Message extends RecordModel {
    message: string;
    sender: string;
    receiver: string;
}