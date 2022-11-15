
import React from 'react';
import { contextVariables } from '../contextVariables';
import makeRequest from '../makeRequest';
import PropTypes from 'prop-types'
// Components from https://recharts.org/en-US/examples/SimpleBarChart from recharts library
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

export default function ProfitGraph ({ lId }) {
  const { getters } = React.useContext(contextVariables);
  const [plotData, setPlotData] = React.useState();

  React.useEffect(() => {
    makeRequest('/bookings', 'get', undefined, getters.token).then((res) => {
      const listingBookings = res.bookings.filter(booking => booking.listingId === lId.toString() && booking.status === 'accepted');
      const filteredData = [];
      listingBookings.forEach((booking) => {
        const range = booking.dateRange;
        let start = new Date().getTime() - new Date(range.start).getTime();
        start = Math.ceil(start / (1000 * 3600 * 24));

        if (start <= 30 && start >= 0) {
          let length = new Date(range.end).getTime() - new Date(range.start).getTime();
          length = Math.ceil(length / (1000 * 3600 * 24));
          const price = booking.totalPrice;
          filteredData.push({ length, start, price });
        }
      })
      const data = [];
      for (let i = 0; i <= 30; i += 1) {
        data.push({
          daysAgo: i,
          profit: 0
        });
      }
      filteredData.forEach((res) => {
        let index = res.start
        let interval = res.length
        while (index >= 0 && index <= 30 && interval > 0) {
          data[index].profit += res.price
          index -= 1
          interval -= 1
        }
      });
      setPlotData(data);
    })
  }, []);

  return (<>
    <BarChart
      width={370}
      height={340}
      data={plotData}
      margin={{
        top: 5,
        right: 10,
        left: -5,
        bottom: 50,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="daysAgo">
        <Label value="Days ago" position="bottom" offset={30}></Label>
      </XAxis>
      <YAxis>
        <Label value="Profit made" position="left" angle="-90" offset={-20}></Label>
      </YAxis>
      <Tooltip />
      <Legend />
      <Bar dataKey="profit" fill="#82ca9d" />
    </BarChart>
  </>);
}

ProfitGraph.propTypes = {
  lId: PropTypes.number
}
