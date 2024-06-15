import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';

const requestPermissions = async () => {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Using your location',
          notificationBody: 'To turn off, go to your app settings.',
        },
      });

      await Location.watchPositionAsync(
        {
          accuracy: Location.LocationAccuracy.High,
          timeInterval: 1000,
        },
        async (location) => {
          const currentLocation = await Location.reverseGeocodeAsync(
            location.coords
          );
          if (currentLocation) {
            console.log('watchPositionAsync ==>', currentLocation[0].street);
          }
        }
      );
    }
  }
};

export const PermissionsButton = () => (
  <View style={styles.container}>
    <Button onPress={requestPermissions} title='Enable background location' />
  </View>
);

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    return;
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
