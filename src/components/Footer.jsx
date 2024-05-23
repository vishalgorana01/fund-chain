import React from 'react'

const Footer = () => {
  return (
    <div className='flex items-center justify-center h-auto py-6'>
      <a className='mx-1 text-base font-semibold cursor-pointer duration-300 hover:-translate-y-1' href="/">Home</a> | 
      <a className='mx-1 text-base font-semibold cursor-pointer duration-300 hover:-translate-y-1' href="/">White Paper</a> | 
      <a className='mx-1 text-base font-semibold cursor-pointer duration-300 hover:-translate-y-1' href="/">Donations</a>
    </div>
  )
}

export default Footer
