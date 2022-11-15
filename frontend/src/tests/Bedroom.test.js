import { shallow } from 'enzyme';
import Bedroom from '../components/Bedroom';
import * as React from 'react';

const noop = () => {};

describe('Bedroom', () => {
    it('renders Bedroom component', () => {
        const wrapper = shallow(<Bedroom bedroomType={'master'} bedCount={10} onBedroomTypeChange={noop} onBedCountChange={noop} bedroomDelete={noop}/>);
        const div = wrapper.find('div');
        expect(div).toHaveLength(1);
        const select = wrapper.find('Select');
        expect(select).toHaveLength(1);
    });
});