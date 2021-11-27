import type { PropsWithChildren, ReactNode } from 'react';
import clsx, { ClassValue } from 'clsx';

export interface BaseInputProps {
  title: string;
  helpText?: ReactNode;
  wrapperClassName?: string;
}

export function getInputClass(...className: ClassValue[]) {
  return clsx(
    'block w-full mt-1 border-gray-300 rounded-md shadow-sm',
    'focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
    'disabled:bg-gray-200 disabled:text-gray-400',
    ...className,
  );
}

export default function BaseInput({
  title,
  helpText,
  wrapperClassName,
  children,
}: PropsWithChildren<BaseInputProps>) {
  return (
    <label className={clsx('block w-full', wrapperClassName)}>
      <h3 className="text-gray-700">{title}</h3>
      {children}
      <span className="block text-gray-400">{helpText}</span>
    </label>
  );
}
