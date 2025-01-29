import Dexie from 'dexie';
import { encryptData, decryptData } from './encryption';

const db = new Dexie('MailTmManager');
db.version(1).stores({
  accounts: '++id,address',
  emails: '++id,accountId,sender,subject,date,content'
});

export const storeAccount = async (account) => {
  const encryptedAccount = encryptData(account);
  return db.accounts.put(encryptedAccount);
};

export const getAccounts = async () => {
  const accounts = await db.accounts.toArray();
  return accounts.map(account => decryptData(account));
};

export const storeEmail = async (accountId, email) => {
  const encryptedEmail = encryptData(email);
  return db.emails.put({ ...encryptedEmail, accountId });
};

export const getEmails = async (accountId, options = {}) => {
  let query = db.emails.where('accountId').equals(accountId);

  if (options.startDate && options.endDate) {
    query = query.and(email => {
      const date = new Date(email.date);
      return date >= options.startDate && date <= options.endDate;
    });
  }

  if (options.sender) {
    query = query.and(email => email.sender.toLowerCase().includes(options.sender.toLowerCase()));
  }

  if (options.subject) {
    query = query.and(email => email.subject.toLowerCase().includes(options.subject.toLowerCase()));
  }

  if (options.content) {
    query = query.and(email => email.content.toLowerCase().includes(options.content.toLowerCase()));
  }

  const encryptedEmails = await query.toArray();
  return encryptedEmails.map(email => decryptData(email));
};

export const deleteEmail = async (id) => {
  return db.emails.delete(id);
};

export const clearAllData = async () => {
  await db.emails.clear();
  await db.accounts.clear();
};
