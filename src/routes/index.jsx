import {lazy, Suspense, useEffect} from "react";
import user from "../utils/constants.js";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import Line from "../components/loader/Line.jsx";

const Header = lazy(() => import('../pages/header/Navbar.jsx'))
const Sidebar = lazy(() => import('../pages/sidebar/Sidebar.jsx'))
const Login = lazy(() => import('../pages/auth/Login/index.jsx'))
const AdminDashboard = lazy(() => import('../pages/Dashboard/index.jsx'))
const CustomerDashboard = lazy(() => import('../layout/Customer.jsx'))
const Pod = lazy(() => import('../pages/pod/index.jsx'))
const Setting = lazy(() => import('../pages/settings/index.jsx'))
const Profile = lazy(() => import('../pages/profile/index.jsx'))
const Accounting = lazy(() => import('../pages/accounting/index.jsx'))
const Support = lazy(() => import('../pages/support/index.jsx'))
const Report = lazy(() => import('../pages/report/index.jsx'))
const History = lazy(() => import('../pages/history/index.jsx'))

// Temporary placeholder components for new routes
const AddBranch = lazy(() => import('../pages/branch-management/index.jsx'))
const AddCustomer = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/onboarding?customer=true');
    }, [navigate]);
    return null;
};
const AddRooms = () => <div className="p-6"><h1 className="text-2xl font-bold">Add Rooms</h1><p className="mt-4">Add Rooms functionality coming soon...</p></div>
const Onboarding = lazy(() => import('../pages/onboarding/index.jsx'))

const preLoginRoutes = [
    {
        component: Login,
        path:'/login',
        title: 'Login'
    }
]

const adminRoutes = [
    {
        component: AdminDashboard,
        path:'/dashboard',
        title: 'Admin Dashboard'
    },
    {
        component: AddBranch,
        path:'/branch-management',
        title: 'Branch Management'
    },
    {
        component: AddCustomer,
        path:'/add-customer',
        title: 'Add Customer'
    },
    {
        component: AddRooms,
        path:'/add-rooms',
        title: 'Add Rooms'
    },
    {
        component: Onboarding,
        path:'/onboarding',
        title: 'Onboarding'
    },
    {
        component: Pod,
        path:'/pod',
        title: 'POD'
    },
    {
        component: Report,
        path:'/report',
        title: 'Report'
    },
    {
        component: Accounting,
        path:'/accounting',
        title: 'Accounting'
    },
    {
        component: Setting,
        path:'/settings',
        title: 'Settings'
    },
    {
        component: Support,
        path:'/support',
        title: 'Support'
    },
    {
        component: Profile,
        path:'/profile',
        title: 'Profile'
    },
]

const customerRoutes = [
    {
        component: CustomerDashboard,
        path:'/dashboard',
        title: 'Customer Dashboard'
    },
    {
        component: Pod,
        path:'/pod',
        title: 'Pod'
    },
    {
        component: History,
        path:'/history',
        title: 'History'
    }
]

export const AppRoutes = () => {

    const { role, token } = useSelector(state => state.auth);

    // Temporarily bypass authentication for development
    const isAuthenticated = true; // !!token; // Commented out for development
    const mockRole = user.ADMIN; // Set to ADMIN or CUSTOMER as needed

    let routes = preLoginRoutes;

    console.log('Current role:', role || mockRole)

    if (isAuthenticated && (role === user.ADMIN || mockRole === user.ADMIN)) {
        routes = adminRoutes;
    } else if (isAuthenticated && (role === user.CUSTOMER || mockRole === user.CUSTOMER)) {
        routes = customerRoutes;
    }

    console.log(routes)

    return (
        <>
            <Suspense fallback={<Line/>}>
                <Routes>
                {
                    routes && routes.map((route, index) => {
                        const {component: RouteComponent, path} = route;


                        return (
                            <Route key={index} path={path} exact element={
                                <div>
                                    {isAuthenticated && <Header/>}
                                    {isAuthenticated && <Sidebar/>}
                                    <RouteComponent/>
                                </div>
                            } />
                        )

                    })
                }
                    {routes.length > 0 && (<Route path="*" element={<Navigate to={routes[0].path} replace />} /> )}
                </Routes>
            </Suspense>
        </>
    )
}