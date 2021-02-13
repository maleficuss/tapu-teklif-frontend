import Login from "@/components/Login";
import Home from "@/components/Home";
const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresAuth: false,
        }
    },

    { path: '*', redirect: '/' }
]

export default routes