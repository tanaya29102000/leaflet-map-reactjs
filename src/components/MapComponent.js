import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import './Mygeolocation.css';
import Navbar from './Navbar';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [error, setError] = useState(null);
  const mapRef = useRef();

  // Swap locations
  const swapLocations = () => {
    setStartLocation(endLocation);
    setEndLocation(startLocation);
  };

  // Fetch coordinates from the backend
  const fetchCoordinates = async (location) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/geocode?location=${location}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return [parseFloat(lat), parseFloat(lon)];
      }
      return null;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  // Handle route calculation
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const startCoordinates = await fetchCoordinates(startLocation);
      const endCoordinates = await fetchCoordinates(endLocation);

      if (startCoordinates && endCoordinates) {
        setError(null);
        plotRoute(startCoordinates, endCoordinates);
      } else {
        setError('One or both locations not found. Try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  // Plot route on the map
  const plotRoute = (start, end) => {
    const map = mapRef.current;
    if (!map) return;

    L.Routing.control({
      waypoints: [L.latLng(...start), L.latLng(...end)],
      routeWhileDragging: true,
    }).addTo(map);
  };

  return (
    <>
      <Navbar />
      <div className="map-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter starting location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="search-input"
          />
          <button type="button" onClick={swapLocations} className="swap-button">
            ↔️
          </button>
          <input
            type="text"
            placeholder="Enter destination"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Calculate Route
          </button>
        </form>

        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
        </MapContainer>

        {error && <div className="error-message">{error}</div>}
      </div>
    </>
  );
};

export default MapComponent;
