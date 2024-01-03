import React from 'react'

const OnMobile = () => {
  return (
    <div className='w-full h-screen' >
        <div className="flex flex-col justify-center items-center h-full p-4 text-center text-xl font-medium">
            {/* <h3>Op in larger  screans </h3> */}

           
      <p className='text-xl text-stone-500'>
       {` It looks like you're using a mobile device! For an optimal experience,
        we recommend switching to a larger screen such as a desktop or tablet.`}
      </p>
      <br />
      <p className='text-stone-500'>
        Our website is designed to take full advantage of larger screens,
        providing you with a richer and more immersive experience.
      </p>
      {/* You can add more information or a call-to-action button here */}

            
        </div>
    </div>
  )
}

export default OnMobile