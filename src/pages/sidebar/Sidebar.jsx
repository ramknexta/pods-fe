import {Icon} from "@iconify/react";
import {useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {handleTitleChange} from "../../store/slices/auth/authSlice.js";
import Logo from "../../assets/Logo.svg"

const Sidebar = () => {
    const [active, setActive] = useState('Dashboard');
    const dispatch = useDispatch();

    const sidebar = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: 'tdesign:calendar-2-filled'
        },
        {
            label: 'Add Branch',
            path: '/branch-management',
            icon: 'mdi:office-building-plus'
        },
        {
            label: 'Add Customer',
            path: '/add-customer',
            icon: 'mdi:account-plus'
        },
        {
            label: 'Add Rooms',
            path: '/add-rooms',
            icon: 'mdi:room-plus'
        },
        {
            label: 'Pod',
            path: '/pod',
            icon: 'tdesign:dashboard-filled'
        },
        {
            label: 'Report',
            path: '/report',
            icon: 'tdesign:dashboard-filled'
        },
        {
            label: 'Accounting',
            path: '/accounting',
            icon: 'tdesign:dashboard-filled'
        },
        {
            label: 'Setting',
            path: '/settings',
            icon: 'uiw:setting'
        },
        {
            label: 'Support',
            path: '/support',
            icon: 'fluent:person-support-24-filled'
        },
    ]


    const handleClick = (nav) => {
        setActive(nav.label)
        dispatch(handleTitleChange(nav.label))
    }

    return (
        <div className='fixed w-20 h-full p-5 z-50'>
            <div className='h-full w-20 border border-mild-black rounded-lg flex flex-col items-center'>
                <img src={Logo} alt="Logo" height={28} width={28} className='mt-5' />
                <div className='flex flex-col gap-5 items-center justify-center h-full w-full'>
                    {
                        sidebar.map((icon, index) => (
                            <div key={index} onClick={() => handleClick(icon)} className='relative cursor-pointer w-full py-2 flex items-center justify-center'>
                                {
                                    active === icon.label && (
                                        <div className='absolute left-0 text-2xl w-1 border rounded-r-3xl h-full font-bold bg-primary'></div>
                                    )
                                }
                                <Link to={icon.path}>
                                    <Icon icon={icon.icon} height={28} width={28} />
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Sidebar