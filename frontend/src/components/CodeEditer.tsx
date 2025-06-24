import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'

const CodeEditer = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-center items-center'>
        {/* select language here - c++, python, c, java */}
        <Label className='mr-4 text-md'>Select Language - </Label>
        <Select defaultValue="c++">
          <SelectTrigger className='w-[200px] cursor-pointer'>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="c++">C++</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="c">C</SelectItem>
            <SelectItem value="java">Java</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <textarea className='w-full h-[350px] border-3 rounded-sm  resize-none p-2' placeholder='Write your code here'  />
      </div>
    </div>
  )
}

export default CodeEditer