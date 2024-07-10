// MediaContent.jsx
import React, { Suspense, useContext, useState } from 'react';
import { Buffer } from 'buffer';
import { FcImageFile,FcVideoFile } from "react-icons/fc";
import { RxDotsVertical } from "react-icons/rx";
import LoadingSpinner from './LoadingSpinner';
import { AuthContext } from '../context/Auth';
import { useParams } from 'react-router-dom';

const MediaModel = ({deleteMedia,setRename,isLoading}) => {

  return (
    <div className='absolute bg-opacity-90 bg-gray-900 text-white -right-[50%] top-8 mt-2 z-10 w-48 text-cente rounded-md shadow-lg p-2'>
            <ul>
              <button
                className='px-4 py-2  block w-full hover:bg-gray-700 cursor-pointer'
                onClick={() => setRename(true)}
              >
                Rename
              </button>
              <button
                className='px-4 py-2  block w-full hover:bg-gray-700 cursor-pointer'
                // onClick={() => {setIsVaultModifying(true); setVaultName(vault.name)}}
              >
                Download
              </button>
              <button
                className='px-4 py-2  block w-full bg-red-500 rounded-xl text-white hover:bg-red-600 cursor-pointer'
                disabled={isLoading}
                onClick={deleteMedia}
              >
                Delete
              </button>
            </ul>
        </div>
  )
}

const MediaContainer = ({media,children,content,setContent}) => {
  const [isModelOpen,setIsModelOpen] = useState(false)
  const [rename,setRename] = useState(false)
  const [name,setName] = useState(media.mediaName)
  const [isLoading,setIsLoading] = useState(false)
  const [selectedMedia,setSelectedMedia] = useState(null)
  const {user} = useContext(AuthContext)
  const {id} = useParams()
  
  async function deleteMedia(){
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:4321/api/media/${selectedMedia}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token" : user
        },
      })

      if(response.ok){
        let newContent = content.filter(m => m._id !== selectedMedia)
        setContent(newContent)
        const cache = await caches.open("media-cache");
      
      cache.match(`http://localhost:4321/api/media/?vaultId=${id}`).then((cachedResponse) => {
        if (cachedResponse) {
          cachedResponse.json().then((cachedData) => {
            cache.put(
              `http://localhost:4321/api/media/?vaultId=${id}`,
              new Response(JSON.stringify(newContent))
            );
          });
        }
      });
        // console.log(data)
      }
      setIsLoading(false)
      setSelectedMedia(null)
    }catch(err){
      console.log(err)
    }
  }

  async function renameMedia(){
    try{
      const response = await fetch(`http://localhost:4321/api/media/${selectedMedia}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token" : user
        },
        body : JSON.stringify({mediaName : name})
      })

      if(response.ok){
        let newData = content.map(prev => {
          if(prev._id === selectedMedia)
              return {...prev,mediaName : name};
          else
            return prev;
        })
        setContent(newData)
        const cache = await caches.open("media-cache");
      
      cache.match(`http://localhost:4321/api/media/?vaultId=${id}`).then((cachedResponse) => {
        if (cachedResponse) {
          cachedResponse.json().then((cachedData) => {
            cache.put(
              `http://localhost:4321/api/media/?vaultId=${id}`,
              new Response(JSON.stringify(newData))
            );
          });
        }
      });
        // console.log(data)
      }
      setRename(false)
      setSelectedMedia(null)
    }catch(err){
      console.log(err)
    }
    setRename(false)
  }


  return (
    <div className='bg-gray-800 relative w-[25%] h-[35%] flex flex-col justify-evenly px-2 mr-2 mb-2 rounded-lg shadow-black shadow-md'>
      <div className='flex justify-between items-center px-4'>
        {(media.image ? <FcImageFile className='text-3xl' /> : <FcVideoFile className='text-3xl' />)}
        {rename ? 
        <input type='text' value={name} onChange={(e) => setName(e.target.value)} 
        onKeyDown={(e) => {
          if(e.key === 'Enter') {
           return renameMedia()
          }

          return;
        }}
        required
        /> 
        :<h2 className='ml-2 text-white truncate w-[50%]'>{media.mediaName}</h2>}
        <RxDotsVertical onClick={() => {setIsModelOpen(prev => !prev); setSelectedMedia(prev => (prev === null ? media._id : null))}} className='text-white hover:bg-gray-700 rounded-xl cursor-pointer text-lg h-6' />
      </div>
      {children}
      {isModelOpen && <MediaModel setRename={setRename} deleteMedia={deleteMedia} isLoading={isLoading} />}
    </div>
  )
}

const MediaContent = ({ media,content,setContent }) => {
  if (media.image) {
    const imageBuffer = Buffer.from(media.image.data);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = media.image.contentType || 'image/jpg';
    return (
        <MediaContainer content={content} setContent={setContent} media={media}>  
          <img
            src={`data:${mimeType};base64,${base64Image}`}
            className="w-[95%] mx-auto aspect-video rounded-md"
            alt="Media Content"
            loading='lazy'
          />
        </MediaContainer>
      
    );
  } else if (media.video) {
    const videoBuffer = Buffer.from(media.video.data);
    const base64Video = videoBuffer.toString('base64');
    const mimeType = media.video.contentType || 'video/mp4';
    return (
      <MediaContainer content={content} setContent={setContent} media={media}>  
        <video controls className="w-[95%] aspect-video rounded-md" preload='none'>
          <source src={`data:${mimeType};base64,${base64Video}`} type={mimeType} />
          Your browser does not support the video tag.
        </video>
        </MediaContainer>
    );
  } 
  else if(media.audio){
    const audioBuffer = Buffer.from(media.audio.data);
    const base64Audio = audioBuffer.toString('base64');
    const mimeType = media.audio.contentType || 'video/mp4';
    return (
      <MediaContainer media={media}>  
        <audio controls className="w-[95%] aspect-video rounded-md" src={`data:${mimeType};base64,${base64Audio}`} preload='none' />
        </MediaContainer>
    );
  }
  else {
    return <div>Unknown media type</div>;
  }
};

const MediaSection = ({content,setContent,loading}) => {
  return (
    <div className="flex h-full flex-wrap items-start">
          {loading ? (
            <LoadingSpinner />
          ) : 
          (
            <Suspense fallback={<LoadingSpinner />}>
              {content.length > 0 ? (
                content.map((media) => (
                  <MediaContent content = {content} setContent={setContent} key={media._id} media={media} />
                ))
              ) : (
                <h1 className="text-white">No content</h1>
              )}
            </Suspense>
          )}
        </div>
  )
}

export default MediaSection;
