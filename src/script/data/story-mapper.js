import Map from '../utils/maps';

export async function storyMapper(story) {
  const { lat, lon } = story;
  const placeName = await Map.getPlaceNameByCoordinate(lat, lon);

  return {
    ...story,
    location: {
      latitude: lat,
      longitude: lon,
      placeName,
    },
  };
}
