import { Button, Html } from '@react-email/components';
import * as React from 'react';

export default function CryptoAlert() {
  return (
    <Html>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Price</th>
            <th>Yesterday</th>
            <th>Last Week</th>
            <th>Last Month</th>
            <th>Last 6 Months</th>
            <th>Last Year</th>
            <th>Last 2 Years</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>BTC</td>
            <th>$500</th>
            <th>-5.00%</th>
            <th>+20.25%</th>
            <th>0%</th>
            <th>+100.00%</th>
            <th>-200.00%</th>
            <th>+500.00%</th>
          </tr>
        </tbody>
      </table>
    </Html>
  );
}
