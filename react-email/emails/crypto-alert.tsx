import {
  Body,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';
import { Table, TableData, TableRow } from './table';

type CryptoAlertProps = {
  percentage: {
    code: string;
    yesterday: number;
    lastWeek: number;
    lastMonth: number;
    lastYear: number;
    lastTwoYears: number;
  }[];
  price: {
    code: string;
    value: number;
  };
};

export default function CryptoAlert(props: CryptoAlertProps) {
  return (
    <Html>
      <Head />
      <Preview>Test</Preview>
      <Tailwind>
        <Body className="font-sans flex flex-col justify-center">
          <Heading>Test</Heading>
          <Table>
            <thead>
              <TableRow className="border-gray-200">
                {['', '1d', '1w', '1m', '1y', '2y'].map((header: string) => (
                  <th key={header} className="font-semibold p-2">
                    {header}
                  </th>
                ))}
              </TableRow>
            </thead>
            <tbody>
              {props.percentage.map((row) => (
                <TableRow key={row.code}>
                  {Object.values(row).map((value, index) => {
                    let text = value;
                    let colorClass = '';

                    if (typeof value === 'number') {
                      text = `${value}%`;
                      colorClass = getColorClass(value);
                    }

                    return (
                      <TableData key={index} className={colorClass}>
                        {text}
                      </TableData>
                    );
                  })}
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Body>
      </Tailwind>
    </Html>
  );
}

function getColorClass(value: number) {
  if (Math.floor(value) === 0) {
    return 'text-gray-400';
  }

  return value > 0 ? 'text-green-500' : 'text-red-500';
}

CryptoAlert.PreviewProps = {
  percentage: Array.from({ length: 10 }).map(() => ({
    code: 'BTC',
    yesterday: -5,
    lastWeek: 20,
    lastMonth: 0,
    lastYear: -200,
    lastTwoYears: +100,
  })),
} as CryptoAlertProps;
