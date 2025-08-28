import {lazy, Suspense} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import Line from "../components/loader/Line.jsx";
import {user} from "../utils/constants.js";

const Header = lazy(() => import('../pages/header/Navbar.jsx'))
const Sidebar = lazy(() => import('../pages/sidebar/Sidebar.jsx'))
const Login = lazy(() => import('../pages/auth/Login/index.jsx'))
const AdminDashboard = lazy(() => import('../pages/Dashboard/index.jsx'))
const CustomerDashboard = lazy(() => import('../layout/Customer.jsx'))
const Pod = lazy(() => import('../pages/pod/index.jsx'))
const CustomerPod = lazy(() => import('../pages/pod/customer/CustomerPod.jsx'))
const Setting = lazy(() => import('../pages/settings/index.jsx'))
const Profile = lazy(() => import('../pages/profile/index.jsx'))
const Accounting = lazy(() => import('../pages/accounting/index.jsx'))
const Support = lazy(() => import('../pages/support/index.jsx'))
const Report = lazy(() => import('../pages/report/index.jsx'))
const History = lazy(() => import('../pages/history/index.jsx'))
const Management = lazy(() => import('../pages/management/index.jsx'))
const ManagementRoom = lazy(() => import('../pages/rooms/index.jsx'))
const CustomerOnboarding = lazy(() => import('../pages/onboarding/customer/index.jsx'))
const ManagementOnboarding = lazy(() => import('../pages/onboarding/management/index.jsx'))
const CustomerDetails = lazy(() => import('../pages/customer/Details.jsx'))
const RoomAllocation = lazy(() => import('../pages/rooms/Allocation.jsx'))

const preLoginRoutes = [
    {
        component: Login,
        path:'/login',
        title: 'Login'
    }
]

const rtRoutes = [
    {
        component: ManagementOnboarding,
        path:'/management-onboarding',
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
        component: Management,
        path:'/management',
        title: 'Management'
    },
    {
        component: ManagementRoom,
        path:'/management-room',
        title: 'Room'
    },
    {
        component: CustomerDetails,
        path:'/customer-details',
        title: 'Customer Details'
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
    {
        component: CustomerOnboarding,
        path: '/customer-onboarding',
        title: 'Onboarding'
    },
    {
        component: RoomAllocation,
        path: '/allocation',
        title: 'Room Allocation'
    }
]

const customerRoutes = [
    {
        component: CustomerDashboard,
        path:'/dashboard',
        title: 'Customer Dashboard'
    },
    {
        component: CustomerPod,
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

    const isAuthenticated = !!token;

    let routes = preLoginRoutes;


    if (isAuthenticated && user.ADMIN === role) {
        routes = adminRoutes;
    } else if (isAuthenticated && user.CUSTOMER === role) {
        routes = customerRoutes;
    } else if (isAuthenticated && user.RT === role) {
        routes = rtRoutes;
    }

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