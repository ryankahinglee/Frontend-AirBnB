import { shallow } from 'enzyme';
import * as React from 'react';
import ImageDisplay from '../components/ImageDisplay';

describe('ImageDisplay', () => {
  it('renders ImageDisplay component', () => {
    const wrapper = shallow(<ImageDisplay images={['1', '2', '3']} thumbnail={'yes'} title={'title'}/>);
    const div = wrapper.find('div');
    expect(div).toHaveLength(1);
    const imageList = div.find('img');
    expect(imageList).toHaveLength(4);
  });
  it('renders ImageDisplay component with images', () => {
    const wrapper = shallow(<ImageDisplay images={['1', '2', '3']} thumbnail={'yes'} title={'title'}/>);
    const div = wrapper.find('div');
    expect(div).toHaveLength(1);
    const imageList = div.find('img');
    expect(imageList).toHaveLength(4);
    const firstImg = imageList.get(0);
    expect(shallow(firstImg).prop('src')).toBe('1');
    expect(shallow(firstImg).prop('alt')).toBe('title-Property Image');
    expect(shallow(firstImg).prop('loading')).toBe('lazy');
    const secondImg = imageList.get(1);
    expect(shallow(secondImg).prop('src')).toBe('2');
    expect(shallow(secondImg).prop('alt')).toBe('title-Property Image');
    expect(shallow(secondImg).prop('loading')).toBe('lazy');
    const thirdImg = imageList.get(2);
    expect(shallow(thirdImg).prop('src')).toBe('3');
    expect(shallow(thirdImg).prop('alt')).toBe('title-Property Image');
    expect(shallow(thirdImg).prop('loading')).toBe('lazy');
    const fourthImg = imageList.get(3);
    expect(shallow(fourthImg).prop('src')).toBe('yes');
    expect(shallow(fourthImg).prop('alt')).toBe('title-Thumbnail Image');
    expect(shallow(fourthImg).prop('loading')).toBe('lazy');
  });
  it('renders just thumbnail image if no other images', () => {
    const wrapper = shallow(<ImageDisplay images={[]} thumbnail={'yes'} title={'title'}/>);
    const div = wrapper.find('div');
    expect(div).toHaveLength(1);
    const imageList = div.find('img');
    expect(imageList).toHaveLength(1);
    const firstImg = imageList.get(0);
    expect(shallow(firstImg).prop('src')).toBe('yes');
    expect(shallow(firstImg).prop('alt')).toBe('title-Thumbnail Image');
    expect(shallow(firstImg).prop('loading')).toBe('lazy');
  });
});
