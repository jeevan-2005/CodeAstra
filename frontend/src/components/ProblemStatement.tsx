import { TestExample } from '@/redux/problems/problemApi';
import React from 'react'

type Props = {
  problem_name: string;
  problem_statement: string;
  test_examples: TestExample[];
  input_format: string;
  output_format: string;
  constraints: string
}

const ProblemStatement = ({problem_name, problem_statement, test_examples, input_format, output_format, constraints}: Props) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{problem_name}</h1>
      <p className="text-[1.1rem] [white-space:pre-wrap]">{problem_statement}</p>

      <h2 className="text-xl font-medium mt-5 mb-3">Input Format</h2>
      <p className="text-[1.1rem] [white-space:pre-wrap]">{input_format}</p>

      <h2 className="text-xl font-medium mt-5 mb-3">Constraints</h2>
      <p className="text-[1.1rem] [white-space:pre-wrap]">{constraints}</p>

      <h2 className="text-xl font-medium mt-5 mb-3">Output Format</h2>
      <p className="text-[1.1rem] [white-space:pre-wrap]">{output_format}</p>

      <div className="flex flex-col gap-1">
        {test_examples.map((testExample, index) => (
          <div key={testExample.id}>
            <h2 className="text-lg font-medium mt-5 mb-3">Test Case {index + 1}</h2>
            <div className='flex flex-col w-full gap-3'>
              <div className='border'>
                <p className='font-medium p-3'>Input</p>
                <p className='p-3 bg-[#D3D3D3] [white-space:pre-wrap]'>{testExample.input_data}</p>
              </div>
              <div className='border'>
                <p className='font-medium p-3'>Output</p>
                <p className='p-3 bg-[#D3D3D3] [white-space:pre-wrap]'>{testExample.output_data}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  )
}

export default ProblemStatement