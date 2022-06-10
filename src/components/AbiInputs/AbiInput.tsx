/* eslint-disable @typescript-eslint/no-explicit-any */
import set from 'lodash.set';
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import BooleanInput from './BooleanInput';
import BytesInput from './BytesInput';
import NumberInput, { extractNumberType } from './NumberInput';
import RawInput from './RawInput';
import { InputProps } from './types';

function ArrayInput({
  type,
  maxLength,
  keyPath,
  input,
  onUserInput,
  defaultValue,
}: { type: string; maxLength: number } & InputProps) {
  const [array, setArray] = useState<{ id: number; value: any }[]>(() =>
    defaultValue
      ? defaultValue.map((value: any, id: number) => ({ id, value }))
      : [{ id: Date.now(), value: undefined }],
  );

  const inputItem = useMemo(
    () => ({
      ...input,
      type,
      name: `${input.name} item`,
    }),
    [input, type],
  );

  const handleInput = useCallback((id: string, value: any) => {
    setArray((prev) => {
      const index = prev.findIndex((item) => item.id.toString() === id);
      if (index === -1) return prev;
      const { value: oldValue } = prev[index];
      if (value === oldValue) return prev;
      const newArray = [...prev];
      newArray[index].value = value;
      return newArray;
    });
  }, []);

  const handleInsertRow = useCallback(() => {
    setArray((prev) => {
      if (maxLength && prev.length >= maxLength) return prev;
      return prev.concat({ id: Date.now(), value: undefined });
    });
  }, [maxLength]);

  const handleRemoveRow: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      const { rowId } = e.currentTarget.dataset;
      setArray((prev) => prev.filter(({ id }) => id.toString() !== rowId));
    },
    [],
  );

  useEffect(() => {
    onUserInput?.(
      keyPath,
      array.map(({ value }) => value),
    );
  }, [array, keyPath, onUserInput]);

  const hasMultipleItems = array.length > 1;
  const canInsertRow = !maxLength || array.length < maxLength;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <button
          className="py-1 px-2 disabled:text-gray-400 hover:bg-indigo-100 disabled:bg-gray-200 rounded-md border disabled:cursor-not-allowed"
          type="button"
          onClick={handleInsertRow}
          disabled={!canInsertRow}
        >
          + New Row
        </button>
      </div>
      {array.map(({ id, value }) => (
        <div key={id} className="flex gap-2">
          {hasMultipleItems && (
            <div className="self-start">
              <button
                className="w-6 h-6 disabled:text-gray-400 hover:bg-indigo-100 disabled:bg-gray-200 rounded-md border disabled:cursor-not-allowed"
                type="button"
                onClick={handleRemoveRow}
                data-row-id={id}
              >
                -
              </button>
            </div>
          )}
          <AbiInput
            keyPath={id.toString()}
            input={inputItem}
            onUserInput={handleInput}
            defaultValue={value}
          />
        </div>
      ))}
    </div>
  );
}

export default function AbiInput({
  keyPath,
  input,
  onUserInput,
  defaultValue,
}: InputProps) {
  const [object, setObject] = useState<any>(defaultValue);

  const [arrayType, arrayLength] = useMemo(() => {
    const matches = input.type.match(/^([\w_]+)\[(\d*)\]$/);
    return [matches?.[1], parseInt(matches?.[2] || '0')] as [
      string | undefined,
      number,
    ];
  }, [input.type]);

  const numberProps = useMemo(
    () => extractNumberType(input.type),
    [input.type],
  );

  const handleInput = useCallback(
    (subKeyPath: string, value: any) => {
      if (input.type !== 'tuple') {
        setObject(value);
        return;
      }
      setObject((prev: any) => ({ ...set(prev || {}, subKeyPath, value) }));
    },
    [input.type],
  );

  useEffect(() => {
    onUserInput(keyPath, object);
  }, [object, keyPath, onUserInput]);

  if (arrayType || input.type === 'tuple') {
    return (
      <div className="w-full">
        <label className="text-gray-700">
          {input.name} ({input.type})
        </label>
        {arrayType ? (
          <div className="flex flex-col gap-2 pl-4 mt-1 border-l">
            <ArrayInput
              type={arrayType}
              maxLength={arrayLength}
              keyPath={input.name}
              input={input}
              onUserInput={handleInput}
              defaultValue={defaultValue}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 pl-4 mt-1 border-l">
            {input.components?.map((subInput, i) => (
              <AbiInput
                key={subInput.name || i}
                keyPath={subInput.name}
                input={subInput}
                onUserInput={handleInput}
                defaultValue={defaultValue?.[subInput.name]}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (numberProps.type) {
    return (
      <NumberInput
        keyPath={keyPath}
        input={input}
        onUserInput={handleInput}
        type={numberProps.type}
        bits={numberProps.bits}
        defaultValue={defaultValue}
      />
    );
  }

  if (input.type === 'bool') {
    return (
      <BooleanInput
        keyPath={keyPath}
        input={input}
        onUserInput={handleInput}
        defaultValue={defaultValue}
      />
    );
  }

  if (input.type === 'bytes') {
    return (
      <BytesInput
        keyPath={keyPath}
        input={input}
        onUserInput={handleInput}
        defaultValue={defaultValue}
      />
    );
  }

  return (
    <RawInput
      keyPath={keyPath}
      input={input}
      onUserInput={handleInput}
      defaultValue={defaultValue}
    />
  );
}
