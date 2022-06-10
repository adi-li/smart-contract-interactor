import clsx from 'clsx';
import {
  ChangeEventHandler,
  FocusEventHandler,
  useCallback,
  useState,
} from 'react';
import { InputProps } from './types';

export default function RawInput({
  keyPath,
  input,
  onUserInput,
  defaultValue,
  onChange,
  onBlur,
  ...rest
}: InputProps & Omit<JSX.IntrinsicElements['input'], 'defaultValue'>) {
  const [value, setValue] = useState(defaultValue || '');

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setValue(e.target.value);
      onChange?.(e);
    },
    [onChange],
  );

  const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onUserInput?.(keyPath, value);
      onBlur?.(e);
    },
    [onUserInput, onBlur, keyPath, value],
  );

  return (
    <label key={input.name} className="block w-full">
      <span className="text-gray-700">
        {input.name} ({input.type})
      </span>
      <input
        required={input.type !== 'string'}
        type="text"
        className={clsx(
          'block py-2 px-4 w-full rounded-md',
          value.length === 0 && 'italic',
        )}
        data-data-type={input.type}
        placeholder={input.type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
      />
    </label>
  );
}
