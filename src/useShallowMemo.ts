import { useMemo } from "react";

export function useShallowMemo<T extends Record<string, any>>(object: T) {
  return useMemo(() => {
    return object;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.entries(object).flat());
}
