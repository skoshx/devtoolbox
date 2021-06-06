import { Writable, writable } from 'svelte/store';
import { Spring } from 'wobble';

interface SpringOpts {
	stiffness?: number;
	damping?: number;
	precision?: number;
}

interface SpringUpdateOpts {
	hard?: any;
	soft?: string | number | boolean;
}

type Updater<T> = (target_value: T, value: T) => T;

export interface StoreSpring<T> extends Writable<T>{
	set: (new_value: number, opts?: SpringUpdateOpts) => void;
	// update: (fn: Updater<T>, opts?: SpringUpdateOpts) => Promise<void>;
  update: (fn, opts?: SpringUpdateOpts) => void;
  subscribe: any;
	precision: number;
	damping: number;
	stiffness: number;
}

export function spring<T=any>(value: T, opts: SpringOpts = {}): StoreSpring<T> {
	const store = writable(value);
	const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;

  const springs = {};

  // Value -> 0
  // Value { x: 0, y: 0 };

  if (typeof value === 'number') {
    // Number
    const spring = new Spring({ fromValue: value, toValue: value, stiffness, damping });
    springs[0] = spring;
  } else if (typeof value === 'object') {
    // Object
    for (const k in value) {
      const spring = new Spring({ fromValue: value[k], toValue: value[k], stiffness, damping });
      springs[k] = spring;
      springs[k].onUpdate((s) => {
        console.log("UPDATE");
        store.set({ [k]: s.currentValue });
      });
    }
  } else {
    throw Error(`Cannot animate values of type ${typeof value}.`);
  }

  // const dhoSpring = new Spring({ fromValue: value, toValue: value, stiffness, damping });

  // dhoSpring.onUpdate((s) => { store.set(s.currentValue); })

	function set(new_value: T, opts: SpringUpdateOpts = {}): void {
    console.log("Setting");
    if (typeof value === 'number') {
      springs[0].updateConfig({ toValue: value });
      springs[0].onUpdate((s) => {
        console.log("UPDATE");
        store.set(s.currentValue);
      });
      springs[0].start();
    } else if (typeof value === 'object') {
      console.log("Updating object")
      for (const k in value) {
        springs[k].updateConfig({ toValue: value[k] });
        springs[k].onUpdate((s) => {
          console.log("UPDATE");
          store.set({ [k]: s.currentValue });
        });
        console.log(springs[k]);
        springs[k].start();
      }
      console.log(springs);
    } else {
      throw Error(`Cannot animate values of type ${typeof value}.`);
    }
    // dhoSpring.updateConfig({ toValue: new_value });
    // dhoSpring.start();
	}

  function update(fn, opts: SpringUpdateOpts) {
    const currentValues = {};
    for (const k in springs) {
      currentValues[k] = springs[k].currentValue;
    }
    return set(fn(currentValues, value));
  }

	const spring: StoreSpring<T> = {
		set,
		// update: (fn, opts: SpringUpdateOpts) => set(fn(target_value, value), opts),
    update,
		subscribe: store.subscribe,
		stiffness,
		damping,
		precision
	};

	return spring;
}
