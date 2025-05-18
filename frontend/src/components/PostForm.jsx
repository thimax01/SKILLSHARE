// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useUser } from '../contexts/UserContext';

// const PostForm = ({ onPostCreated, initialData, isEditing, onCancel }) => {
//   const [title, setTitle] = useState(initialData?.title || '');
//   const [content, setContent] = useState(initialData?.content || '');
//   const [images, setImages] = useState([]); // New images
//   const [existingImages, setExistingImages] = useState(initialData?.imageUrls || []); // Existing images
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [video, setVideo] = useState(null);
//   const [videoPreview, setVideoPreview] = useState(initialData?.videoUrl ? 
//     `http://localhost:8081${initialData.videoUrl}` : '');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [showForm, setShowForm] = useState(!!isEditing);
  
//   const { currentUser } = useUser();

//   // Initialize form when initialData changes
//   useEffect(() => {
//     if (initialData) {
//       setTitle(initialData.title || '');
//       setContent(initialData.content || '');
//       if (initialData.imageUrl) {
//         setImagePreviews([`http://localhost:8081${initialData.imageUrl}`]);
//       }
//     }
//   }, [initialData]);

//   // Handle new image uploads
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + existingImages.length > 3) {
//       setError('You can only upload up to 3 images.');
//       return;
//     }
//     setImages(files);
//     setImagePreviews(files.map((file) => URL.createObjectURL(file)));
//   };

//   // Remove an existing image
//   const handleRemoveExistingImage = (url) => {
//     setExistingImages((prev) => prev.filter((image) => image !== url));
//   };

//   // Remove a new image
//   const handleRemoveNewImage = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Handle video upload
//   const handleVideoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//         if (file.size > 100 * 1024 * 1024) { // Limit video size to 100MB
//             setError('Video size must be less than 100MB');
//             return;
//         }
//         setVideo(file);
//         setVideoPreview(URL.createObjectURL(file));
//         setError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim() || !content.trim() || !currentUser?.id || isSubmitting) {
//         setError('All fields are required.');
//         return;
//     }

//     setIsSubmitting(true);
//     setError('');

//     try {
//         const formData = new FormData();

//         // Append new images
//         if (images.length > 0) {
//             images.forEach((image) => {
//                 formData.append('images', image);
//             });
//         }

//         // Append existing image URLs
//         if (existingImages.length > 0) {
//             existingImages.forEach((url) => {
//                 formData.append('existingImageUrls', url);
//             });
//         }

//         // Append new video or delete flag
//         if (video) {
//             formData.append('video', video);
//         } else if (!videoPreview && initialData?.videoUrl) {
//             formData.append('deleteVideo', true); // Mark video for deletion
//         }

//         // Append existing video URL
//         if (initialData?.videoUrl && videoPreview && !video) {
//             formData.append('existingVideoUrl', initialData.videoUrl);
//         }

//         // Append other post data
//         formData.append('userId', currentUser.id);
//         formData.append('title', title.trim());
//         formData.append('content', content.trim());

//         const url = isEditing
//             ? `http://localhost:8081/api/posts/${initialData.id}`
//             : 'http://localhost:8081/api/posts';

//         const method = isEditing ? 'put' : 'post';

//         const response = await axios[method](
//             url,
//             formData,
//             {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             }
//         );

//         if (response.data) {
//             if (onPostCreated) {
//                 onPostCreated(response.data);
//             }
//             if (!isEditing) {
//                 setTitle('');
//                 setContent('');
//                 setImages([]);
//                 setVideo(null);
//                 setImagePreviews([]);
//                 setVideoPreview('');
//             }
//         }
//     } catch (error) {
//         console.error('Error with post creation/update:', error);
//         setError(error.response?.data?.error || 'Failed to handle post. Please try again.');
//     } finally {
//         setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     if (isEditing && onCancel) {
//       onCancel();
//     } else {
//       setShowForm(false);
//     }
//   };

//   if (!showForm && !isEditing) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow-md mb-4 max-w-2xl mx-auto">
//         <button
//           onClick={() => setShowForm(true)}
//           className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//         >
//           Create New Post
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md mb-4">
//       <h2 className="text-lg font-medium mb-4">
//         {isEditing ? 'Edit Post' : 'Create a New Post'}
//       </h2>
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
//           {error}
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//             Title
//           </label>
//           <input
//             type="text"
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Enter post title"
//             required
//           />
//         </div>
        
//         <div className="mb-4">
//           <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
//             Content
//           </label>
//           <textarea
//             id="content"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             placeholder="What would you like to share?"
//             rows="4"
//             required
//           />
//         </div>

//         {/* Existing images */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Existing Images</label>
//           <div className="grid grid-cols-3 gap-2">
//             {existingImages.map((url, index) => (
//               <div key={index} className="relative">
//                 <img src={`http://localhost:8081${url}`} alt={`Existing ${index + 1}`} className="max-h-48 rounded-lg" />
//                 <span
//                   onClick={() => handleRemoveExistingImage(url)}
//                   className="absolute top-0 right-1 text-red-100 text-2xl font-black cursor-pointer"
//                   style={{ textShadow: '2px 3px 1px rgb(0, 0, 0)' }}
//                 >
//                   ✕
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* New images */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">New Images</label>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleImageChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//           />
//           <div className="grid grid-cols-3 gap-2 mt-2">
//             {imagePreviews.map((preview, index) => (
//               <div key={index} className="relative">
//                 <img src={preview} alt={`Preview ${index + 1}`} className="max-h-48 rounded-lg" />
//                 <span
//                   onClick={() => handleRemoveNewImage(index)}
//                   className="absolute top-0 right-1 text-red-100 text-2xl font-black cursor-pointer"
//                   style={{ textShadow: '2px 3px 1px rgb(0, 0, 0)' }}
//                 >
//                   ✕
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Video (optional, max 100MB)
//           </label>
//           <input
//             type="file"
//             accept="video/*"
//             onChange={handleVideoChange}
//             className="w-full p-2 border border-gray-300 rounded-md"
//           />
//           {videoPreview && (
//             <div className="relative">
//               <video
//                 src={videoPreview}
//                 controls
//                 className="w-full mt-2 rounded-lg"
//               />
//               <span
//                 onClick={() => {
//                   setVideo(null);
//                   setVideoPreview('');
//                 }}
//                 className="absolute top-0 right-1 text-red-100 text-2xl font-black cursor-pointer"
//                   style={{ textShadow: '2px 3px 1px rgb(0, 0, 0)' }}
//               >
//                 ✕
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end space-x-2">
//           <span
//             onClick={handleCancel}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
//             style={{ display: 'inline-block', textAlign: 'center' }}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </span>
//           <button
//             type="submit"
//             disabled={isSubmitting || !title.trim() || !content.trim()}
//             className={`px-4 py-2 bg-blue-900 text-white rounded-md ${
//               isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
//             }`}
//           >
//             {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Post'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PostForm;




import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { PlusCircle, X, Camera, Upload, FileVideo } from 'lucide-react';

const PostForm = ({ onPostCreated, initialData, isEditing, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [images, setImages] = useState([]); // New images
  const [existingImages, setExistingImages] = useState(initialData?.imageUrls || []); // Existing images
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(initialData?.videoUrl ? 
    `http://localhost:8081${initialData.videoUrl}` : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(!!isEditing);

  const { currentUser } = useUser();

  // Initialize form when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      if (initialData.imageUrl) {
        setImagePreviews([`http://localhost:8081${initialData.imageUrl}`]);
      }
    }
  }, [initialData]);

  // Handle new image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length > 3) {
      setError('You can only upload up to 3 images.');
      return;
    }
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // Remove an existing image
  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((image) => image !== url));
  };

  // Remove a new image
  const handleRemoveNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle video upload
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // Limit video size to 100MB
        setError('Video size must be less than 100MB');
        return;
      }
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !currentUser?.id || isSubmitting) {
      setError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();

      // Append new images
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      // Append existing image URLs
      if (existingImages.length > 0) {
        existingImages.forEach((url) => {
          formData.append('existingImageUrls', url);
        });
      }

      // Append new video or delete flag
      if (video) {
        formData.append('video', video);
      } else if (!videoPreview && initialData?.videoUrl) {
        formData.append('deleteVideo', true); // Mark video for deletion
      }

      // Append existing video URL
      if (initialData?.videoUrl && videoPreview && !video) {
        formData.append('existingVideoUrl', initialData.videoUrl);
      }

      // Append other post data
      formData.append('userId', currentUser.id);
      formData.append('title', title.trim());
      formData.append('content', content.trim());

      const url = isEditing
        ? `http://localhost:8081/api/posts/${initialData.id}`
        : 'http://localhost:8081/api/posts';

      const method = isEditing ? 'put' : 'post';

      const response = await axios[method](
        url,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.data) {
        if (onPostCreated) {
          onPostCreated(response.data);
        }
        if (!isEditing) {
          setTitle('');
          setContent('');
          setImages([]);
          setVideo(null);
          setImagePreviews([]);
          setVideoPreview('');
        }
      }
    } catch (error) {
      console.error('Error with post creation/update:', error);
      setError(error.response?.data?.error || 'Failed to handle post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing && onCancel) {
      onCancel();
    } else {
      setShowForm(false);
    }
  };

  if (!showForm && !isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 max-w-2xl mx-auto transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg hover:from-blue-600 hover:to-teal-500 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
        >
          <PlusCircle size={20} />
          <span>Create New Post</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6 max-w-2xl mx-auto transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {isEditing ? 'Edit Post' : 'Create a New Post'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 animate-fade-in">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter post title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="What would you like to share?"
            rows="4"
            required
          />
        </div>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
            <div className="grid grid-cols-3 gap-3">
              {existingImages.map((url, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img 
                    src={`http://localhost:8081${url}`} 
                    alt={`Existing ${index + 1}`} 
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(url)}
                    className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 
                      transition-opacity duration-200 hover:bg-opacity-80"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New images */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Images
          </label>
          <div className="flex items-center">
            <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="text-center">
                <Camera className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">Click to upload images (max 3)</p>
              </div>
            </label>
          </div>
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 
                      transition-opacity duration-200 hover:bg-opacity-80"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video (optional, max 100MB)
          </label>
          <div className="flex items-center">
            <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
              <div className="text-center">
                <FileVideo className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">Click to upload video</p>
              </div>
            </label>
          </div>
          {videoPreview && (
            <div className="relative mt-3 rounded-lg overflow-hidden">
              <video
                src={videoPreview}
                controls
                className="w-full rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setVideo(null);
                  setVideoPreview('');
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1
                  transition-opacity duration-200 hover:bg-opacity-80"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className={`px-5 py-2.5 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg font-medium
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-teal-500 transition-all duration-300'}`}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;