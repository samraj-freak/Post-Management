import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import your main component here
import './styles.css'; // Import your CSS file here
import reportWebVitals from './reportWebVitals'; // Optional for performance measurement

ReactDOM.render(
  <React.StrictMode>
    <App /> {/* Render your main component (in this case, App) */}
  </React.StrictMode>,
  document.getElementById('root')
);

// Optional: Uncomment the following line if you want to measure performance
// reportWebVitals();
