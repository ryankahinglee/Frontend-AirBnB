import { shallow } from 'enzyme';
import Availability from '../components/Availability';
import * as React from 'react';
// From material ui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button } from '@mui/material';
const noop = () => {};

describe('Availability', () => {
  it('renders Availability component', () => {
    const wrapper = shallow(<Availability start={'dummyDate'} end={'dummyDate2'} availStartSetter={noop} availEndSetter={noop} availDelete={noop} />);
    const div = wrapper.find(Box);
    expect(div).toHaveLength(1);
    const inputs = wrapper.find(DatePicker)
    expect(inputs).toHaveLength(2);
    const button = wrapper.find(Button);
    expect(button).toHaveLength(1);
    const startInput = inputs.get(0);
    expect(shallow(startInput).prop('value')).toBe('dummyDate');
    const endInput = inputs.get(1);
    expect(shallow(endInput).prop('value')).toBe('dummyDate2');
  });
  it('deletes availability on click of the delete button', () => {
    const click = jest.fn();
    const wrapper = shallow(<Availability start={null} end={null} availStartSetter={noop} availEndSetter={noop} availDelete={click} />);
    const button = wrapper.find(Button);
    expect(button).toHaveLength(1);
    button.simulate('click');
    expect(click).toHaveBeenCalledTimes(1);
  });
  it('should trigger the start date on change function on change', () => {
    const mockFn = jest.fn();
    const wrapper = shallow(<Availability start={'dummyDate'} end={'dummyDate2'} availStartSetter={mockFn} availEndSetter={noop} availDelete={noop} />);
    const inputs = wrapper.find(DatePicker)
    expect(inputs).toHaveLength(2);
    const startInput = shallow(inputs.get(0));
    expect(startInput.prop('value')).toBe('dummyDate');
    const event = {
      $M: 1,
      $Y: 1,
      $D: 1
    }
    startInput.simulate('change', event);
    expect(mockFn).toHaveBeenCalledWith('1-2-1');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should trigger the end date on change function on change', () => {
    const mockFn = jest.fn();
    const wrapper = shallow(<Availability start={'dummyDate'} end={'dummyDate2'} availStartSetter={mockFn} availEndSetter={mockFn} availDelete={noop} />);
    const inputs = wrapper.find(DatePicker)
    expect(inputs).toHaveLength(2);
    const endInput = shallow(inputs.get(1));
    expect(endInput.prop('value')).toBe('dummyDate2');
    const event = {
      $M: 1,
      $Y: 1,
      $D: 1
    }
    endInput.simulate('change', event);
    expect(mockFn).toHaveBeenCalledWith('1-2-1');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should change the availabilty start input value on change', () => {
    const mockFn = (value) => {
      startDate = value;
    }
    let startDate = 'dummyDate';
    const wrapper = shallow(<Availability start={startDate} end={'dummyDate2'} availStartSetter={mockFn} availEndSetter={noop} availDelete={noop} />);
    const inputs = wrapper.find(DatePicker)
    expect(inputs).toHaveLength(2);
    const startInput = shallow(inputs.get(0));
    expect(startInput.prop('value')).toBe('dummyDate');
    const event = {
      $M: 1,
      $Y: 1,
      $D: 1
    }
    startInput.simulate('change', event);
    expect(startDate).toStrictEqual('1-2-1');
  });
  it('should change the availabilty end input value on change', () => {
    const mockFn = (value) => {
      endDate = value;
    }
    let endDate = 'dummyDate2';
    const wrapper = shallow(<Availability start={'dummyDate'} end={endDate} availStartSetter={mockFn} availEndSetter={mockFn} availDelete={noop} />);
    const inputs = wrapper.find(DatePicker)
    expect(inputs).toHaveLength(2);
    const endInput = shallow(inputs.get(1));
    expect(endInput.prop('value')).toBe('dummyDate2');
    const event = {
      $M: 1,
      $Y: 1,
      $D: 1
    }
    endInput.simulate('change', event);
    expect(endDate).toStrictEqual('1-2-1');
  });
});
