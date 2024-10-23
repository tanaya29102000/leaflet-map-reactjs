// App.js
import React from 'react';
import MapComponent from './components/MapComponent';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div className="App">
      <h1>Leaflet Map in React</h1>
      <MapComponent />
    </div>
  );
}

export default App;
