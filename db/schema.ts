import {sqliteTable,integer,text,primaryKey,uniqueIndex} from 'drizzle-orm/sqlite-core';

export const commonsRealm=sqliteTable('commons_realm',{
 id:integer('id').primaryKey(),state:text('state').notNull(),checksum:text('checksum').notNull(),
 revision:integer('revision').notNull(),secret:text('secret').notNull(),headHash:text('head_hash').notNull(),commitId:text('commit_id').notNull(),
});
export const commonsCredentials=sqliteTable('commons_credentials',{
 id:text('id').primaryKey(),tokenHash:text('token_hash').notNull(),playerId:text('player_id').notNull(),role:text('role').notNull(),expiresAt:integer('expires_at').notNull(),
},table=>[uniqueIndex('commons_credentials_token_hash').on(table.tokenHash)]);
export const commonsArrivals=sqliteTable('commons_arrivals',{
 keyHash:text('key_hash').primaryKey(),name:text('name').notNull(),credentialId:text('credential_id').notNull(),
});
export const commonsReceipts=sqliteTable('commons_receipts',{
 credentialId:text('credential_id').notNull(),commandKey:text('command_key').notNull(),bytes:text('bytes').notNull(),receipt:text('receipt').notNull(),checksum:text('checksum').notNull(),
},table=>[primaryKey({columns:[table.credentialId,table.commandKey]})]);
export const commonsJournal=sqliteTable('commons_journal',{
 revision:integer('revision').primaryKey(),at:integer('at').notNull(),playerId:text('player_id').notNull(),credentialId:text('credential_id').notNull(),op:text('op').notNull(),transfers:text('transfers').notNull(),previousHash:text('previous_hash').notNull(),hash:text('hash').notNull(),
});
export const commonsLimits=sqliteTable('commons_limits',{
 principal:text('principal').primaryKey(),window:integer('window').notNull(),count:integer('count').notNull(),
});
