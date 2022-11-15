import { shallow } from 'enzyme';
import Cross from '../components/Cross';
import * as React from 'react';

const noop = () => {};

describe('Cross', () => {
  it('renders Cross component', () => {
    const wrapper = shallow(<Cross images={['nice', 'five', 'big']} imagesSetter={noop} img={'nice'}/>);
    const svg = wrapper.find('svg');
    expect(svg).toHaveLength(1);
    expect(svg.prop('viewBox')).toBe('0 0 200 200');
    expect(svg.prop('height')).toBe('30px');
    expect(svg.prop('width')).toBe('30px');
    const lines = wrapper.find('line');
    expect(lines).toHaveLength(2);
  });
  it('svg triggers the onclick function', () => {
    const mockFn = jest.fn();
    const wrapper = shallow(<Cross images={['nice', 'five', 'big']} imagesSetter={mockFn} img={'nice'}/>);
    const svg = wrapper.find('svg');
    svg.simulate('click');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('svg causes an image delete on click', () => {
    const images = ['nice', 'five', 'big'];
    const mockFn = () => {
      const indexDelete = images.indexOf('nice');
      images.splice(indexDelete, 1);
    }
    const wrapper = shallow(<Cross images={images} imagesSetter={mockFn} img={'nice'}/>);
    const svg = wrapper.find('svg');
    svg.simulate('click');
    expect(images).toStrictEqual(['five', 'big']);
  });
});
