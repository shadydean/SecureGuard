// MediaContent.jsx
import React from 'react';
import { Buffer } from 'buffer';

const MediaContent = ({ media }) => {
  if (media.image) {
    const imageBuffer = Buffer.from(media.image.data);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = media.image.contentType || 'image/jpg';
    return (
      <img
        src={`data:${mimeType};base64,${base64Image}`}
        className="w-full h-auto mb-4"
        alt="Media Content"
      />
    );
  } else if (media.video) {
    const videoBuffer = Buffer.from(media.video.data);
    const base64Video = videoBuffer.toString('base64');
    const mimeType = media.video.contentType || 'video/mp4';
    return (
      <video controls className="w-full h-auto mb-4">
        <source src={`data:${mimeType};base64,${base64Video}`} type={mimeType} />
        Your browser does not support the video tag.
      </video>
    );
  } else {
    return <div>Unknown media type</div>;
  }
};

export default MediaContent;
