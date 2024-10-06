import PocketBase, { RecordModel } from 'pocketbase';

export const API_URL = 'https://uiuc-marketplace.pockethost.io';

export const pb = new PocketBase(API_URL);

export const getImageURL = (record: RecordModel, imageId: string) => {
    return `${API_URL}/api/files/${record.collectionId}/${record.id}/${imageId}`;
};