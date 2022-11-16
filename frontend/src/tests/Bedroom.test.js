import { shallow } from 'enzyme';
import Bedroom from '../components/Bedroom';
import * as React from 'react';
import { Select, TextField, Button } from '@mui/material';

const noop = () => {};

describe('Bedroom', () => {
  it('renders Bedroom component', () => {
    const wrapper = shallow(<Bedroom bedroomType={'master'} bedCount={10} onBedroomTypeChange={noop} onBedCountChange={noop} bedroomDelete={noop}/>);
    const div = wrapper.find('div');
    expect(div).toHaveLength(2);
    const select = wrapper.find(Select);
    expect(select).toHaveLength(1);
    const textField = wrapper.find(TextField);
    expect(textField).toHaveLength(1);
    const button = wrapper.find(Button);
    expect(button).toHaveLength(1);
  });
  it('deletes bedroom on click of the delete button', () => {
    const click = jest.fn();
    const wrapper = shallow(<Bedroom bedroomType={'master'} bedCount={10} onBedroomTypeChange={noop} onBedCountChange={noop} bedroomDelete={click}/>);
    const button = wrapper.find(Button);
    expect(button).toHaveLength(1);
    button.simulate('click');
    expect(click).toHaveBeenCalledTimes(1);
  });
  it('should trigger the bedcount on change function on change', () => {
    const mockFn = jest.fn();
    const wrapper = shallow(<Bedroom bedroomType={'master'} bedCount={10} onBedroomTypeChange={noop} onBedCountChange={mockFn} bedroomDelete={noop}/>);
    const textField = wrapper.find(TextField);
    expect(textField).toHaveLength(1);
    expect(textField.prop('value')).toBe(10);
    const event = {
      target: {
        value: 5
      }
    }
    textField.simulate('change', event);
    expect(mockFn).toHaveBeenCalledWith(5);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should change the bedroom type on change function on change', () => {
    const mockFn = jest.fn();
    const wrapper = shallow(<Bedroom bedroomType={'master'} bedCount={10} onBedroomTypeChange={mockFn} onBedCountChange={noop} bedroomDelete={noop}/>);
    const select = wrapper.find(Select);
    expect(select).toHaveLength(1);
    expect(select.prop('value')).toBe('master');
    const event = {
      target: {
        value: 'child'
      }
    }
    select.simulate('change', event);
    expect(mockFn).toHaveBeenCalledWith('child');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
