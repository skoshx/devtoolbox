// Some utility functions

import { browser } from '$app/env';
import type { JSONValue } from '@sveltejs/kit/types/endpoint';
import { getCookie } from './cookie';

export type GetBodyType = string[][] | Record<string, string> | string | URLSearchParams;

async function _get(endpoint: string, body: GetBodyType = null) {
	const response = await fetch(`${endpoint}${body ? `?${new URLSearchParams(body)}` : ''}`, {
		method: 'GET',
		headers: { accept: 'application/json' }
	});
	return response;
}

async function _post(endpoint: string, body: BodyInit = null) {
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { accept: 'application/json' },
		body
	});
	return response;
}

export async function postReq(endpoint: string, body: BodyInit = null) {
	return await (await _post(endpoint, body)).json();
}

export async function getReq(endpoint: string, body?: GetBodyType) {
	return await (await _get(endpoint, body)).json();
}

export async function postTextReq(endpoint: string, body: BodyInit = null) {
	return await (await _post(endpoint, body)).text();
}

export async function getTextReq(endpoint: string, body?: GetBodyType) {
	return await (await _get(endpoint, body)).text();
}

// API responses and types

export interface APIResponse {
	[key: string]: JSONValue;
	success: boolean;
	response: any;
	comment: string;
}

export interface APIError {
	[key: string]: JSONValue;
	name: string;
	message: string;
	stack: string;
}

export function makeError(name: string, message: string = '', stack = ''): APIError {
	return { name, message, stack };
}

export function isDarkMode() {
	const dark =
		getCookie('dark') ??
		(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
	return dark;
}
