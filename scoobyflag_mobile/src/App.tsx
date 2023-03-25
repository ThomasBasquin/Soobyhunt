import React, { useEffect } from 'react';
import {Provider} from 'react-redux';
import RouteProvider from './Routes/RouteProvider';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './Services/store';
import RNEventSource from 'react-native-event-source';

function App() {

  useEffect(() => {
    const uri = encodeURIComponent('toto');
    const eventSource = new RNEventSource(
      'http://82.165.109.36/.well-known/mercure?topic=' + uri,
    );
    console.log("test");
    
    eventSource.addEventListener('message', (event: any) => {
      console.log(event);
    });

    return () => eventSource.close();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouteProvider />
      </PersistGate>
    </Provider>
  );
}

export default App;
