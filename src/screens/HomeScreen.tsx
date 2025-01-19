import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import axiosInstance from '../utils/axiosInstance';

interface Travel {
  _id: string;
  destination: string;
  description: string;
  departureDate: string;
  duration: number;
}

const HomeScreen = () => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchTravels = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/travels');
      setTravels(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch travels.');
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axiosInstance.get('/travels');
      setTravels(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to refresh travels.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTravels();
  }, [fetchTravels]);

  const renderTravelCard = ({ item }: { item: Travel }) => (
    <View style={styles.ticketContainer}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>{item.destination}</Text>
        <Text style={styles.ticketDuration}>{item.duration} days</Text>
      </View>
      <View style={styles.ticketBody}>
        <Text style={styles.ticketLabel}>Departure Date:</Text>
        <Text style={styles.ticketText}>{new Date(item.departureDate).toLocaleDateString()}</Text>
        <Text style={styles.ticketLabel}>Description:</Text>
        <Text style={styles.ticketText}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Travel Overview</Text>
          <Text style={styles.subtitle}>Track and manage your travels</Text>
        </>
      }
      data={travels}
      keyExtractor={(item) => item._id}
      renderItem={renderTravelCard}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4ECE2',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5C4033',
    textAlign: 'center',
    paddingTop: 50,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B5E3C',
    textAlign: 'center',
    marginBottom: 20,
  },
  ticketContainer: {
    backgroundColor: '#E6D3C1',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#8B5E3C',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C4033',
  },
  ticketDuration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5E3C',
  },
  ticketBody: {
    marginTop: 10,
  },
  ticketLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5C4033',
    marginBottom: 5,
  },
  ticketText: {
    fontSize: 14,
    color: '#5C4033',
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default HomeScreen;
