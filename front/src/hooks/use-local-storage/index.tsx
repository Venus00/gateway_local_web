import React, { useDebugValue } from "react";
import { z } from "zod";

function parse<T>(key: string, schema: z.ZodType<T>) {
  const item = window.localStorage.getItem(key);
  try {
    return item ? schema.parse(JSON.parse(item)) : schema.parse(undefined);
  } catch (e) {
    if (!item) throw e;
    return schema.parse(undefined);
  }
}

type NonUndefined<T> = T extends undefined ? never : T;

function useLocalStorage<T>(
  key: string,
  schema: z.ZodType<T> & {
    _def: z.ZodDefaultDef<z.ZodType<T>>;
  }
): [NonUndefined<T>, React.Dispatch<React.SetStateAction<NonUndefined<T>>>] {
  const [value, setValue] = React.useState(() => {
    const parsed = parse(key, schema);
    return parsed as NonUndefined<T>;
  });
  useDebugValue(value);

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

export default useLocalStorage;
