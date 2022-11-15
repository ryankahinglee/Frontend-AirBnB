export function validateJSON (result) {
  if (!('title' in result) || typeof result.title !== 'string') {
    return false;
  }
  if (!('address' in result) ||
    result.address.constructor !== Object ||
    !('streetDetails' in result.address) ||
    !('city' in result.address) ||
    !('state' in result.address) ||
    !('postcode' in result.address) ||
    !('country' in result.address) ||
    typeof result.address.streetDetails !== 'string' ||
    typeof result.address.city !== 'string' ||
    typeof result.address.state !== 'string' ||
    typeof result.address.postcode !== 'number' ||
    typeof result.address.country !== 'string'
  ) {
    return false;
  }
  if (!('price' in result) || typeof result.price !== 'number') {
    return false;
  }
  if (!('thumbnail' in result) || typeof result.thumbnail !== 'string') {
    return false;
  }
  if (!('metadata' in result) ||
    result.metadata.constructor !== Object ||
    !('type' in result.metadata) ||
    !('bathrooms' in result.metadata) ||
    !('amenities' in result.metadata) ||
    !('bedrooms' in result.metadata) ||
    typeof result.metadata.type !== 'string' ||
    typeof result.metadata.bathrooms !== 'number' ||
    typeof result.metadata.amenities !== 'string' ||
    !(Array.isArray(result.metadata.bedrooms))
  ) {
    return false;
  } else {
    for (const bedroom of result.metadata.bedrooms) {
      if (!('roomType' in bedroom) ||
      !('numBeds' in bedroom) ||
      typeof bedroom.roomType !== 'string' ||
      typeof bedroom.numBeds !== 'string') {
        return false;
      }
    }
  }
  return true;
}
