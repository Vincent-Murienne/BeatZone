import { View, Image, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import type { Event } from '../types/event';

interface Props {
  events: Event[];
  region: Region;
  onRegionChange: (region: Region) => void;
  userLocation: { latitude: number; longitude: number } | null;
  onEventSelect: (event: Event) => void;
}

export default function MapComponent({
  events,
  region,
  onRegionChange,
  userLocation,
  onEventSelect,
}: Props) {
  return (
    <MapView
      style={{ flex: 1 }}
      region={region}
      onRegionChangeComplete={onRegionChange}
      showsUserLocation
    >
      {userLocation && (
        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          anchor={{ x: 0.5, y: 1 }}
        >
          <View className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" />
        </Marker>
      )}

      {events
        .filter(
          (e) =>
            typeof e.owner?.latitude === 'number' &&
            typeof e.owner?.longitude === 'number'
        )
        .map((event) => (
          <Marker
            key={event.id_event}
            coordinate={{
              latitude: event.owner!.latitude!,
              longitude: event.owner!.longitude!,
            }}
            anchor={{ x: 0.5, y: 1 }}
            onPress={() => onEventSelect(event)}
          >
            <View className="flex flex-col items-center space-y-1">
              <View className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden">
                {event.image_url ? (
                  <Image
                    source={{ uri: event.image_url }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <View className="w-full h-full bg-gray-300" />
                )}
              </View>
              <Text className="bg-white text-xs text-gray-800 px-2 py-1 rounded-md shadow max-w-[100px] text-center truncate">
                {event.titre}
              </Text>
            </View>
          </Marker>
        ))}
    </MapView>
  );
}

