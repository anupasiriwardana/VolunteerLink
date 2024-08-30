import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//instead of having a lot of reducers, use a root reducer which a combination of all of them
const rootReducer = combineReducers({
    user: userReducer,
});

const persistConfig = {
    key: 'root',    //the name stored inside the storage
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false}),
});

export const persistor = persistStore(store);