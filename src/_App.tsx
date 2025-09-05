"use client";

import { Provider } from "react-redux";
import { store, persister } from "./lib/store";
import { PersistGate } from "redux-persist/integration/react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
};

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persister}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
