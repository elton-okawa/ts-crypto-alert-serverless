import {
  Body,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';
import { Table, TableData, TableHeader, TableRow } from './table';

type ColoredField = {
  value: string;
  colorClass: string;
};

type Decision = 'B' | 'S';

type CryptoAlertProps = {
  percentages: {
    code: string;
    yesterday: ColoredField;
    lastWeek: ColoredField;
    lastMonth: ColoredField;
    lastYear: ColoredField;
    lastTwoYears: ColoredField;
  }[];
  prices: {
    hexColor: string;
    code: string;
    value: string;
    decision: Decision;
    streak: string;
  }[];
};

export default function CryptoAlert(props: CryptoAlertProps) {
  return (
    <Html>
      <Head />
      <Preview>Crypto Alert</Preview>
      <Tailwind>
        <Body className="font-sans w-full">
          <Heading className="text-center">Percentage</Heading>
          <Table className="m-auto">
            <thead>
              <TableRow className="border-gray-300">
                {['', '1d', '1w', '1m', '1y', '2y'].map((header: string) => (
                  <TableHeader key={header}>{header}</TableHeader>
                ))}
              </TableRow>
            </thead>
            <tbody>
              {props.percentages.map((row) => (
                <TableRow key={row.code}>
                  <TableData>{row.code}</TableData>
                  {Object.entries(row)
                    .filter(([key]) => key !== 'code')
                    .map(([, coloredField], index) => {
                      if (typeof coloredField === 'string') {
                        return;
                      }

                      return (
                        <TableData
                          key={index}
                          className={coloredField.colorClass}
                        >
                          {coloredField.value}
                        </TableData>
                      );
                    })}
                </TableRow>
              ))}
            </tbody>
          </Table>
          <Heading className="text-center">Price</Heading>
          <Table className="m-auto">
            <thead>
              <TableRow className="border-gray-300">
                {[
                  { label: 'Code', width: '50px' },
                  { label: 'Price' },
                  { label: 'R', width: '20px' },
                  { label: 'S', width: '30px' },
                ].map(({ label, width }) => (
                  <TableHeader
                    key={label}
                    className={`${width ? `w-[${width}]` : ''}`}
                  >
                    {label}
                  </TableHeader>
                ))}
              </TableRow>
            </thead>
            <tbody>
              {props.prices.map((row) => {
                return (
                  <TableRow key={row.code} className={`bg-[${row.hexColor}]`}>
                    <TableData>{row.code}</TableData>
                    <TableData>{row.value}</TableData>
                    <TableData>{row.decision}</TableData>
                    <TableData>{row.streak}</TableData>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        </Body>
      </Tailwind>
    </Html>
  );
}

CryptoAlert.PreviewProps = {
  percentages: Array.from({ length: 10 }).map(() => ({
    code: 'BTC',
    yesterday: {
      value: '-5%',
      colorClass: 'text-red-500',
    },
    lastWeek: {
      value: '5%',
      colorClass: 'text-green-500',
    },
    lastMonth: {
      value: '0%',
      colorClass: 'text-gray-400',
    },
    lastYear: {
      value: '-200%',
      colorClass: 'text-red-500',
    },
    lastTwoYears: {
      value: '100%',
      colorClass: 'text-green-500',
    },
  })),
  prices: Array.from({ length: 10 }, (_, index) => ({
    code: 'BTC',
    hexColor: Math.random() > 0.5 ? '#86ff80' : '#ff8a66',
    value: (123456 / Math.pow(10, index)).toString(),
    decision: Math.random() > 0.5 ? 'B' : 'S',
    streak: (index * index).toString(),
  })),
} as CryptoAlertProps;
