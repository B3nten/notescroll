import { useEffect } from "react"

export const isFunction = (value: unknown): value is Function => typeof value === 'function';

export function useAsyncMount(
	effect: () => AsyncGenerator<void, void, void> | Promise<void>
  ) {
	function isAsyncGenerator(
	  val: AsyncGenerator<void, void, void> | Promise<void>,
	): val is AsyncGenerator<void, void, void> {
		//@ts-ignore
	  return isFunction(val[Symbol.asyncIterator]);
	}
	useEffect(() => {
	  const e = effect();
	  let cancelled = false;
	  async function execute() {
		if (isAsyncGenerator(e)) {
		  while (true) {
			const result = await e.next();
			if (result.done || cancelled) {
			  break;
			}
		  }
		} else {
		  await e;
		}
	  }
	  execute();
	  return () => {
		cancelled = true;
	  };
	},[]);
  }