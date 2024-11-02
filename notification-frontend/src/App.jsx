// import React from 'react';
// import NotificationForm from './components/NotificationForm';
// import NotificationFeed from './components/NotificationFeed';
// import './App.css';  // Import CSS at the top of the file

// function App() {
//   return (
//     <div className="App">
//       <NotificationForm />
//       <NotificationFeed />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import NotificationForm from './components/NotificationForm';
import NotificationFeed from './components/NotificationFeed';
import './App.css';
import './index.css'
const App = () => {
  return (
    <div
      data-flex
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        padding: '20px',
      }}
    >
      <NotificationForm />
      <NotificationFeed />
    </div>
  );
};

export default App;
