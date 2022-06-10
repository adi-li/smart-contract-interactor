import clsx from 'clsx';
import {
  ChangeEventHandler,
  FocusEventHandler,
  useCallback,
  useState,
} from 'react';
import { InputProps } from './types';

export default function BytesInput({
  keyPath,
  input,
  onUserInput,
  defaultValue,
  onChange,
  onBlur,
  ...rest
}: InputProps & Omit<JSX.IntrinsicElements['textarea'], 'defaultValue'>) {
  const [value, setValue] = useState(defaultValue || '');

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      setValue(e.target.value);
      onChange?.(e);
    },
    [onChange],
  );

  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = useCallback(
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
      <textarea
        required={input.type !== 'string'}
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
