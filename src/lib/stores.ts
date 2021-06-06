import { Readable, StartStopNotifier, Subscriber, Unsubscriber, Updater, writable } from 'svelte/store';
import { run_all, subscribe, noop, safe_not_equal, is_function, get_store_value } from 'svelte/internal';

export const dark = writable<boolean>(false);

// Custom stores (stores really should have a `get` functi)
/*
  Custom stores, because svelte stores don't have a get function, which they should.
  In many cases, you might want to get the value of a store, without using the $ syntax,
  since that only works for stores declared at the top of your script, so if you were
  trying to do anything more complicated, like programmatically update many springs
  and update the dom based on their location, the default stores just dont suffice.
*/


/** Writable interface for both updating and subscribing. */
export interface Gettable<T> extends Readable<T> {
	/**
	 * Set value and inform subscribers.
	 * @param value to set
	 */
	set(this: void, value: T): void;

  /**
   * Get the value of the store. 
   */
  get(this: void): T;

	/**
	 * Update value using callback and inform subscribers.
	 * @param updater callback
	 */
	update(this: void, updater: Updater<T>): void;
}

/** Cleanup logic callback. */
type Invalidator<T> = (value?: T) => void;

/** Pair of subscriber and invalidator. */
type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidator<T>];

const subscriber_queue = [];

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
export function gettable<T>(value?: T, start: StartStopNotifier<T> = noop): Gettable<T> {
	let stop: Unsubscriber;
	const subscribers: Array<SubscribeInvalidateTuple<T>> = [];

	function set(new_value: T): void {
		if (safe_not_equal(value, new_value)) {
			value = new_value;
			if (stop) { // store is ready
				const run_queue = !subscriber_queue.length;
				for (let i = 0; i < subscribers.length; i += 1) {
					const s = subscribers[i];
					s[1]();
					subscriber_queue.push(s, value);
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) {
						subscriber_queue[i][0](subscriber_queue[i + 1]);
					}
					subscriber_queue.length = 0;
				}
			}
		}
	}

  function get(): T {
    return value;
  };

	function update(fn: Updater<T>): void {
		set(fn(value));
	}

	function subscribe(run: Subscriber<T>, invalidate: Invalidator<T> = noop): Unsubscriber {
		const subscriber: SubscribeInvalidateTuple<T> = [run, invalidate];
		subscribers.push(subscriber);
		if (subscribers.length === 1) {
			stop = start(set) || noop;
		}
		run(value);

		return () => {
			const index = subscribers.indexOf(subscriber);
			if (index !== -1) {
				subscribers.splice(index, 1);
			}
			if (subscribers.length === 0) {
				stop();
				stop = null;
			}
		};
	}

	return { set, get, update, subscribe };
}