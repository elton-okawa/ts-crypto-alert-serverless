import { PropsWithChildren } from 'react';
import React = require('react');

type Props = {
  className?: string;
};

export const Table: React.FC<PropsWithChildren<Props>> = ({
  children,
  className = '',
}) => {
  return <table className={`border-collapse ${className}`}>{children}</table>;
};

export const TableRow: React.FC<PropsWithChildren<Props>> = ({
  children,
  className = '',
}) => {
  return (
    <tr
      className={`border-b border-x-0 border-t-0 border-gray-300 border-solid ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableData: React.FC<PropsWithChildren<Props>> = ({
  children,
  className = '',
}) => {
  return <td className={`p-2 text-center ${className}`}>{children}</td>;
};
