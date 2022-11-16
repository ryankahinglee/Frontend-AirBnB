import { shallow } from 'enzyme';
import Review from '../components/Review';
import * as React from 'react';

describe('Review', () => {
  it('renders Review component', () => {
    const wrapper = shallow(<Review rating={null} comment={null}/>);
    const h3 = wrapper.find('h3');
    expect(h3).toHaveLength(1);
    const ps = wrapper.find('p');
    expect(ps).toHaveLength(2);
  });
  it('renders Review component with props', () => {
    const wrapper = shallow(<Review rating={5} comment={'Awesome'}/>);
    const h3 = wrapper.find('h3');
    expect(h3).toHaveLength(1);
    expect(h3.text()).toStrictEqual('Review');
    const ps = wrapper.find('p');
    expect(ps).toHaveLength(2);
    const firstp = ps.get(0);
    expect(shallow(firstp).text()).toStrictEqual('Rating: 5');
    const secondp = ps.get(1);
    expect(shallow(secondp).text()).toStrictEqual('Awesome');
  });
  it('renders Review component with empty comment', () => {
    const wrapper = shallow(<Review rating={5} comment={''}/>);
    const h3 = wrapper.find('h3');
    expect(h3).toHaveLength(1);
    expect(h3.text()).toStrictEqual('Review');
    const ps = wrapper.find('p');
    expect(ps).toHaveLength(2);
    const firstp = ps.get(0);
    expect(shallow(firstp).text()).toStrictEqual('Rating: 5');
    const secondp = ps.get(1);
    expect(shallow(secondp).text()).toStrictEqual('');
  });
});
