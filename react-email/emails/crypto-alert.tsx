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
import Color from 'colorjs.io';

type Decision = 'B' | 'S';

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
    decision: Decision;
    streak: number;
  }[];
};

const BUY_START_COLOR = '#bbff99';
const BUY_END_COLOR = '#ecffe3';
const SELL_START_COLOR = '#ff9696';
const SELL_END_COLOR = '#ffd6d6';
const MAX_STREAK = 30;

export default function CryptoAlert(props: CryptoAlertProps) {
  return (
    <Html>
      <Head />
      <Preview>Test</Preview>
      <Tailwind>
        <Body className="font-sans flex flex-col justify-center">
          <Heading>Percentage</Heading>
          <Table>
            <thead>
              <TableRow className="border-gray-300">
                {['', '1d', '1w', '1m', '1y', '2y'].map((header: string) => (
                  <TableHeader key={header}>{header}</TableHeader>
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
          <Heading>Price</Heading>
          <Table>
            <thead>
              <TableRow className="border-gray-300">
                {[
                  { label: 'Code', width: '50px' },
                  { label: 'Price' },
                  { label: 'R', width: '20px' },
                  { label: 'S', width: '30px' },
                ].map(({ label, width }) => (
                  <TableHeader key={label} className={`w-[${width}]`}>
                    {label}
                  </TableHeader>
                ))}
              </TableRow>
            </thead>
            <tbody>
              {props.price.map((row) => {
                const hexColor = interpolateColor(
                  row.decision,
                  row.streak,
                  MAX_STREAK,
                );

                return (
                  <TableRow key={row.code} className={`bg-[${hexColor}]`}>
                    <TableData>{row.code}</TableData>
                    <TableData>{row.value.toPrecision(6)}</TableData>
                    <TableData>{row.decision}</TableData>
                    <TableData>
                      {row.streak > MAX_STREAK
                        ? `+${MAX_STREAK}`
                        : row.streak.toString()}
                    </TableData>
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

function getColorClass(value: number) {
  if (Math.floor(value) === 0) {
    return 'text-gray-400';
  }

  return value > 0 ? 'text-green-500' : 'text-red-500';
}

function interpolateColor(
  decision: Decision,
  streak: number,
  maxStreak: number,
) {
  const start = new Color(
    decision === 'B' ? BUY_START_COLOR : SELL_START_COLOR,
  );
  const end = new Color(decision === 'B' ? BUY_END_COLOR : SELL_END_COLOR);
  const position = streak > maxStreak ? 1 : streak / maxStreak;

  const interpolate = start.range(end);
  return interpolate(position).to('srgb').toString({ format: 'hex' });
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
  price: Array.from({ length: 10 }, (_, index) => ({
    code: 'BTC',
    value: 123456 / Math.pow(10, index),
    decision: Math.random() > 0.5 ? 'B' : 'S',
    streak: index * index,
  })),
} as CryptoAlertProps;
