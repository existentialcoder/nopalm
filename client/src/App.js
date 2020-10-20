import React from 'react';
import Dataservice from './api/Dataservice';
import './App.css';

const App = () => {
  React.useEffect(() => {
    const sample = async () => {
      try {
        const response = await Dataservice.getInstalledPackages();

        console.log('RESPONSE: ', response);
      } catch(er) {
        console.error('ERR: ', er);
      }
    };
    sample();
  }, []);
  return (
    <div className="App">
      NAPAALM client
    </div>
  );
}

export default App;
