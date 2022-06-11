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

function ArrayInput({ keyPath, input, onUserInput, defaultValue }: InputProps) {
  const [array, setArray] = useState<{ id: number; value: any }[]>(() =>
    defaultValue
      ? defaultValue.map((value: any, id: number) => ({ id, value }))
      : [{ id: Date.now(), value: undefined }],
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
      if (input.arrayLength !== -1 && prev.length < input.arrayLength) {
        return prev;
      }
      return prev.concat({ id: Date.now(), value: undefined });
    });
  }, [input.arrayLength]);

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
  const canInsertRow =
    input.arrayLength === -1 || array.length < input.arrayLength;

  return (
    <div className="w-full">
      <label className="text-gray-700">
        {input.name} ({input.type})
      </label>
      <div className="flex flex-col gap-2 pl-4 mt-1 border-l">
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
                input={input.arrayChildren}
                onUserInput={handleInput}
                defaultValue={value}
              />
            </div>
          ))}
        </div>
      </div>
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

  if (input.arrayChildren) {
    return (
      <ArrayInput
        keyPath={input.name}
        input={input}
        onUserInput={handleInput}
        defaultValue={defaultValue}
      />
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

  if (input.baseType === 'bool') {
    return (
      <BooleanInput
        keyPath={keyPath}
        input={input}
        onUserInput={handleInput}
        defaultValue={defaultValue}
      />
    );
  }

  if (input.baseType === 'bytes') {
    return (
      <BytesInput
        keyPath={keyPath}
        input={input}
        onUserInput={handleInput}
        defaultValue={defaultValue}
      />
    );
  }

  if (input.components) {
    return (
      <div className="w-full">
        <label className="text-gray-700">
          {input.name} ({input.type})
        </label>
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
      </div>
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
