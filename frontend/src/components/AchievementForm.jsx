// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useUser } from '../contexts/UserContext';

// const AchievementForm = ({ onAchievementCreated, initialData, isEditing, onCancel }) => {
//   const [title, setTitle] = useState(initialData?.title || '');
//   const [description, setDescription] = useState(initialData?.description || '');
//   const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(initialData?.imageUrl ? 
//     `http://localhost:8081${initialData.imageUrl}` : '');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [showForm, setShowForm] = useState(!!isEditing);
//   const [category, setCategory] = useState(initialData?.category || '');
//   const [selectedTemplate, setSelectedTemplate] = useState(initialData?.template || 1);
  
//   const categories = ['Technical', 'Professional', 'Academic', 'Personal', 'Other'];
  
//   const { currentUser } = useUser();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const getVideoId = (url) => {
//     if (!url) return null;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('skillshare_token');
//       let achievement = {
//         userId: currentUser.id,
//         title,
//         description,
//         videoUrl,
//         category,
//         template: selectedTemplate,
//         imageUrl: initialData?.imageUrl // Preserve existing imageUrl
//       };

//       // Default headers configuration
//       const config = {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       };

//       // Add auth token if available
//       if (token) {
//         config.headers['Authorization'] = token;
//       }

//       let response;
      
//       if (image) {
//         const formData = new FormData();
//         formData.append('file', image);

//         const uploadResponse = await axios.post(
//           'http://localhost:8081/api/files/upload',
//           formData,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//               'Authorization': token ? `Bearer ${token}` : ''
//             }
//           }
//         );

//         if (uploadResponse.data?.url) {
//           achievement.imageUrl = uploadResponse.data.url;
//         } else {
//           throw new Error('Invalid upload response');
//         }
//       }

//       if (isEditing) {
//         response = await axios.put(
//           `http://localhost:8081/api/achievements/${initialData.id}?userId=${currentUser.id}`,
//           achievement,
//           config
//         );
//       } else {
//         response = await axios.post('http://localhost:8081/api/achievements', achievement, config);
//       }

//       if (response.data && onAchievementCreated) {
//         onAchievementCreated(response.data);
//         if (!isEditing) {
//           setTitle('');
//           setDescription('');
//           setVideoUrl('');
//           setImage(null);
//           setImagePreview('');
//           setSelectedTemplate(1);
//           setShowForm(false);
//         } else if (onCancel) {
//           onCancel();
//         }
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         setError('Please log in to share achievements');
//       } else {
//         setError(error.response?.data?.message || 'Failed to save achievement');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!showForm && !isEditing) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow-md mb-4">
//         <button
//           onClick={() => setShowForm(true)}
//           className="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
//         >
//           Share New Achievement
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col md:flex-row">
//       {/* Left: Form Section */}
//       <div className="flex-1 bg-white p-4 rounded-lg shadow-md mb-4 md:mr-4">
//         <h2 className="text-lg font-medium mb-4">
//           {isEditing ? 'Edit Achievement' : 'Share New Achievement'}
//         </h2>
        
//         {error && (
//           <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
//             {error}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Title
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               rows="4"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Image (optional)
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="w-full p-2 border border-gray-300 rounded-md"
//             />
//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="mt-2 max-h-48 rounded-md"
//               />
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Video URL (optional)
//             </label>
//             <input
//               type="url"
//               value={videoUrl}
//               onChange={(e) => setVideoUrl(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Category
//             </label>
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//             >
//               <option value="">Select a category</option>
//               {categories.map(cat => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>
//           </div>

//           {/* Template Selection */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Template
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {[1, 2, 3].map((template) => (
//                 <div 
//                   key={template}
//                   className={`p-3 border rounded-lg cursor-pointer transition-all ${
//                     selectedTemplate === template 
//                       ? 'border-indigo-500 bg-indigo-50' 
//                       : 'border-gray-300 hover:border-indigo-300'
//                   }`}
//                   onClick={() => setSelectedTemplate(template)}
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="font-medium">Template {template}</span>
//                     <input 
//                       type="radio" 
//                       name="template" 
//                       checked={selectedTemplate === template} 
//                       onChange={() => setSelectedTemplate(template)} 
//                     />
//                   </div>
//                   <div className="h-24 bg-gray-100 flex items-center justify-center rounded">
//                     <span className="text-gray-500">Preview {template}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end space-x-2">
//             <span
//               onClick={onCancel || (() => setShowForm(false))}
//               className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
//             >
//               Cancel
//             </span>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
//             >
//               {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Share Achievement')}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Right: Template Preview Section */}
//       <div className="md:w-1/3">
//         <h3 className="text-lg font-medium mb-4">Template Preview</h3>
//         <div className="space-y-4">
//           {/* Template Preview 1 */}
//           <div className={`p-4 border rounded-lg shadow-sm ${selectedTemplate === 1 ? 'border-indigo-500' : 'bg-gray-50'}`}>
//             <h4 className="font-semibold text-gray-800">{title || 'Achievement Title'}</h4>
//             <div className="my-2">
//               {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-28 object-cover rounded-md" />}
//             </div>
//             <p className="text-sm text-gray-600 line-clamp-2">{description || 'Achievement description will appear here'}</p>
//             <p className="text-xs text-gray-500 mt-2 font-medium">{category || 'Category'}</p>
//           </div>
          
//           {/* Template Preview 2 */}
//           <div className={`p-4 border rounded-lg shadow-sm ${selectedTemplate === 2 ? 'border-indigo-500' : 'bg-gray-50'}`}>
//             <div className="flex">
//               {imagePreview && 
//                 <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover mr-4" />
//               }
//               <div>
//                 <h4 className="font-semibold text-gray-800">{title || 'Achievement Title'}</h4>
//                 <p className="text-xs text-gray-500">{category || 'Category'}</p>
//                 <p className="text-sm text-gray-600 line-clamp-2 mt-1">{description || 'Achievement description will appear here'}</p>
//               </div>
//             </div>
//             {videoUrl && getVideoId(videoUrl) && (
//               <div className="mt-2 border-t pt-2">
//                 <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded">
//                   <span className="text-xs text-gray-500">Video preview</span>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Template Preview 3 */}
//           <div className={`rounded-lg shadow-sm overflow-hidden ${selectedTemplate === 3 ? 'border-2 border-indigo-500' : 'border'}`}>
//             {imagePreview ? (
//               <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${imagePreview})` }}></div>
//             ) : (
//               <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
//             )}
//             <div className="p-4">
//               <h4 className="font-bold text-gray-800">{title || 'Achievement Title'}</h4>
//               <div className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600 mt-2">{category || 'Category'}</div>
//               <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description || 'Achievement description will appear here'}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AchievementForm;







import { useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

const AchievementForm = ({ onAchievementCreated, initialData, isEditing, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl ? 
    `http://localhost:8081${initialData.imageUrl}` : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(!!isEditing);
  const [category, setCategory] = useState(initialData?.category || '');
  const [selectedTemplate, setSelectedTemplate] = useState(initialData?.template || 1);
  
  const categories = ['Technical', 'Professional', 'Academic', 'Personal', 'Other'];
  const { currentUser } = useUser();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('skillshare_token');
      let achievement = {
        userId: currentUser.id,
        title,
        description,
        videoUrl,
        category,
        template: selectedTemplate,
        imageUrl: initialData?.imageUrl
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        }
      };

      if (image) {
        const formData = new FormData();
        formData.append('file', image);

        const uploadResponse = await axios.post(
          'http://localhost:8081/api/files/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': token ? `Bearer ${token}` : ''
            }
          }
        );

        if (uploadResponse.data?.url) {
          achievement.imageUrl = uploadResponse.data.url;
        }
      }

      const response = isEditing
        ? await axios.put(
            `http://localhost:8081/api/achievements/${initialData.id}?userId=${currentUser.id}`,
            achievement,
            config
          )
        : await axios.post('http://localhost:8081/api/achievements', achievement, config);

      if (response.data && onAchievementCreated) {
        onAchievementCreated(response.data);
        if (!isEditing) {
          resetForm();
        } else if (onCancel) {
          onCancel();
        }
      }
    } catch (error) {
      setError(error.response?.status === 401
        ? 'Please log in to share achievements'
        : error.response?.data?.message || 'Failed to save achievement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setImage(null);
    setImagePreview('');
    setSelectedTemplate(1);
    setShowForm(false);
  };

  if (!showForm && !isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-gradient-to-r from-[#4285F4] to-[#36B7CD] text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
        >
          <span className="material-icons text-xl group-hover:scale-110 transition-transform">add_circle</span>
          <span className="font-medium">Share New Achievement</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#4285F4] to-[#36B7CD] bg-clip-text text-transparent">
            {isEditing ? 'Edit Achievement' : 'Share New Achievement'}
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg animate-fade-in">
              <div className="flex items-center text-red-700">
                <span className="material-icons mr-2">error_outline</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4285F4] focus:border-transparent transition-all"
                placeholder="What did you achieve?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4285F4] focus:border-transparent transition-all"
                rows="4"
                placeholder="Tell us about your achievement..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#4285F4] transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded-lg shadow-md"
                      />
                      <div className="mt-3">
                        <span className="text-sm text-[#4285F4] group-hover:text-[#36B7CD] transition-colors">
                          Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="material-icons text-4xl text-gray-400 group-hover:text-[#4285F4] transition-colors">
                        add_photo_alternate
                      </span>
                      <span className="mt-2 text-sm text-gray-500">
                        Drag & drop an image or click to browse
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4285F4] focus:border-transparent transition-all"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {videoUrl && getVideoId(videoUrl) && (
                <div className="mt-2 p-3 bg-[#4285F4]/5 rounded-lg">
                  <div className="flex items-center text-[#4285F4]">
                    <span className="material-icons mr-2">play_circle</span>
                    <span className="text-sm">Video preview available</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4285F4] focus:border-transparent transition-all"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Layout
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((template) => (
                  <div 
                    key={template}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template 
                        ? 'border-[#4285F4] bg-[#4285F4]/5 shadow-md scale-[1.02]' 
                        : 'border-gray-200 hover:border-[#4285F4]/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium ${
                        selectedTemplate === template ? 'text-[#4285F4]' : 'text-gray-700'
                      }`}>
                        Layout {template}
                      </span>
                      <input 
                        type="radio"
                        checked={selectedTemplate === template}
                        onChange={() => setSelectedTemplate(template)}
                        className="h-4 w-4 text-[#4285F4] focus:ring-[#4285F4]"
                      />
                    </div>
                    <div className={`h-16 rounded-lg flex items-center justify-center ${
                      selectedTemplate === template 
                        ? 'bg-gradient-to-br from-[#4285F4]/20 to-[#36B7CD]/20' 
                        : 'bg-gray-50'
                    }`}>
                      <span className={`text-xs ${
                        selectedTemplate === template ? 'text-[#4285F4]' : 'text-gray-500'
                      }`}>
                        {template === 1 ? "Classic" : template === 2 ? "Profile" : "Banner"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel || (() => setShowForm(false))}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 bg-gradient-to-r from-[#4285F4] to-[#36B7CD] text-white rounded-lg hover:shadow-lg transition-all ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="material-icons animate-spin mr-2">refresh</span>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="material-icons mr-2">
                      {isEditing ? 'save' : 'add_circle'}
                    </span>
                    {isEditing ? 'Save Changes' : 'Share Achievement'}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="hidden lg:block w-80">
          <div className="sticky top-4">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Preview</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((template) => (
                <div
                  key={template}
                  className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedTemplate === template 
                      ? 'border-[#4285F4] shadow-md scale-100' 
                      : 'border-gray-200 scale-95 opacity-60'
                  }`}
                >
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800">{title || 'Achievement Title'}</h4>
                    <p className="text-xs text-gray-500">
                      By {currentUser?.fullName || currentUser?.username || 'You'}
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-[#4285F4]/10 text-[#4285F4] text-xs rounded-full mt-1">
                      {category || 'Category'}
                    </span>
                    
                    {imagePreview && template !== 2 && (
                      <div className="my-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-24 object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    {template === 2 && imagePreview && (
                      <div className="flex items-center mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="ml-3 flex-1">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {description || 'Your achievement description will appear here'}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {template !== 2 && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                        {description || 'Your achievement description will appear here'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementForm;
