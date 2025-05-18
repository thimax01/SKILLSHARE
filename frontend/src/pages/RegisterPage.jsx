// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useUser } from '../contexts/UserContext';
// import Alert from '../components/Alert';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     fullName: '',
//     bio: '',
//     role: 'LEARNER',
//     specializations: [],
//   });
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { register } = useUser();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'confirmPassword') {
//       setConfirmPassword(value);
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     // Validate passwords match
//     if (formData.password !== confirmPassword) {
//       setError('Passwords do not match');
//       setIsLoading(false);
//       return;
//     }

//     // Validate password strength
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       setIsLoading(false);
//       return;
//     }

//     // Make sure role is included in the submission
//     const userData = {
//       ...formData,
//       role: formData.role || 'LEARNER' // Default to LEARNER if not set
//     };

//     const result = await register(userData);
    
//     setIsLoading(false);
    
//     if (result.success) {
//       navigate('/');
//     } else {
//       setError(result.error);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center py-8">
//       <div className="bg-gray-100 rounded-lg shadow-lg p-8 w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">Create Account</h2>
        
//         {error && (
//           <Alert
//             type="error"
//             message={error}
//             onClose={() => setError(null)}
//           />
//         )}
        
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="fullName">
//               Full Name
//             </label>
//             <input
//               className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500"
//               id="fullName"
//               name="fullName"
//               type="text"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               placeholder="Enter your full name"
//             />
//           </div>
          
//           <div className="mb-4">
//             <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="username">
//               Username
//             </label>
//             <input
//               className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500"
//               id="username"
//               name="username"
//               type="text"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               placeholder="Choose a username"
//             />
//           </div>
          
//           <div className="mb-4">
//             <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
//               Email
//             </label>
//             <input
//               className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500"
//               id="email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter your email"
//             />
//           </div>
          
//           <div className="mb-4">
//             <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">
//               Password
//             </label>
//             <input
//               className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500"
//               id="password"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder="Create a password"
//             />
//           </div>
          
//           <div className="mb-6">
//             <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="confirmPassword">
//               Confirm Password
//             </label>
//             <input
//               className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500"
//               id="confirmPassword"
//               name="confirmPassword"
//               type="password"
//               value={confirmPassword}
//               onChange={handleChange}
//               required
//               placeholder="Confirm your password"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="role">
//               Role
//             </label>
//             <select
//               className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500"
//               id="role"
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               required
//             >
//               <option value="LEARNER">Learner</option>
//               <option value="INSTRUCTOR">Instructor</option>
//             </select>
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="bio">
//               Bio
//             </label>
//             <textarea
//               className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500"
//               id="bio"
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               rows="3"
//               placeholder="Tell us about yourself..."
//             />
//           </div>

//           {formData.role === 'INSTRUCTOR' && (
//             <div className="mb-4">
//               <label className="block text-gray-800 text-sm font-bold mb-2">
//                 Specializations
//               </label>
//               <input
//                 type="text"
//                 className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500"
//                 placeholder="Enter specializations separated by commas"
//                 value={formData.specializations.join(', ')}
//                 onChange={(e) => setFormData({
//                   ...formData,
//                   specializations: e.target.value.split(',').map(s => s.trim())
//                 })}
//               />
//             </div>
//           )}
          
//           <div className="flex flex-col space-y-4">
//             <button
//               className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline ${
//                 isLoading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//               type="submit"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Creating Account...' : 'Register'}
//             </button>
            
//             <div className="text-center mt-4">
//               <span className="text-gray-800">Already have an account? </span>
//               <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
//                 Log in
//               </Link>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;













import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Sparkles, User, Mail, Lock, Book, Briefcase, FileText, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

const Alert = ({ type, message, onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-50' : 'bg-green-50';
  const borderColor = type === 'error' ? 'border-red-500' : 'border-green-500';
  const textColor = type === 'error' ? 'text-red-700' : 'text-green-700';
  
  return (
    <div className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 rounded mb-6 relative`}>
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <span className="sr-only">Close</span>
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      <p className="font-medium">{type === 'error' ? 'Error' : 'Success'}</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    bio: '',
    role: 'LEARNER',
    specializations: [],
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { register } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else if (name === 'specializations') {
      setFormData({
        ...formData,
        specializations: value.split(',').map(s => s.trim()),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (!formData.fullName || !formData.username || !formData.email) {
        setError('Please fill in all required fields');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.password || !confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      
      if (formData.password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await register(formData);
    
    setIsLoading(false);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  };

  return (
    <div className="mt-16">
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] p-12 flex-col justify-between">
          <div>
            <div className="flex items-center">
              <Sparkles className="text-white h-8 w-8 mr-2" />
              <span className="text-2xl font-bold text-white">SkillShare</span>
            </div>
            <div className="mt-16">
              <h1 className="text-4xl font-bold text-white mb-6">Share Your Knowledge, Grow Together</h1>
              <p className="text-white/90 text-lg leading-relaxed">
                Join our community of learners and instructors. Share your expertise, learn from others, and grow your skills.
              </p>
            </div>
          </div>
          <p className="text-white/70">© 2025 SkillShare. All rights reserved.</p>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
              <p className="text-gray-600 mt-2">Join our community today</p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-1">
                <span className={`text-xs font-medium ${currentStep >= 1 ? 'text-[#3B82F6]' : 'text-gray-400'}`}>
                  Personal Info
                </span>
                <span className={`text-xs font-medium ${currentStep >= 2 ? 'text-[#3B82F6]' : 'text-gray-400'}`}>
                  Security
                </span>
                <span className={`text-xs font-medium ${currentStep >= 3 ? 'text-[#3B82F6]' : 'text-gray-400'}`}>
                  Profile
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-[#10B981] h-1.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError('')}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Info */}
              <div className={`space-y-4 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fullName">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-3 pl-10 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">@</span>
                    </div>
                    <input
                      className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-3 pl-10 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-3 pl-10 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Security */}
              <div className={`space-y-4 ${currentStep === 2 ? 'block' : 'hidden'}`}>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-3 pl-10 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-3 pl-10 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Profile */}
              <div className={`space-y-4 ${currentStep === 3 ? 'block' : 'hidden'}`}>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    I want to join as
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div 
                      className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-[#3B82F6]/5
                        ${formData.role === 'LEARNER' ? 'border-[#3B82F6] bg-[#3B82F6]/5' : 'border-gray-200'}`}
                      onClick={() => setFormData({...formData, role: 'LEARNER'})}
                    >
                      <Book className={`h-8 w-8 mb-2 ${formData.role === 'LEARNER' ? 'text-[#3B82F6]' : 'text-gray-400'}`} />
                      <span className={`font-medium ${formData.role === 'LEARNER' ? 'text-[#3B82F6]' : 'text-gray-700'}`}>
                        Learner
                      </span>
                    </div>

                    <div 
                      className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-[#3B82F6]/5
                        ${formData.role === 'INSTRUCTOR' ? 'border-[#3B82F6] bg-[#3B82F6]/5' : 'border-gray-200'}`}
                      onClick={() => setFormData({...formData, role: 'INSTRUCTOR'})}
                    >
                      <Briefcase className={`h-8 w-8 mb-2 ${formData.role === 'INSTRUCTOR' ? 'text-[#3B82F6]' : 'text-gray-400'}`} />
                      <span className={`font-medium ${formData.role === 'INSTRUCTOR' ? 'text-[#3B82F6]' : 'text-gray-700'}`}>
                        Instructor
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="bio">
                      Bio
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-3 pl-10 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {formData.role === 'INSTRUCTOR' && (
                    <div className="mt-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Specializations
                      </label>
                      <input
                        type="text"
                        className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                        placeholder="Enter specializations separated by commas"
                        value={formData.specializations.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData,
                          specializations: e.target.value.split(',').map(s => s.trim())
                        })}
                      />
                      <p className="text-xs text-gray-500 mt-1">E.g. Web Development, UX Design, Data Science</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg hover:opacity-90 transition-colors"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center px-4 py-2 bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-[#10B981] text-white font-medium rounded-lg hover:opacity-90 transition-colors ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-50 transition-all flex items-center justify-center"
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="w-5 h-5 mr-2" />
              Sign up with Google
            </button>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-[#3B82F6] hover:text-[#2563EB] font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;