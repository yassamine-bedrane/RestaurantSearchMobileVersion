import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import Modal from 'react-native-modal';

const Screen1 = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [searchResultMessage, setSearchResultMessage] = useState('');

  useEffect(() => {
    // Fetch cities data from your API
    fetch('https://dull-toad-threads.cyclic.app/api/cities/')
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // Fetch zones based on the selected city
    if (selectedCity) {
      fetch(
        `https://dull-toad-threads.cyclic.app/api/zones/city/${selectedCity}`
      )
        .then((response) => response.json())
        .then((data) => setZones(data))
        .catch((error) => console.log(error));
    }
  }, [selectedCity]);

  useEffect(() => {
    // Fetch specialities based on the selected city
    if (selectedCity) {
      fetch('https://dull-toad-threads.cyclic.app/api/specialite/')
        .then((response) => response.json())
        .then((data) => setSpecialities(data))
        .catch((error) => console.log(error));
    }
  }, [selectedCity]);

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setSelectedZone(null);
    setSelectedSpeciality(null);
  };

  const handleZoneChange = (value) => {
    setSelectedZone(value);
  };

  const handleSpecialityChange = (value) => {
    setSelectedSpeciality(value);
  };

  const handleSearch = () => {
    // Perform search based on selected city, zone, and speciality
    if (selectedZone && selectedSpeciality) {
      fetch(
        `https://dull-toad-threads.cyclic.app/api/restaurant/${selectedZone}/${selectedSpeciality}`
      )
        .then((response) => response.json())
        .then((data) => {
          setRestaurants(data);
          setSearchResultMessage(data.length === 0 ? 'Aucun restaurant trouvé.' : '');
        })
        .catch((error) => console.log(error));
    }
  };

  const handleViewImages = (restaurantId) => {
    const selectedRestaurant = restaurants.find(
      (restaurant) => restaurant._id == restaurantId
    );
    setSelectedRestaurant(selectedRestaurant);
    setShowModal(true);
  };

  const ImageModal = ({ restaurant, onClose }) => {
    const images = restaurant.photo;

    const handleSwipe = (index) => {
      setSelectedImageIndex(index);
    };

    return (
      <Modal
        isVisible={showModal}
        backdropOpacity={1}
        animationIn="fadeIn"
        animationOut="fadeOut"
        useNativeDriver={false}
      >
        <View style={styles.modalContainer}>
          <Swiper
            loop={false}
            index={selectedImageIndex}
            onIndexChanged={handleSwipe}
            containerStyle={styles.swiperContainer}
            dotStyle={styles.swiperDot}
            activeDotStyle={styles.swiperActiveDot}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.swiperImageContainer}>
                <Image source={{ uri: image }} style={styles.swiperImage} />
              </View>
            ))}
          </Swiper>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>FoodExplore</Text>
      <Text style={styles.slogan}>Découvrez les meilleurs restaurants près de chez vous !</Text>

      <View style={styles.selectionContainer}>
        <RNPickerSelect
          onValueChange={handleCityChange}
          items={cities.map((city) => ({
            label: city.name,
            value: city._id,
          }))}
          placeholder={{ label: 'Sellectionnez une ville', value: null }}
          style={pickerStyles}
          value={selectedCity}
        />

        <RNPickerSelect
          onValueChange={handleZoneChange}
          items={zones.map((zone) => ({
            label: zone.name,
            value: zone._id,
          }))}
          placeholder={{ label: 'Selectionnez une zone', value: null }}
          style={pickerStyles}
          value={selectedZone}
          disabled={!selectedCity}
        />

        <RNPickerSelect
          onValueChange={handleSpecialityChange}
          items={specialities.map((speciality) => ({
            label: speciality.name,
            value: speciality._id,
          }))}
          placeholder={{ label: 'Selectionnez une spécialité', value: null }}
          style={pickerStyles}
          value={selectedSpeciality}
          disabled={!selectedCity}
        />

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Trouver les restaurants</Text>
        </TouchableOpacity>
      </View>

      {searchResultMessage ? (
        <Text style={styles.searchResultMessage}>{searchResultMessage}</Text>
      ) : null}

      <ScrollView style={styles.resultsContainer}>
  {restaurants.map((restaurant) => (
    <View key={restaurant._id} style={styles.restaurantCard}>
      <Image
        source={{ uri: restaurant.photo[0] }}
        style={styles.restaurantThumbnail}
      />
      <View style={styles.restaurantCardContent}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.restaurantDetails}>
          Opening Hours: {restaurant.ouvert} - {restaurant.fermé}
        </Text>
        <TouchableOpacity
          style={styles.viewImagesButton}
          onPress={() => handleViewImages(restaurant._id)}
        >
          <Text style={styles.viewImagesButtonText}>Voir Images</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewImagesButton}
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}&travelmode=driving`
            )
          }
        >
          <Text style={styles.viewImagesButtonText}>Itineraire</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))}
</ScrollView>

      {selectedRestaurant && (
        <ImageModal
          restaurant={selectedRestaurant}
          onClose={() => setShowModal(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff4500', // Custom app color
  },
  slogan: {
    fontSize: 16,
    marginBottom: 20,
    color: '#888',
  },
  selectionContainer: {
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: '#ff4500', // Custom app color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  restaurantThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  restaurantCardContent: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantDetails: {
    fontSize: 14,
    color: '#888',
    marginBottom: 3,
  },
  viewImagesButton: {
    backgroundColor: '#ff4500', // Custom app color
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  viewImagesButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: '#ff4500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  swiperContainer: {
    flex: 1,
  },
  swiperDot: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    marginVertical: 8,
  },
  swiperActiveDot: {
    backgroundColor: 'white',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    marginVertical: 8,
  },
  swiperImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  searchResultMessage: {
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 10,
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 10,
  },
});

export default Screen1;
