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
import { EmphasisText } from './text';

type ColoredField = {
  value: string;
  className: string;
};

type HistoryField = {
  min: ColoredField;
  max: ColoredField;
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
    value: ColoredField;
    decision: Decision;
    streak: string;
    history: {
      lastYear: HistoryField;
      lastTwoYears: HistoryField;
    };
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
          {renderPercentage(props.percentages)}
          <Heading className="text-center">Price</Heading>
          {renderPrices(props.prices)}
        </Body>
      </Tailwind>
    </Html>
  );
}

function renderPercentage(percentages: CryptoAlertProps['percentages']) {
  return (
    <Table className="m-auto">
      <thead>
        <TableRow className="border-gray-300">
          {['', '1d', '1w', '1m', '1y', '2y'].map((header: string) => (
            <TableHeader key={header}>{header}</TableHeader>
          ))}
        </TableRow>
      </thead>
      <tbody>
        {percentages.map((row) => (
          <TableRow key={row.code}>
            <TableData>{row.code}</TableData>
            {Object.entries(row)
              .filter(([key]) => key !== 'code')
              .map(([, coloredField], index) => {
                if (typeof coloredField === 'string') {
                  return;
                }

                return (
                  <TableData key={index} className={coloredField.className}>
                    {coloredField.value}
                  </TableData>
                );
              })}
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}

function renderPrices(prices: CryptoAlertProps['prices']) {
  return (
    <Table className="m-auto">
      <thead>
        <TableRow className="border-gray-300">
          {[
            { label: 'Code', width: '50px' },
            { label: 'Price' },
            { label: '1y' },
            { label: '2y' },
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
        {prices.map((row) => {
          return (
            <TableRow key={row.code} className={`bg-[${row.hexColor}]`}>
              <TableData>{row.code}</TableData>
              <TableData>
                <EmphasisText className={row.value.className}>
                  {row.value.value}
                </EmphasisText>
              </TableData>
              <TableData>
                <EmphasisText
                  className={`text-sx ${row.history.lastYear.min.className}`}
                >
                  {row.history.lastYear.min.value}
                </EmphasisText>

                <EmphasisText
                  className={`text-xs ${row.history.lastYear.max.className}`}
                >
                  {row.history.lastYear.max.value}
                </EmphasisText>
              </TableData>
              <TableData>
                <EmphasisText
                  className={`text-xs ${row.history.lastTwoYears.min.className}`}
                >
                  {row.history.lastTwoYears.min.value}
                </EmphasisText>
                <EmphasisText
                  className={`text-xs ${row.history.lastTwoYears.max.className}`}
                >
                  {row.history.lastTwoYears.max.value}
                </EmphasisText>
              </TableData>
              <TableData>{row.decision}</TableData>
              <TableData>{row.streak}</TableData>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
}

CryptoAlert.PreviewProps = {
  percentages: Array.from({ length: 10 }).map(() => ({
    code: 'BTC',
    yesterday: {
      value: '-5%',
      className: 'text-red-500',
    },
    lastWeek: {
      value: '5%',
      className: 'text-green-500',
    },
    lastMonth: {
      value: '0%',
      className: 'text-gray-400',
    },
    lastYear: {
      value: '-200%',
      className: 'text-red-500',
    },
    lastTwoYears: {
      value: '100%',
      className: 'text-green-500',
    },
  })),
  prices: Array.from({ length: 10 }, (_, index) => ({
    code: 'BTC',
    hexColor: Math.random() > 0.5 ? '#86ff80' : '#ff8a66',
    value: {
      value: (123456 / Math.pow(10, index)).toString(),
      className: 'bg-blue-500 text-white',
    },
    decision: Math.random() > 0.5 ? 'B' : 'S',
    streak: (index * index).toString(),
    history: {
      lastYear: {
        min: { value: '235 10%', className: '' },
        max: { value: '500 40%', className: '' },
      },
      lastTwoYears: {
        min: { value: '100 10%', className: '' },
        max: { value: '1000 80%', className: 'bg-blue-500 text-white' },
      },
    },
  })),
} as CryptoAlertProps;
