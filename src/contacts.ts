import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export interface Contact {
	id: string;
	createdAt: number;
	first?: string;
	last?: string;
	avatar?: string;
	twitter?: string;
	notes?: string;
	favorite?: boolean;
}

export async function getContacts(query?: string | null) {
	await fakeNetwork(`getContacts:${query}`);
	let contacts: Contact[] | null = await localforage.getItem("contacts");
	if (!contacts) contacts = [];
	if (query) {
		contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
	}
	return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
	await fakeNetwork();
	const id = Math.random().toString(36).substring(2, 9);
	const contact = { id, createdAt: Date.now() };
	const contacts = await getContacts();
	contacts.unshift(contact);
	await set(contacts);
	return contact;
}

export async function getContact(id: string) {
	await fakeNetwork(`contact:${id}`);
	const contacts: Contact[] | null = await localforage.getItem("contacts");
	const contact = contacts?.find((contact) => contact.id === id);
	return contact ?? null;
}

interface IObject {
	[key: string]: string | number | boolean;
}

export async function updateContact(id: string, updates: IObject) {
	await fakeNetwork();
	const contacts: Contact[] | null = await localforage.getItem("contacts");
	const contact = contacts?.find((contact) => contact.id === id);
	if (!contact) throw new Error(`No contact found for, ${id}`);
	Object.assign(contact, updates);
	await set(contacts);
	return contact;
}

export async function deleteContact(id: string) {
	const contacts: Contact[] | null = await localforage.getItem("contacts");
	const index = contacts?.findIndex((contact) => contact.id === id);
	if (index && index > -1) {
		contacts?.splice(index, 1);
		await set(contacts);
		return true;
	}
	return false;
}

function set(contacts: Contact[] | null) {
	return localforage.setItem("contacts", contacts);
}

interface FakeCache {
	[key: string]: boolean;
}
// fake a cache so we don't slow down stuff we've already seen
let fakeCache: FakeCache = {};

async function fakeNetwork(key?: string | undefined) {
	if (typeof key === "undefined") {
		if (!key) {
			fakeCache = {};
		}
	} else {
		if (fakeCache[key]) {
			return;
		}

		fakeCache[key] = true;
		return new Promise((res) => {
			setTimeout(res, Math.random() * 800);
		});
	}
}
