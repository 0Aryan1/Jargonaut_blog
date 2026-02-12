import React from 'react'
import {Link} from 'react-router-dom'
import appwriteService from '../appwrite/config.js'

function PostCard({
    $id,title,featuredImage
}) {
  return (
    <div className='h-full'>
        <Link to={`/post/${$id}`}>
        <div
        className='w-full h-full bg-gray-100 rounded-xl p-4 hover:bg-gray-200 transition-colors duration-200 flex flex-col'>
            <div
            className='w-full h-48 flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-white'>
                <img src={appwriteService.getFilePreview(featuredImage)} alt={title} 
                className='w-full h-full object-cover rounded-xl'/>
            </div>
            <h2 className='text-xl font-bold line-clamp-2'>{title}</h2>
        </div>
        </Link>
    </div>
  )
}

export default PostCard
