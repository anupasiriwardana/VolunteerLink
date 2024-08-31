import { useEffect, useState } from 'react';

export default function AdminDashRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [newRecruiter, setNewRecruiter] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organizationOrIndependent: '',
    password: '',
  });

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await fetch('/api/admin/users/recruiters');
        
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        setRecruiters(data);
      } catch (error) {
        setError("Error : Could not fetch ");
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  const handleInputChange = (e) => {
    setNewRecruiter({ ...newRecruiter, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      const response = await fetch('/api/admin/users/recruiters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecruiter),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setRecruiters([...recruiters, data]);
      setFormSuccess('Recruiter created successfully!');
      setNewRecruiter({
        firstName: '',
        lastName: '',
        email: '',
        organizationOrIndependent: '',
        password: '',
      });
    } catch (error) {
      setFormError(error.message);
    }
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
        <h2 className="text-2xl font-bold mb-6 text-[#333333]">Recruiters</h2>
        {recruiters.length > 0 ? (
          <table className="w-full table-auto bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-[#1aac83] text-white">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recruiters.map((recruiter) => (
                <tr key={recruiter._id} className="border-b">
                  <td className="px-4 py-2">{recruiter.firstName} {recruiter.lastName}</td>
                  <td className="px-4 py-2">{recruiter.email}</td>
                  <td className="px-4 py-2">{recruiter.organizationOrIndependent}</td>
                  <td className="px-4 py-2">
                    <a
                      href={`/admin/recruiters/${recruiter._id}`}
                      className="text-[#1aac83] hover:underline"
                    >
                      View Profile
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-lg text-[#333333]">No recruiters found.</p>
        )}
      </div>
      <div className="md:w-1/3 w-full md:ml-6 mt-6 md:mt-0">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Add new Recruiter</h2>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-[#333333]">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={newRecruiter.firstName}
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
              value={newRecruiter.lastName}
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
              value={newRecruiter.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="organizationOrIndependent" className="block text-[#333333]">Type</label>
            <select
              id="organizationOrIndependent"
              name="organizationOrIndependent"
              value={newRecruiter.organizationOrIndependent}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Type</option>
              <option value="Organization-representer">Organization Representer</option>
              <option value="Independent">Independent Recruiter</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-[#333333]">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newRecruiter.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#1aac83] text-white py-2 px-4 rounded-lg hover:bg-[#169c73]">
            Create Recruiter
          </button>
        </form>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
      </div>
    </div>
  );
}
