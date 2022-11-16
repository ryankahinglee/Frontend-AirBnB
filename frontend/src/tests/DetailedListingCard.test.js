import { shallow } from 'enzyme';
import DetailedListingCard from '../components/DetailedListingCard';
import * as React from 'react';
import { Box, Button } from '@mui/material';
import DeleteListingButton from '../components/DeleteListingButton';
import AvailabilityEdit from '../components/AvailabilityEdit';

const noop = () => {};

describe('DetailedListingCard', () => {
  it('renders DetailedListingCard component with published status true', () => {
    const wrapper = shallow(
      <DetailedListingCard
        title={'title'}
        type={'master'}
        bedrooms={[]}
        numBathrooms={5}
        thumbnail={'pic'}
        reviews={[]}
        price={5}
        lId={1}
        listingSetter={noop}
        published={true}
        fullListings={[]}
      />
    );
    const boxes = wrapper.find(Box);
    expect(boxes).toHaveLength(2);
    const thumbnail = wrapper.find('img');
    expect(thumbnail).toHaveLength(1);
    const detailLabels = wrapper.find('p');
    expect(detailLabels).toHaveLength(7);
    // expect(shallow(detailLabels.get(0)).text()).toStrictEqual('Title: title');
    const deleteButton = wrapper.find(DeleteListingButton);
    expect(deleteButton).toHaveLength(1);
    const UnpublishButton = wrapper.find(Button);
    expect(UnpublishButton).toHaveLength(1);
    const AvailabilityEditComponent = wrapper.find(AvailabilityEdit);
    expect(AvailabilityEditComponent).toHaveLength(0);
  });
  it('renders DetailedListingCard component with published status false', () => {
    const wrapper = shallow(
      <DetailedListingCard
        title={'title'}
        type={'master'}
        bedrooms={[]}
        numBathrooms={5}
        thumbnail={'pic'}
        reviews={[]}
        price={5}
        lId={1}
        listingSetter={noop}
        published={false}
        fullListings={[]}
      />
    );
    const boxes = wrapper.find(Box);
    expect(boxes).toHaveLength(2);
    const thumbnail = wrapper.find('img');
    expect(thumbnail).toHaveLength(1);
    const detailLabels = wrapper.find('p');
    expect(detailLabels).toHaveLength(7);
    // expect(shallow(detailLabels.get(0)).text()).toStrictEqual('Title: title');
    const deleteButton = wrapper.find(DeleteListingButton);
    expect(deleteButton).toHaveLength(1);
    const UnpublishButton = wrapper.find(Button);
    expect(UnpublishButton).toHaveLength(0);
    const AvailabilityEditComponent = wrapper.find(AvailabilityEdit);
    expect(AvailabilityEditComponent).toHaveLength(1);
  });
  it('renders the correct image', () => {
    const wrapper = shallow(
    <DetailedListingCard
      title={'title'}
      type={'master'}
      bedrooms={[]}
      numBathrooms={5}
      thumbnail={'pic'}
      reviews={[]}
      price={5}
      lId={1}
      listingSetter={noop}
      published={false}
      fullListings={[]}
    />
    );
    const image = wrapper.find('img');
    expect(image).toHaveLength(1);
    expect(image.prop('src')).toBe('pic');
    expect(image.prop('alt')).toBe('listing thumbnail-title');
  });
  it('renders the correct details based on title', () => {
    const wrapper = shallow(
    <DetailedListingCard
      title={'title'}
      type={'master'}
      bedrooms={[]}
      numBathrooms={5}
      thumbnail={'pic'}
      reviews={[]}
      price={5}
      lId={1}
      listingSetter={noop}
      published={false}
      fullListings={[]}
    />
    );
    const detailLabels = wrapper.find('p');
    expect(detailLabels).toHaveLength(7);
    expect(shallow(detailLabels.get(0)).text()).toStrictEqual('Title: title');
  });
  it('renders the correct details based on type', () => {
    const wrapper = shallow(
    <DetailedListingCard
      title={'title'}
      type={'master'}
      bedrooms={[]}
      numBathrooms={5}
      thumbnail={'pic'}
      reviews={[]}
      price={5}
      lId={1}
      listingSetter={noop}
      published={false}
      fullListings={[]}
    />
    );
    const detailLabels = wrapper.find('p');
    expect(detailLabels).toHaveLength(7);
    expect(shallow(detailLabels.get(1)).text()).toStrictEqual('Property Type: master');
  });
  it('renders the correct details based on beds amount', () => {
    const wrapper = shallow(
      <DetailedListingCard
        title={'title'}
        type={'master'}
        bedrooms={[
          {
            numBeds: 4
          },
          {
            numBeds: '5'
          }
        ]}
        numBathrooms={5}
        thumbnail={'pic'}
        reviews={[]}
        price={5}
        lId={1}
        listingSetter={noop}
        published={false}
        fullListings={[]}
      />
    );
    const detailLabels = wrapper.find('p');
    expect(detailLabels).toHaveLength(7);
    expect(shallow(detailLabels.get(2)).text()).toStrictEqual('Number of beds: 9');
  });
  it('renders the correct details based on bathroom amount', () => {
    const wrapper = shallow(
      <DetailedListingCard
        title={'title'}
        type={'master'}
        bedrooms={[]}
        numBathrooms={5}
        thumbnail={'pic'}
        reviews={[]}
        price={5}
        lId={1}
        listingSetter={noop}
        published={false}
        fullListings={[]}
      />
    );
    const detailLabels = wrapper.find('p');
    expect(detailLabels).toHaveLength(7);
    expect(shallow(detailLabels.get(3)).text()).toStrictEqual('Number of Bathrooms: 5');
  });
  it('renders the correct details based on price', () => {
    const wrapper = shallow(
      <DetailedListingCard
        title={'title'}
        type={'master'}
        bedrooms={[]}
        numBathrooms={5}
        thumbnail={'pic'}
        reviews={[]}
        price={5}
        lId={1}
        listingSetter={noop}
        published={false}
        fullListings={[]}
      />
    );
    const detailLabels = wrapper.find('p');
    expect(detailLabels).toHaveLength(7);
    expect(shallow(detailLabels.get(4)).text()).toStrictEqual('Price per Night: 5');
  });
  it('renders the correct details based on non empty reviews', () => {
    const wrapper = shallow(
      <DetailedListingCard
        title={'title'}
        type={'master'}
        bedrooms={[]}
        numBathrooms={5}
        thumbnail={'pic'}
        reviews={[
          {
            rating: 5
          },
          {
            rating: 5
          }
        ]}
        price={5}
        lId={1}
        listingSetter={noop}
        published={false}
        fullListings={[]}
      />
    );
    const detailLabels = wrapper.find('p');
    expect(detailLabels).toHaveLength(7);
    expect(shallow(detailLabels.get(5)).text()).toStrictEqual('Number of Reviews: 2');
    expect(shallow(detailLabels.get(6)).text()).toStrictEqual('Rating: 5');
  });
  it('renders the correct details based on empty reviews', () => {
    const wrapper = shallow(
      <DetailedListingCard
        title={'title'}
        type={'master'}
        bedrooms={[]}
        numBathrooms={5}
        thumbnail={'pic'}
        reviews={[]}
        price={5}
        lId={1}
        listingSetter={noop}
        published={false}
        fullListings={[]}
      />
    );
    const detailLabels = wrapper.find('p');
    expect(detailLabels).toHaveLength(7);
    expect(shallow(detailLabels.get(5)).text()).toStrictEqual('Number of Reviews: 0');
    expect(shallow(detailLabels.get(6)).text()).toStrictEqual('Not Rated');
  });
});
