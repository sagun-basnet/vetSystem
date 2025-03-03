import React, { useState } from 'react'
import { post } from '../../../utils/api'

const Notification = () => {
    const init = {
        message: '',
        link: ''
    }
    const [data, setData] = useState(init)
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(data)
        const res = await post('/send-notification', data)
        console.log(res);

    }
    const handleChange = (e) => {
        setData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    return (
        <div className='flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3'>
            <h1 className="font-medium text-[30px] text-primary ">
                Send Notification
            </h1>
            <div className="flex justify-center items-center h-[30rem]">
                <form onSubmit={handleSubmit} action="" className='w-[60%]'>
                    <div className="flex flex-col  gap-4">
                        <textarea onChange={handleChange} rows={4} type="text" placeholder="Message" className="resize-none border border-gray-300 px-3 py-2 rounded-md" name='message' />
                        <input onChange={handleChange} name="link" id="" placeholder="link" className="border border-gray-300 px-3 py-2 rounded-md" />
                        <button type='submit' className="bg-[#437EF7] py-2 px-6 rounded-md text-white">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Notification