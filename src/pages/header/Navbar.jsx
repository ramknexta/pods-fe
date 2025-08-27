import {Icon} from "@iconify/react";
import {useSelector} from "react-redux";
import {persistor} from "../../store/store.js";
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const {title} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await persistor.purge()
        navigate('/login')
    }

    return (
        <nav className='relative w-full z-50'>
            <div className='fixed w-full p-5 pl-30'>
                <div className='flex items-center justify-between px-5 h-20 border border-mild-black rounded-lg'>
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold text-primary">{title}</h2>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <div className="hidden md:flex flex-1 justify-center px-4">
                            <div className="w-full max-w-md">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full px-4 py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                                    />
                                    {/*<Icon icon='fluent:search-12-filled' height={12} width={12} />*/}
                                </div>
                            </div>
                        </div>

                        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                            <Icon icon='basil:notification-solid' height={24} width={24} />
                            <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                              3
                            </span>
                        </button>

                        <div className="relative group">
                            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                                    {/*<User className="h-4 w-4" />*/}
                                </div>
                            </button>

                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition">
                                <ul className="py-2 text-sm text-gray-700">
                                    <li>
                                        <a
                                            href="/profile"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            Profile
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/settings"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            Settings
                                        </a>
                                    </li>
                                    <li>
                                        <button className="w-full text-left block px-4 py-2 text-red-600 hover:bg-gray-100" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar