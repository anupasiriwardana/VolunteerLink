import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

export default function RecCreateProject() {

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl mb-7 font-semibold'>Create Project</h1>
      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1'/>
          <Select>
            <option value='uncategorized'>Select a category</option>
            <option value='humanitarian'>Humanitarian</option>
            <option value='environmental'>Environmental</option>
            <option value='marine'>Marine conservation</option>
            <option value='wildlife'>Wildlife</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-600 border-dotted p-3'>
          <FileInput type='file' accept='image/*'/>
          <Button type='button' gradientDuoTone='greenToBlue' size='sm' outline>Upload Image</Button>
        </div>
        <ReactQuill theme='snow' placeholder='write something...' className='h-72 mb-12' required/>
        <Button type='submit' gradientDuoTone='greenToBlue'>Post</Button>
      </form>
    </div>
  )
}
