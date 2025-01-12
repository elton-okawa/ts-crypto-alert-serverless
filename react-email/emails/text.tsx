import { PropsWithChildren } from 'react';
import React = require('react');

export type EmphasisTextProps = PropsWithChildren<{
  className?: string;
}>;

export const EmphasisText = ({ children, className }: EmphasisTextProps) => (
  <p className={`m-0 p-px rounded text-nowrap ${className ?? ''}`}>
    {children}
  </p>
);
