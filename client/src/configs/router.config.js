import About from '@pages/About';
import HomePage from '@pages/HomePage';
import User from '@pages/User'



const routers = [
    {
        path: '/',
        component: HomePage,
        name: 'Home'
    },
    {
        path: '/about',
        component: About,
        name: 'About'
    },
    {
        path: '/user',
        component: User,
        name: 'user'
    },

]

export default routers