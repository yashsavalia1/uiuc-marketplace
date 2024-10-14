import { atom, useAtom } from 'jotai';
import PocketBase, { AuthModel, RecordModel } from 'pocketbase';

export const API_URL = 'https://uiuc-marketplace.pockethost.io';


const pb = new PocketBase(API_URL);

pb.authStore.loadFromCookie(document.cookie);
try {
  pb.authStore.isValid && await pb.collection('users').authRefresh();
} catch (_) {
  pb.authStore.clear();
}

export const pbAtom = atom(pb);

export const usePocketBase = () => useAtom(pbAtom)[0];

export const getImageURL = (record: RecordModel | AuthModel, imageId: string, args?: string) => {
  if (!record) return '';

  return `${API_URL}/api/files/${record.collectionId}/${record.id}/${imageId}${args ? `?${args}` : ''}`;
};