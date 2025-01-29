import { encryptData, decryptData } from './utils/encryption';

export const storeGet = async (key) => {
  const encryptedData = await window.electronAPI.storeGet(key);
  return encryptedData ? decryptData(encryptedData) : null;
};

export const storeSet = async (key, value) => {
  const encryptedData = encryptData(value);
  return window.electronAPI.storeSet(key, encryptedData);
};
