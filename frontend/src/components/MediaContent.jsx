// MediaContent.jsx
import React from 'react';
import { Buffer } from 'buffer';
import { FcImageFile,FcVideoFile } from "react-icons/fc";
import { RxDotsVertical } from "react-icons/rx";

const MediaContainer = ({media,children}) => {
  return (
    <div className='bg-gray-800 w-[25%] h-[35%] flex flex-col justify-evenly px-2 mr-2 mb-2 rounded-lg shadow-black shadow-md'>
      <div className='flex justify-between items-center px-4'>
        {(media.image ? <FcImageFile className='text-3xl' /> : <FcVideoFile className='text-3xl' />)}
        <h2 className='ml-2 text-white truncate w-[50%]'>{media.mediaName}</h2>
        <RxDotsVertical className='text-white hover:bg-gray-700 rounded-xl cursor-pointer text-lg h-6' />
      </div>
      {children}
    </div>
  )
}

const MediaContent = ({ media }) => {
  if (media.image) {
    const imageBuffer = Buffer.from(media.image.data);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = media.image.contentType || 'image/jpg';
    return (
        <MediaContainer media={media}>  
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
      <MediaContainer media={media}>  
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

export default MediaContent;
