import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RecDashApplicationInfo() {
    const location = useLocation();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [volunteerProfile, setVolunteerProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    const urlParams = new URLSearchParams(location.search);
    const applicationId = urlParams.get('id');

    useEffect(() => {
        const fetchApplicationData = async () => {
            try {
                const response = await fetch(`/api/volunteer/applicationinfo/${applicationId}`);
                const data = await response.json();
                if (!response.ok) {
                    setError(data.error);
                } else {
                    setApplication(data);
                    setStatus(data.status);
                    await fetchVolunteerProfile();
                }
            } catch (error) {
                setError('Error: Could not fetch application data');
            } finally {
                setLoading(false);
            }
        };

        const fetchVolunteerProfile = async () => {
            try {
                const volunteerResponse = await fetch(`/api/recruiter/applications/volunteerprofile/${applicationId}`);
                const volunteerData = await volunteerResponse.json();
                if (!volunteerResponse.ok) {
                    setError(volunteerData.error);
                } else {
                    setVolunteerProfile(volunteerData);
                }
            } catch (error) {
                setError('Error: Could not fetch volunteer profile data');
            }
        };
        fetchApplicationData();
    }, [formSuccess]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const clearMessages = () => {
        setTimeout(() => {
            setFormError(null);
            setFormSuccess(null);
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        try {
            const response = await fetch(`/api/recruiter/applications/${applicationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            const data = await response.json();
            if (!response.ok) {
                setFormError(data.error || 'Error: Could not update application status.');
            } else {
                setFormSuccess('Application status updated successfully!');
            }
        } catch (error) {
            setFormError('Error: Could not complete update request.');
        } finally {
            clearMessages();
        }
    };

    if (error) {
        return (
            <div>
                <div className="text-red-500">{error}</div>
                <div className="flex justify-end">
                    <button
                        onClick={handleGoBack}
                        className="mr-10 px-4 text-[#1aac83] hover:text-green-700 font-semibold"
                    >
                        &larr; Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <p className="flex justify-center text-center text-lg text-[#1aac83]">Loading...</p>;
    }

    return (
        <div className="flex flex-row bg-gray-50 p-6 rounded shadow-md m-10 w-full">
            <div className="w-2/4 mb-6 pl-5 pr-5">
                <h1 className="text-3xl font-bold mb-6">Application Details</h1>
                <div className="mb-6">
                    <p><strong>Status:</strong> {application.status}</p>
                    <p><strong>Submitted At:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(application.updatedAt).toLocaleDateString()}</p>
                    <p><strong>Statement of Interest:</strong> {application.statementOfInterest}</p>
                </div>
                <h2 className="text-2xl font-semibold mb-6">Volunteer Details</h2>
                {volunteerProfile && (
                    <div className="mb-6">
                        <p><strong>Name:</strong> {volunteerProfile.firstName} {volunteerProfile.lastName}</p>
                        <p><strong>Email:</strong> {volunteerProfile.email}</p>
                        <p><strong>Phone:</strong> {volunteerProfile.phoneNo}</p>
                        <p><strong>City:</strong> {volunteerProfile.city}</p>
                        <p><strong>Country:</strong> {volunteerProfile.country}</p>
                        <p><strong>Address:</strong> {volunteerProfile.address}</p>
                        <p><strong>DOB:</strong> {new Date(volunteerProfile.dob).toLocaleDateString()}</p>
                        <p><strong>Gender:</strong> {volunteerProfile.gender}</p>
                        <p><strong>Bio:</strong> {volunteerProfile.bio}</p>
                        <p><strong>Skills:</strong> {volunteerProfile.skills.join(', ')}</p>
                    </div>
                )}
            </div>
            <div className="w-2/4 mb-6 pl-7 border-l border-gray-300 text-center mx-auto">
                <h2 className="text-2xl font-semibold text-[#1aac83] mb-3 ml-3">Update Application Status</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-[#333333]">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-[#1aac83] text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
                    >
                        Update Status
                    </button>
                    {formError && <p className="text-red-500">{formError}</p>}
                    {formSuccess && <p className="text-green-500">{formSuccess}</p>}
                </form>
            </div>
        </div>
    );
}
