import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, Textarea, Select } from 'flowbite-react';
import { useSelector } from 'react-redux';

export default function CreateOpportunity() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState('');
    const [skillsRequired, setSkillsRequired] = useState('');
    const [virtualOrInPerson, setVirtualOrInPerson] = useState('Virtual');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [orientationTraining, setOrientationTraining] = useState('');
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const navigate = useNavigate();
    const {currentUser} = useSelector(state => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const opportunityData = {
            title,
            description,
            categories,
            skillsRequired,
            virtualOrInPerson,
            location,
            startDate,
            endDate,
            applicationDeadline,
            orientationTraining
        };

        try {
            const response = await fetch(`/api/recruiter/opportunities/create/${currentUser.user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(opportunityData),
            });
            const data = await response.json();
            if (!response.ok) {
              setFormError(data.error);
            }else{
              setFormSuccess('Volunteering Project created successfully');
              setTitle('');
              setDescription('');
              setCategories('');
              setSkillsRequired('');
              setVirtualOrInPerson('Virtual');
              setLocation('');
              setStartDate('');
              setEndDate('');
              setApplicationDeadline('');
              setOrientationTraining('');
            }
        } catch (err) {
            setFormError(data.error || 'Server error. Please try again later.');
        } finally {
          clearMessages();
        }
    };

    const clearMessages = () => {
      setTimeout(() => {
        setFormError(null);
        setFormSuccess(null);
      }, 5000);
    };

    return (
        <div className="w-3/5 mx-auto p-6 bg-white rounded-lg shadow-md m-7 border">
            <h2 className="text-2xl font-semibold mb-4 text-center text-[#333333]">Create New Volunteering Project</h2>
            <form onSubmit={handleSubmit} className="w-full">
                <div>
                    <label className="block text-[#333333] mb-1" htmlFor="title">Title</label>
                    <TextInput 
                        id="title"
                        type="text" 
                        placeholder="Enter opportunity title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#1aac83] bg-[#f1f1f1]"
                    />
                </div>
                <div>
                    <label className="block text-[#333333] mb-1" htmlFor="description">Description</label>
                    <Textarea 
                        id="description"
                        placeholder="Enter opportunity description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#1aac83] bg-[#f1f1f1]"
                    />
                </div>
                <div>
                    <label className="block text-[#333333] mb-1" htmlFor="categories">Categories</label>
                    <TextInput 
                        id="categories"
                        type="text" 
                        placeholder="Enter categories" 
                        value={categories} 
                        onChange={(e) => setCategories(e.target.value)} 
                        required 
                        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#1aac83] bg-[#f1f1f1]"
                    />
                </div>
                <div>
                    <label className="block text-[#333333] mb-1" htmlFor="skillsRequired">Skills Required</label>
                    <TextInput 
                        id="skillsRequired"
                        type="text" 
                        placeholder="Enter skills required" 
                        value={skillsRequired} 
                        onChange={(e) => setSkillsRequired(e.target.value)} 
                        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#1aac83] bg-[#f1f1f1]"
                    />
                </div>
                <div>
                    <label className="block text-[#333333] mb-1" htmlFor="virtualOrInPerson">Mode</label>
                    <Select 
                        id="virtualOrInPerson"
                        value={virtualOrInPerson} 
                        onChange={(e) => setVirtualOrInPerson(e.target.value)} 
                        required
                        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#1aac83] bg-[#f1f1f1]"
                    >
                        <option value="Virtual">Virtual</option>
                        <option value="In-Person">In-Person</option>
                    </Select>
                </div>
                {virtualOrInPerson === 'In-Person' && (
                    <div>
                        <label className="block text-[#333333] mb-1" htmlFor="location">Location</label>
                        <TextInput 
                            id="location"
                            type="text" 
                            placeholder="Enter location" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            required 
                            className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#1aac83] bg-[#f1f1f1]"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-[#333333] mb-1" htmlFor="startDate">Start Date</label>
                    <TextInput 
                        id="startDate"
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        required 
                        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#1aac83] bg-[#f1f1f1]"
                    />
                </div>
                <div>
                    <label className="block text-[#333333] mb-1" htmlFor="endDate">End Date</label>
                    <TextInput 
                        id="endDate"
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        required 
                        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#1aac83] bg-[#f1f1f1]"
                    />
                </div>
                <div>
                    <label className="block text-[#333333] mb-1" htmlFor="applicationDeadline">Application Deadline</label>
                    <TextInput 
                        id="applicationDeadline"
                        type="date" 
                        value={applicationDeadline} 
                        onChange={(e) => setApplicationDeadline(e.target.value)} 
                        required 
                        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#1aac83] bg-[#f1f1f1]"
                    />
                </div>
                <div>
                    <label className="block text-[#333333] mb-1" htmlFor="orientationTraining">Orientation & Training</label>
                    <Textarea 
                        id="orientationTraining"
                        placeholder="Enter orientation & training details" 
                        value={orientationTraining} 
                        onChange={(e) => setOrientationTraining(e.target.value)} 
                        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#1aac83] bg-[#f1f1f1]"
                    />
                </div>
                <Button type="submit" color="green" className="m-7 w-1/2 bg-[#1aac83] hover:text-[#1aac83] text-white mx-auto">
                    Create Volunteering Project
                </Button>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                {formSuccess && <p className="text-[#1aac83] text-center mb-4">{formSuccess}</p>}
            </form>
        </div>
    );
}