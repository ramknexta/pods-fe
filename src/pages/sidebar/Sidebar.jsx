import {Icon} from "@iconify/react";
import {useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {handleTitleChange} from "../../store/slices/auth/authSlice.js";
import Logo from "../../assets/Logo.svg"
import StartUpLogo from "../../assets/startupTN_logo.png"
import {user} from "../../utils/constants.js";

const Sidebar = () => {
    const {role} = useSelector((state) => state.auth);
    const [active, setActive] = useState('Dashboard');
    const dispatch = useDispatch();

    const adminSidebar = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: 'tdesign:calendar-2-filled'
        },
        {
            label: 'Management',
            path: '/management',
            icon: 'material-symbols:dashboard-rounded'
        },
        {
            label: 'Pod',
            path: '/pod',
            icon: 'material-symbols:table-large-rounded'
        },
        {
            label: 'Report',
            path: '/report',
            icon: 'mdi:graph-box'
        },
        {
            label: 'Accounting',
            path: '/accounting',
            icon: 'tabler:file-invoice-filled'
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

    const customerSidebar = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: 'tdesign:calendar-2-filled'
        },
        {
            label: 'Pod',
            path: '/pod',
            icon: 'tdesign:dashboard-filled'
        },
    ]

    const sidebar = role === user.ADMIN ? adminSidebar : customerSidebar;


    const handleClick = (nav) => {
        setActive(nav.label)
        dispatch(handleTitleChange(nav.label))
    }

    return (
        <div className='fixed w-20 h-full px-3 py-2 z-50'>
            <div className='h-full w-18 border border-mild-black rounded-2xl flex flex-col items-center bg-white'>
                <div className='relative mt-5'>
                    <div className="fixed left-5 z-10 bg-[#253B80] rounded-full shadow-lg w-8 h-8 flex items-center justify-center">
                        <img src={StartUpLogo} alt="Logo" height={14} width={14}/>
                    </div>
                    <div className="fixed left-11 z-20  bg-white rounded-full shadow-lg w-8 h-8 flex items-center justify-center">
                        <img src={Logo} alt="Logo" height={15} width={15} />
                    </div>

                </div>
                <div className='flex flex-col gap-5 items-center justify-center h-3/4 w-full'>
                    {
                        sidebar.map((icon, index) => (
                            <Link to={icon.path} key={index} onClick={() => handleClick(icon)} className='relative cursor-pointer w-full py-2 flex items-center justify-center'>
                                {
                                    active === icon.label && (
                                        <div className='absolute left-0 text-2xl w-1 border rounded-r-3xl h-full font-bold bg-primary'></div>
                                    )
                                }
                                <Icon icon={icon.icon} height={20} width={20} />
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Sidebar