import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: { //the logic we define when a certain function is done
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => { //action is the info we get and wan to add
            state.currentUser = action.payload;
            state.loading = false;  
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const {signInStart, signInSuccess, signInFailure} = userSlice.actions;

export default userSlice.reducer;