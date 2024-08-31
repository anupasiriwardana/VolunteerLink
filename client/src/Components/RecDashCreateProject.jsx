import { Alert, Button, FileInput, Select, TextInput, Radio, Label } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector }  from 'react-redux';

export default function RecCreateProject() {

  const [ formData, setFormData] = useState({});
  const [ publishError, setPublishError] = useState(null);
  const [ publish, setPublish ] = useState(false);
  const { currentUser } = useSelector(state => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/recruiter/opportunities/create/${currentUser.user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok){
        setPublishError(data.message);
        return;
      }
      if(res.ok){
        setPublishError(null);
        setPublish(true);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  }

  return (
    <div className='p-3 mx-auto min-h-screen'>
      <h1 className='text-center text-3xl mb-7 font-semibold'>Create Project</h1>
      <form className='flex flex-col gap-4 w-800' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <Select onChange={(e)=> setFormData({...formData, categories: e.target.value})}>
            <option value='uncategorized'>Select a category</option>
            <option value='humanitarian'>Humanitarian</option>
            <option value='environmental'>Environmental</option>
            <option value='marine'>Marine conservation</option>
            <option value='wildlife'>Wildlife</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-400 border-dotted p-3'>
          <span className='text-l'>Insert project photo : </span> 
          <FileInput type='file' accept='image/*' onChange={(e) => setFormData({...formData, projectPhoto: e.target.files[0]})}/>
        </div>
        <div className='flex justify-around items-center mt-3 mb-3'>
          <div>
          <Radio name='virtualOrInPerson' id='Virtual' className='mr-3 p-2' onChange={(e) => setFormData({...formData, virtualOrInPerson: e.target.id})}/>
          <Label value="Virtual"/>
          </div>
          <div>
          <Radio name='virtualOrInPerson' id='In-Person' className='mr-3 p-2' onChange={(e) => setFormData({...formData, virtualOrInPerson: e.target.id})}/>
          <Label value="In person"/>
          </div>
        </div>
        <div className='flex justify-around items-center'>
          <span>Start Date :</span>
          <TextInput type='date' title='Start Date' id='startDate' onChange={(date) => setFormData({...formData, startDate: new Date(date.target.value)})}/>
        </div>
        <div className='flex justify-around items-center'>
         <span>End Date :</span>
          <TextInput type='date' title='End Date' id='endDate' onChange={(date) => setFormData({...formData, endDate: new Date(date.target.value)})}/>
        </div>
        <div className='flex justify-around items-center'>
          <span>Application Deadline :</span>
          <TextInput type='date' title='Application Deadline' id='applicationDeadline' onChange={(date) => setFormData({...formData, applicationDeadline: new Date(date.target.value)})}/>
        </div>
        <span className='mt-3'>Enter project description below:</span>
        <ReactQuill theme='snow' placeholder='write something...' className='h-72 mb-12' required onChange={ (value)=> setFormData({...formData, description: value})}/>
        <Button type='submit' gradientDuoTone='greenToBlue'>Post</Button>
        { publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>}
        { publish && <Alert color='success' className='mt-5'>Opportunity created successfully</Alert>}
      </form>
    </div>
  )
}
