import {
  useState,
  useCallback,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";

export const useInput = <T = any>(
  initialData: T
): [
  T,
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  Dispatch<SetStateAction<T>>
] => {
  const [value, setValue] = useState(initialData);

  const handler = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);

  return [value, handler, setValue];
};
