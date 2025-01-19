import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosInstance from '../utils/axiosInstance';

interface Travel {
  _id: string;
  destination: string;
  description: string;
  departureDate: string;
  duration: number;
}

const TravelScreen = () => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTravels = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/travels');
      setTravels(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch travels.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateTravel = async () => {
    if (!destination || !description || !departureDate || !duration) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }

    try {
      if (editMode && editingId) {
        await axiosInstance.put(`/travels/${editingId}`, { destination, description, departureDate, duration });
        Alert.alert('Success', 'Travel updated successfully!');
      } else {
        const response = await axiosInstance.post('/travels', { destination, description, departureDate, duration });
        Alert.alert('Success', 'Travel added successfully!');
        setTravels((prev) => [...prev, response.data]);
      }
      resetForm();
      fetchTravels();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to save travel.');
    }
  };

  const handleDeleteTravel = async (id: string) => {
    try {
      await axiosInstance.delete(`/travels/${id}`);
      Alert.alert('Success', 'Travel deleted successfully!');
      fetchTravels();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to delete travel.');
    }
  };

  const handleEditTravel = (travel: Travel) => {
    setDestination(travel.destination);
    setDescription(travel.description);
    setDepartureDate(travel.departureDate);
    setDuration(String(travel.duration));
    setEditMode(true);
    setEditingId(travel._id);
  };

  const resetForm = () => {
    setDestination('');
    setDescription('');
    setDepartureDate('');
    setDuration('');
    setEditMode(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchTravels();
  }, []);

  const renderTravelCard = ({ item }: { item: Travel }) => (
    <View style={styles.ticketContainer}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketDestination}>{item.destination}</Text>
        <TouchableOpacity onPress={() => handleEditTravel(item)}>
          <AntDesign name="edit" size={20} color="#5C4033" />
        </TouchableOpacity>
      </View>
      <View style={styles.ticketContent}>
        <Text style={styles.ticketText}>
          <Text style={styles.ticketLabel}>Description:</Text> {item.description}
        </Text>
        <Text style={styles.ticketText}>
          <Text style={styles.ticketLabel}>Departure:</Text> {new Date(item.departureDate).toLocaleDateString()}
        </Text>
        <Text style={styles.ticketText}>
          <Text style={styles.ticketLabel}>Duration:</Text> {item.duration} days
        </Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTravel(item._id)}>
        <AntDesign name="delete" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Travel Management</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Departure Date (YYYY-MM-DD)"
          value={departureDate}
          onChangeText={setDepartureDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration (days)"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />
      </View>
      <Pressable style={styles.addButton} onPress={handleAddOrUpdateTravel}>
        <Text style={styles.addButtonText}>{editMode ? 'Update Travel' : 'Add Travel'}</Text>
      </Pressable>
      <FlatList
        data={travels}
        keyExtractor={(item) => item._id}
        renderItem={renderTravelCard}
        refreshing={loading}
        onRefresh={fetchTravels}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4ECE2',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5C4033',
    textAlign: 'center',
    paddingTop: 50,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#E6D3C1',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#5C4033',
  },
  addButton: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  ticketContainer: {
    backgroundColor: '#E6D3C1',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#8B5E3C',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ticketDestination: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C4033',
  },
  ticketContent: {
    marginBottom: 10,
  },
  ticketText: {
    fontSize: 14,
    color: '#5C4033',
  },
  ticketLabel: {
    fontWeight: 'bold',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#8B5E3C',
    padding: 10,
    borderRadius: 5,
  },
});

export default TravelScreen;
