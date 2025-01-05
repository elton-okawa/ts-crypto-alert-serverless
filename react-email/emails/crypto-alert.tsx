import {
  Body,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

type CryptoAlertProps = {
  rows: {
    code: string;
    yesterday: number;
    lastWeek: number;
    lastMonth: number;
    lastYear: number;
    lastTwoYears: number;
  }[];
};

export default function CryptoAlert(props: CryptoAlertProps) {
  return (
    <Html>
      <Head />
      <Preview>Test</Preview>
      <Tailwind>
        <Body className="font-sans flex flex-col justify-center">
          <Heading>Test</Heading>
          <table className="border-collapse">
            <thead>
              <tr className="border-b border-x-0 border-t-0 border-gray-300 border-solid">
                {['', '1d', '1w', '1m', '1y', '2y'].map((header: string) => (
                  <th key={header} className="font-semibold p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {props.rows.map((row) => (
                <tr
                  key={row.code}
                  className="border-b border-x-0 border-t-0 border-gray-200 border-solid"
                >
                  {Object.values(row).map((value) => {
                    let text = value;
                    let colorClass = '';

                    if (typeof value === 'number') {
                      text = `${value}%`;
                      colorClass = getColorClass(value);
                    }

                    return (
                      <td className={`p-2 text-center ${colorClass}`}>
                        {text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
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
  rows: Array.from({ length: 10 }).map(() => ({
    code: 'BTC',
    yesterday: -5,
    lastWeek: 20,
    lastMonth: 0,
    lastYear: -200,
    lastTwoYears: +100,
  })),
} as CryptoAlertProps;
