import { useState } from 'react';
import LoginImage from "../../../assets/pod_admin_login.png";
import Logo from "../../../assets/pod_logo.png";
import {useLoginMutation} from "../../../store/slices/auth/authApi.js";
import {useDispatch} from "react-redux";
import {setLoginCredentials} from "../../../store/slices/auth/authSlice.js";
import {useNavigate} from "react-router-dom";
import {Icon} from "@iconify/react";
import toast from "react-hot-toast";


const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login] = useLoginMutation()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!credentials.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!credentials.password) {
            newErrors.password = 'Password is required';
        } else if (credentials.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Here you would typically make an API call to authenticate
            const response = await login(credentials).unwrap()

            const result = response.data

            console.log(result)

            dispatch(setLoginCredentials({
                token: result.token,
                user: result.full_name,
                role: result.role,
                mgmt_id: result.mgmt_id,
            }))

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success('Login successful');
            navigate('/dashboard');

        } catch (error) {
            toast.error(error.data.error || 'Login failed. Please try again.');
            setErrors({ submit: error.data.error || 'Login failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Left side with image */}

            <div className='fixed top-6 left-6'>
                <img src={Logo} className="h-14 w-50" alt="" />
            </div>

            <div className='flex justify-center items-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full h-full'>
                <div className="hidden lg:block relative w-full h-full">
                    <img
                        src={LoginImage}
                        alt="Login visual"
                        className="object-cover"
                    />

                    <div className="inset-0 opacity-20"></div>
                </div>


                <div className="flex flex-col justify-center  px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <h2 className="font-poppins mt-6 text-3xl text-center tracking-tight text-gray-900">
                                POD Booking
                            </h2>
                            <p className="mt-2 text-sm text-center text-gray-600">
                                Enter your credentials to access the dashboard
                            </p>

                        </div>

                        <div className="mt-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {errors.submit && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">
                                                    {errors.submit}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="relative w-full">
                                    <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                                        Email address <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        name='email'
                                        placeholder="Sample@gmail.com"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-3.5 border text-sm border-gray-400 rounded-lg focus:outline-none placeholder-gray-400"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}

                                </div>

                                <div>
                                    <div className="relative w-full">
                                        <label htmlFor="password" className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                                            Password <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            placeholder="secret"
                                            className={`w-full px-3 py-3.5 border text-sm border-gray-400 rounded-lg focus:outline-none placeholder-gray-400 ${
                                                errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <Icon icon="fluent:eye-28-regular" width="28" height="28" />

                                            ) : (
                                                <Icon icon="solar:eye-closed-linear" width="24" height="24" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end">
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center">
                                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          Signing in...
                                        </span>
                                        ) : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Icon components (you might want to move these to separate files)
const EyeIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

export default Login;