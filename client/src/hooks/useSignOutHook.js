import { useDispatch } from 'react-redux';
import { signOut } from '../Redux/user/userSlice';

const useSignOut = () => {
    const dispatch = useDispatch();

    const handleSignOut = () => {
        localStorage.removeItem('persist:root');
        dispatch(signOut());
    };

    return handleSignOut;
};

export default useSignOut;
