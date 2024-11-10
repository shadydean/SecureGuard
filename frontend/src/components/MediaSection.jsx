// MediaContent.jsx
import React, { startTransition, Suspense, useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Buffer } from 'buffer';
import { FcImageFile,FcVideoFile } from "react-icons/fc";
import { RxDotsVertical } from "react-icons/rx";
import LoadingSpinner from './LoadingSpinner';
import { AuthContext } from '../context/Auth';
import { useParams } from 'react-router-dom';

const SkeletonLoader = () => {
  return (
    <div className="bg-gray-800 relative w-[25%] h-[35%] flex flex-col justify-evenly px-2 mr-2 mb-2 rounded-lg shadow-black shadow-md animate-pulse">
      <div className="flex justify-between items-center px-4">
        <div className="bg-gray-600 h-8 w-8 rounded-full"></div>
        <div className="ml-2 bg-gray-600 h-6 w-3/5 rounded"></div>
        <div className="bg-gray-600 h-6 w-6 rounded"></div>
      </div>
      <div className="bg-gray-600 h-[60%] w-[95%] mx-auto rounded-md"></div>
    </div>
  );
};

const MediaModel = ({deleteMedia,setRename,isLoading,downloadMedia}) => {

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
                onClick={downloadMedia}
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
      const response = await fetch(`https://secureguard-production.up.railway.app/api/media/${selectedMedia}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token" : user
        },
      })

      if(response.ok){
        let newContent = content.filter(m => m._id !== selectedMedia)
        startTransition(() => {
          setContent(newContent);
        });
        toast.success("File deleted Successfully.")
        const cache = await caches.open("media-cache");
      
      cache.match(`https://secureguard-production.up.railway.app/api/media/?vaultId=${id}`).then((cachedResponse) => {
        if (cachedResponse) {
          cachedResponse.json().then((cachedData) => {
            cache.put(
              `https://secureguard-production.up.railway.app/api/media/?vaultId=${id}`,
              new Response(JSON.stringify(newContent))
            );
          });
        }
      });
        // console.log(data)
      }
      setIsLoading(false)
      setSelectedMedia(null)
      setIsModelOpen(false)
    }catch(err){
      console.log(err)
    }
  }

  async function renameMedia(){
    try{
      const response = await fetch(`https://secureguard-production.up.railway.app/api/media/${selectedMedia}`,{
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
      
      cache.match(`https://secureguard-production.up.railway.app/api/media/?vaultId=${id}`).then((cachedResponse) => {
        if (cachedResponse) {
          cachedResponse.json().then((cachedData) => {
            cache.put(
              `https://secureguard-production.up.railway.app/api/media/?vaultId=${id}`,
              new Response(JSON.stringify(newData))
            );
          });
        }
      });
        // console.log(data)
      }
      setRename(false)
      setIsModelOpen(false)
      setSelectedMedia(null)
    }catch(err){
      console.log(err)
    }
    setRename(false)
  }

  const downloadMedia = () => {
    const link = document.createElement('a');
    if (media.image) {
      const imageBuffer = Buffer.from(media.image.data);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = media.image.contentType || 'image/jpg';
      link.href = `data:${mimeType};base64,${base64Image}`;
    } else if (media.video) {
      const videoBuffer = Buffer.from(media.video.data);
      const base64Video = videoBuffer.toString('base64');
      const mimeType = media.video.contentType || 'video/mp4';
      link.href = `data:${mimeType};base64,${base64Video}`;
    } else if (media.audio) {
      const audioBuffer = Buffer.from(media.audio.data);
      const base64Audio = audioBuffer.toString('base64');
      const mimeType = media.audio.contentType || 'audio/mp3';
      link.href = `data:${mimeType};base64,${base64Audio}`;
    }
    link.download = media.mediaName;
    link.click();
    setIsModelOpen(false)
  };


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
      {isModelOpen && <MediaModel setRename={setRename} deleteMedia={deleteMedia} isLoading={isLoading} downloadMedia={downloadMedia} />}
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
      <MediaContainer content={content} setContent={setContent} media={media}>  
        <audio controls className="w-[95%] aspect-video rounded-md" src={`data:${mimeType};base64,${base64Audio}`} preload='none' />
        </MediaContainer>
    );
  }
  else {
    return <div>Unknown media type</div>;
  }
};

const NoMedia = ({handleUpload}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const onFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    // console.log(file)
    if (file) {
      startTransition(() => {
        handleUpload(file);
      })
      setSelectedFile(null); // Clear the selected file after upload
    }
  };

  return (
    <div className='w-full h-full border-2 border-dashed flex items-center justify-center border-white'>
      <div className="flex flex-col items-center justify-center text-white space-y-4">
        <h1 className='text-[2.8rem]'>Your vault is empty.</h1>
        <h3 className='text-2xl font-light text-slate-400'>Try uploading media...</h3>
        <input
          type="file"
          onChange={onFileChange}
          className="hidden"
          id="file-upload"
        />
        <button onClick={() => document.getElementById("file-upload").click()} className='px-3 py-2 bg-gray-200 hover:bg-gray-400 text-slate-900 rounded-lg'>Upload</button>
      </div>
    </div>
  )
}

const MediaWrapper = ({content,handleUpload,setContent}) => {
  // console.log("media wrapper -> ",content)
  return (
    <>
    {content.length > 0 ? (
                content.map((media) => (
                  <MediaContent content = {content} setContent={setContent} key={media._id} media={media} />
                ))
              ) : (
                <NoMedia handleUpload={handleUpload} />
    )}
    </>
  )
}

const MediaSection = ({search,searchContent,content,setContent,loading}) => {

  const handleUpload = async (file) => {
    // console.log(file)
    // setLoading(true);
    const formData = new FormData();
    const data = {
      [file.type.split("/")[0]]: file,
      vaultId: id,
    };
    formData.append(file.type.split("/")[0], file); // Append file under image, video, or audio key
    formData.append("vaultId", id);

    // console.log(data,formData)

    const res = await fetch(`https://secureguard-production.up.railway.app/api/media`, {
      method: "POST",
      headers: {
        "x-auth-token": user,
      },
      body: formData,
    });

    const newMedia = await res.json();
    if (res.ok) {
      // console.log(newMedia)
      startTransition(() => {
        setContent([...content, newMedia]);
      })
      toast.success("File uploaded successfully.",{
        autoClose : 3000,
        theme : 'dark',
        
      })
      const cache = await caches.open("media-cache");
      let url = `https://secureguard-production.up.railway.app/api/media/?vaultId=${id}`
      cache.match(url).then((cachedResponse) => {
        if (cachedResponse) {
          cachedResponse.json().then((cachedData) => {
            cache.put(
              url,
              new Response(JSON.stringify([...cachedData, newMedia]))
            );
          });
        }
      });
    } else {
      toast.error(newMedia.msg,{
        autoClose : 3000,
        theme : 'dark',
      })
      console.log("Something went wrong");
    }
    // setLoading(false);
  };

  // console.log("media section -> ",searchContent)
  return (
    <div className="flex h-full flex-wrap items-start">
          {loading ? (
            <>
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </>
          ) : 
          (
            <Suspense fallback={<LoadingSpinner />}>
              {searchContent.length > 0 ? 
              <MediaWrapper handleUpload={handleUpload} content={searchContent} setContent={setContent} /> 
              : 
              (search !== "") ? <div className='text-[3rem] text-slate-300 m-auto'> No Media found </div>
              
              : 
              <MediaWrapper handleUpload={handleUpload} content={content} setContent={setContent} /> 
            }
            </Suspense>
          )}
              <ToastContainer/>
        </div>
  )
}

export default MediaSection;
