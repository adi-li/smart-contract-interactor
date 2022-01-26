import clsx, { ClassValue } from 'clsx';
import type { PropsWithChildren, ReactNode } from 'react';

export interface BaseInputProps {
  title: string;
  helpText?: ReactNode;
  wrapperClassName?: string;
}

export function getInputClass(...className: ClassValue[]) {
  return clsx(
    'block mt-1 w-full rounded-md border-gray-300 shadow-sm',
    'focus:border-indigo-300 focus:ring focus:ring-indigo-200/50',
    'disabled:text-gray-400 disabled:bg-gray-200',
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
