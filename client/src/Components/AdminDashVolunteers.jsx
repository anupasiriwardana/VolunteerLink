import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [newVolunteer, setNewVolunteer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/admin/users/volunteers');
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        }
        setVolunteers(data);
      } catch (error) {
        setError("Error: Could not fetch volunteers.");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const handleInputChange = (e) => {
    setNewVolunteer({ ...newVolunteer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      const response = await fetch('/api/admin/users/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVolunteer),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setVolunteers([...volunteers, data]);
      setFormSuccess('Volunteer created successfully!');
      setNewVolunteer({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    } catch (error) {
      setFormError(error.message);
    } finally{
      clearMessages();
    }
  };

  const clearMessages = () => {
    setTimeout(() => {
      setFormError(null);
      setFormSuccess(null);
    }, 3000);
  };

  if (loading) {
    return <p className="text-center text-lg text-[#1aac83]">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 md:p-6 flex flex-col md:flex-row">
      <div className="md:w-2/3 w-full">
        <h2 className="text-2xl font-bold mb-6 text-[#333333]">Volunteers</h2>
        
        {volunteers && (
          <table className="w-full table-auto bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-[#1aac83] text-white">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer._id} className="border-b">
                  <td className="px-4 py-2">{volunteer.firstName} {volunteer.lastName}</td>
                  <td className="px-4 py-2">{volunteer.email}</td>
                  <td className="px-4 py-2">
                  <Link to={`/admin?tab=volunteers&section=volunteerprofile&id=${volunteer._id}`} className="text-[#1aac83] hover:underline">
                    View Profile
                  </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="md:w-1/3 w-full md:ml-6 mt-6 md:mt-0">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Add new Volunteer</h2>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-[#333333]">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={newVolunteer.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-[#333333]">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={newVolunteer.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#333333]">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newVolunteer.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-[#333333]">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newVolunteer.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#1aac83] text-white py-2 px-4 rounded-lg hover:bg-[#169c73]">
            Create Volunteer
          </button>
        </form>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
      </div>
    </div>
  );
}
