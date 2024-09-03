import { Label, TextInput, Select, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import useSignOut from '../hooks/useSignOutHook';
import { HiArrowSmLeft } from 'react-icons/hi';

export default function GetVolunteerInfo() {
    const [volunteerDetails, setVolunteerDetails] = useState({
        phoneNo: '',
        nic: '',
        city: '',
        country: '',
        address: '',
        dob: '',
        gender: '',
        bio: '',
        skills: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [formError, setFormError] = useState(null);
    const [volunteerName, setVolunteerName] = useState('');
    const navigate = useNavigate(); //to redirect after submission
    const signOut = useSignOut();

    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const fetchVolunteerData = async () => {
            try {
                const response = await fetch(`/api/volunteer/profile/${currentUser.user._id}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error);
                } else {
                    setVolunteerName(data.volunteer.firstName); //for welcome msg
                }
            } catch (error) {
                setError(data.error || "Error: Could not retrieve volunteer profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchVolunteerData();
    }, [currentUser]);

    const handleVolunteerDetailsChange = (e) => {
        const { id, value } = e.target;
        setVolunteerDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
    };

    const handleVolunteerDetailsSubmit = async (e) => {
        e.preventDefault();
        if(!volunteerDetails.phoneNo || !volunteerDetails.nic || !volunteerDetails.dob || !volunteerDetails.city || 
            !volunteerDetails.country || !volunteerDetails.address || !volunteerDetails.gender || 
            !volunteerDetails.bio || !volunteerDetails.skills) {
                setFormError('Please fill out all the fields.');
                clearMessages();
                return;
            }
        try {
            const response = await fetch(`/api/volunteer/profile/${currentUser.user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(volunteerDetails),
            });
            const data = await response.json();
            if (!response.ok) {
                setFormError(data.error);
            } else {
                setFormSuccess('Profile Details saved successfully!');
                navigate('/volunteer?tab=opportunities&section=opportunities');
                return;
            }
        } catch (error) {
            setFormError(data.error || "Error: Could not complete ssave requet.");
        } finally {
            clearMessages();
        }
    };

    const clearMessages = () => {
        setTimeout(() => {
            setError(null);
            setFormSuccess(null);
            setFormError(null);
        }, 3000);
    };
    const handleSignOut = () => {
        signOut(); // calling custom hook to clear local storage and update redux state
        navigate('/sign-in');
    };

    if (loading) {
        return <p className="text-center text-lg text-[#1aac83]">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-lg text-red-500">{error}</p>;
    }

    return (
        <div className="m-4 p-3 w-full flex justify-center">
            <div className='w-1/4'>
                <div className='flex justify-center'>
                    <Link to="/" className="text-black text-3xl font-bold font-dmserif">
                        <div className="flex items-center mt-4 mb-10">
                            <img src={logo} alt="Logo" className="h-12 w-auto mr-4" />
                            <p className="text-3xl">VolunteerLink</p>
                        </div>
                    </Link>
                </div>
                <p className="text-center text-lg text-[#333333]">Welcome <span className='text-[#1aac83]'>{volunteerName}!</span></p>
                <p className="text-center text-lg text-[#333333]">
                    Please complete your profile information, before you start your journey on VolunteerLink!
                </p>
                <div className='flex justify-center'>
                    <button
                        className='m-7 text-white bg-[#1aac83] hover:bg-[#148b6a] rounded-md p-3 flex items-center justify-center'
                        onClick={handleSignOut}
                    >
                        <HiArrowSmLeft className='mr-2' />
                        Sign Out
                    </button>
                </div>
            </div>
            <div className='w-3/4 flex justify-center'>
                <form className="w-3/4 border border-gray-300 rounded-2xl p-2 bg-white mr-2">
                    <div className='flex justify-center'>
                        <div className="mb-5 mr-5">
                            <Label value="Phone Number" />
                            <TextInput
                                type="text"
                                id="phoneNo"
                                value={volunteerDetails.phoneNo}
                                onChange={handleVolunteerDetailsChange}
                                placeholder="Phone Number"
                                className="text-[#333333]"
                            />
                        </div>
                        <div className="mb-5 ml-5">
                            <Label value="NIC" />
                            <TextInput
                                type="text"
                                id="nic"
                                value={volunteerDetails.nic}
                                onChange={handleVolunteerDetailsChange}
                                placeholder="NIC"
                                className="text-[#333333]"
                            />
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <div className="mb-5 mr-5">
                            <Label value="City" />
                            <TextInput
                                type="text"
                                id="city"
                                value={volunteerDetails.city}
                                onChange={handleVolunteerDetailsChange}
                                placeholder="City"
                                className="text-[#333333]"
                            />
                        </div>
                        <div className="mb-5 ml-5">
                            <Label value="Country" />
                            <TextInput
                                type="text"
                                id="country"
                                value={volunteerDetails.country}
                                onChange={handleVolunteerDetailsChange}
                                placeholder="Country"
                                className="text-[#333333]"
                            />
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <div className="mb-5 w-3/4">
                            <Label value="Address" />
                            <TextInput
                                type="text"
                                id="address"
                                value={volunteerDetails.address}
                                onChange={handleVolunteerDetailsChange}
                                placeholder="Address"
                                className="text-[#333333]"
                            />
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <div className="mb-5 mr-5">
                            <Label value="Date of Birth" />
                            <TextInput
                                type="date"
                                id="dob"
                                value={volunteerDetails.dob}
                                onChange={handleVolunteerDetailsChange}
                                className="text-[#333333]"
                            />
                        </div>
                        <div className="mb-5 ml-3">
                            <Label value="Gender" />
                            <Select
                                id="gender"
                                value={volunteerDetails.gender}
                                onChange={handleVolunteerDetailsChange}
                                className="text-[#333333]"
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer Not to Say">Prefer Not to Say</option>
                            </Select>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <div className="mb-5 w-3/4">
                            <Label value="Bio" />
                            <Textarea
                                type="text"
                                id="bio"
                                value={volunteerDetails.bio}
                                onChange={handleVolunteerDetailsChange}
                                placeholder="Tell us about your self, your past volunteering experiences!"
                                rows={4}
                                className="text-[#333333]"
                            />
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <div className="mb-5 w-3/4">
                            <Label value="Skills" />
                            <TextInput
                                type="text"
                                id="skills"
                                value={volunteerDetails.skills}
                                onChange={handleVolunteerDetailsChange}
                                placeholder="Teaching, Music, Art"
                                className="text-[#333333]"
                            />
                        </div>
                    </div>
                    <div className='flex items-center justify-center'>
                        <button className="w-1/4 mt-4 text-white bg-[#1aac83] hover:bg-[#148b6a] rounded-md p-2"
                            onClick={handleVolunteerDetailsSubmit}>
                            Save Details
                        </button>
                    </div>
                    {formSuccess && <p className="text-green-500 text-center mt-4">{formSuccess}</p>}
                    {formError && <p className="text-red-500 text-center mt-4">{formError}</p>}
                </form>
            </div>
        </div>
    );
}

