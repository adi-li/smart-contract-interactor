import toWei from '@/utils/toWei';
import clsx from 'clsx';
import {
  ChangeEventHandler,
  FocusEventHandler,
  ReactNode,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';
import type { Unit } from 'web3-utils';
import { InputProps } from './types';

const UNITS_MAP: { label: ReactNode; value: Unit; minBits: number }[] = [
  { label: <>&times; 1 (wei)</>, value: 'wei', minBits: 0 },
  { label: <>&times; 10&#x00b3; (kwei)</>, value: 'kwei', minBits: 16 },
  { label: <>&times; 10&#x2076; (mwei)</>, value: 'mwei', minBits: 24 },
  {
    label: <>&times; 10&#x2079; (gwei)</>,
    value: 'gwei',
    minBits: 32,
  },
  {
    label: <>&times; 10&#x00b9;&#x2078; (eth)</>,
    value: 'ether',
    minBits: 64,
  },
];

interface NumberInputProps
  extends InputProps,
    Omit<JSX.IntrinsicElements['input'], 'defaultValue'> {
  type: 'uint' | 'int';
  bits: number;
}

export default function NumberInput({
  type,
  bits,
  keyPath,
  input,
  onUserInput,
  defaultValue,
  onChange,
  onBlur,
  ...rest
}: NumberInputProps) {
  const id = useId();
  const [value, setValue] = useState(defaultValue || '');
  const [unit, setUnit] = useState<Unit>(UNITS_MAP[0].value);

  const pattern = useMemo(() => {
    const base = unit === 'wei' ? '[0-9]+' : '[0-9]+\\.?[0-9]*';
    return type === 'uint' ? base : type === 'int' ? `-?${base}` : undefined;
  }, [type, unit]);

  const units = useMemo(
    () => UNITS_MAP.filter(({ minBits }) => bits >= minBits),
    [bits],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setValue(e.target.value);
      onChange?.(e);
    },
    [onChange],
  );

  const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onUserInput?.(keyPath, toWei(value, unit));
      onBlur?.(e);
    },
    [onUserInput, onBlur, unit, keyPath, value],
  );

  const onUnitChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      const unit = e.target.value as Unit;
      setUnit(unit);
      onUserInput?.(keyPath, toWei(value, unit));
    },
    [keyPath, onUserInput, value],
  );

  return (
    <div className="w-full">
      <label htmlFor={id} key={input.name} className="text-gray-700">
        {input.name} ({input.type})
      </label>
      <div className="flex">
        <input
          id={id}
          className={clsx(
            'grow',
            units.length > 1 ? 'rounded-l-md' : 'rounded-md',
            value.length === 0 && 'italic',
          )}
          required
          type="text"
          data-data-type={input.type}
          placeholder={input.type}
          pattern={pattern}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          {...rest}
        />
        {units.length > 1 ? (
          <select
            onChange={onUnitChange}
            className="rounded-r-md border-l-transparent"
          >
            {units.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : null}
      </div>
    </div>
  );
}

export function extractNumberType(type: string): {
  type: 'uint' | 'int' | undefined;
  bits: number;
} {
  const matches = type.match(/^(u?int)(\d+)?$/);
  const bits = matches?.[2];
  return {
    type: matches?.[1] as 'uint' | 'int',
    bits: bits ? parseInt(bits) : 256,
  };
}
