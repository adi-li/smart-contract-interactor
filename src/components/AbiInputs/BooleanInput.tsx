import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { InputProps } from './types';

export default function BooleanInput({
  keyPath,
  input,
  onUserInput,
  defaultValue,
  onChange,
  ...rest
}: InputProps & Omit<JSX.IntrinsicElements['input'], 'defaultValue'>) {
  const [value, setValue] = useState(defaultValue || false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setValue(e.target.checked);
      onChange?.(e);
    },
    [onChange],
  );

  useEffect(() => {
    onUserInput?.(keyPath, value);
  }, [onUserInput, keyPath, value]);

  return (
    <label key={input.name} className="flex gap-2 items-center">
      <input type="checkbox" value={value} onChange={handleChange} {...rest} />
      <span className="text-gray-700">
        {input.name} ({input.type})
      </span>
    </label>
  );
}
