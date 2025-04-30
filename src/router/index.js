import { createRouter, createWebHistory } from 'vue-router'
import Guest from '../pages/Guest.vue'
import Login from '../pages/Login.vue'
import MyTryouts from '@/pages/MyTryouts.vue'
import MyQuestions from '@/pages/MyQuestions.vue'
import DoTryout from '@/pages/DoTryout.vue'
import MySubmissions from '@/pages/MySubmissions.vue'
import Register from '@/pages/Register.vue'
import api from '@/router/api';
import Home from '@/pages/Home.vue'

const routes = [
  {
    path: '/guest',
    name: 'Guest',
    component: Guest
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } // Mark this route as protected
  },
  {
    path: '/',
    redirect: (to) => {
      const accessToken = localStorage.getItem('accessToken');
      return accessToken && !isTokenExpired(accessToken) ? '/home' : '/guest';
    }
  },
  {
    path: '/my-tryouts',
    name: 'MyTryouts',
    component: MyTryouts,
    meta: { requiresAuth: true } // Mark this route as protected
  },
  {
    path: '/my-tryouts/:id/questions',
    name: 'MyQuestions',
    component: MyQuestions,
    meta: { requiresAuth: true } // Mark this route as protected
  },
  {
    path: '/do-tryout/:id',
    name: 'DoTryout',
    component: DoTryout,
    meta: { requiresAuth: true } // Mark this route as protected
  },
  {
    path: '/my-submissions',
    name: 'MySubmissions',
    component: MySubmissions,
    meta: { requiresAuth: true } // Mark this route as protected
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// // Global navigation guard
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('token') !== null; // Check if token exists

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login'); // Redirect to login if not authenticated
//   } else {
//     next(); // Allow navigation
//   }
// });

function isTokenExpired(token) {
  if (!token) return true; // Kalau tidak ada token, anggap expired

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload
    return payload.exp * 1000 < Date.now(); // Cek apakah token expired
  } catch (error) {
    return true; // Kalau ada error, anggap expired
  }
}

async function refreshToken() {
  try {
    const { data } = await api.post("auth/refresh-token",
      {},
      { withCredentials: true }
    );

    localStorage.setItem("accessToken", data.accessToken);

    api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;

    console.log("🔄 Token refreshed:", data.accessToken);
  } catch (error) {
    console.error("❌ Refresh token failed, logging out...", error);
    localStorage.removeItem("accessToken");
    window.location.replace("/login");
    return false; // Gagal refresh token  
  }
}

async function restoreSession() {
  const token = localStorage.getItem("accessToken");
  if (!token) return; // No token, no need to refresh

  await refreshToken(); // Refresh token immediately on load

  setInterval(refreshToken, 14 * 60 * 1000);
}

restoreSession(); // 


router.beforeEach(async (to, from, next) => {
  let accessToken = localStorage.getItem('accessToken');
  console.log("Token in localStorage:", accessToken);
  console.log("Token expired?", isTokenExpired(accessToken));
  console.log("Navigating to:", to.path);
  console.log("Requires auth?", to.meta.requiresAuth);



  if (to.meta.requiresAuth) {
    if (!accessToken || isTokenExpired(accessToken)) {
      try {
        // Refresh token kalau accessToken sudah expired
        const response = await api.post('auth/refresh-token', {}, { withCredentials: true });
        console.log("Token refreshed:", response.data.accessToken)

        // Simpan accessToken baru
        accessToken = response.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
      } catch (error) {
        console.error("Gagal refresh token:", error.response?.data);
        return next('/login'); // Redirect ke login kalau gagal refresh token
      }
    }

    next();
  } 
  if (['/guest', '/login', '/register'].includes(to.path) && accessToken && !isTokenExpired(accessToken)) {
    return next('/home');
  }

  next();

});


export default router;
