import { createRouter, createWebHistory } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { useBaseStore } from "@/store/index.js";
import SignIn from "@pages/SignIn.vue"
import SignUp from "@pages/SignUp.vue"
import Home from "@pages/Home.vue"
import UserLayout from "@layouts/UserLayout.vue"
import Profile from "@pages/User/Profile.vue"
import Password from "@pages/User/Password.vue"
import Purchase from "@pages/User/Purchase.vue"



const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/home",
    children: [
      {
        path: "/sign-in",
        name: "Sign in",
        component: SignIn,
      },
      {
        path: "/sign-up",
        name: "Sign up",
        component: SignUp,
      },
      {
        path: "/home",
        name: "Home",
        component: Home,
      },

      //user
      {
        path: "/user",
        name: "User",
        component: UserLayout,
        requiresAuth: true,
        children: [
          {
            path: "account/profile",
            name: "Profile",
            component: Profile
          },
          {
            path: "account/password",
            name: "Password",
            component: Password
          },
          {
            path: "purchase",
            name: "Purchase",
            component: Purchase
          },
        ]
      }
    ]
  },
  // {
  //   path: "/:pathMatch(.*)*",
  //   redirect: "/home",
  // },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const store = useBaseStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn() || !store.isLoggedIn) {
      next({
        path: "/sign-in",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

//hàm check login với token
function isLoggedIn() {
  const store = useBaseStore();
  const token = localStorage.getItem("token");
  store.isLoggedIn = true;

  if (token) {
    //giải mã token
    const decoded = jwtDecode(token);
    store.roles = decoded.scope.replaceAll("ROLE_","");
    store.username = decoded.sub;
    store.fullName = decoded.name;
    

    // Kiểm tra xem token có hết hạn hay không
    const expirationDate = new Date(decoded.exp * 1000);
    if (expirationDate <= new Date()) {
      // Nếu token đã hết hạn, xóa nó khỏi localStorage và trả về false
      localStorage.removeItem("token");
      return false;
    } else {
      // Nếu token hợp lệ, trả về true
      return true;
    }
  } else {
    // Nếu token không tồn tại trong localStorage, trả về false
    return false;
  }
}

export default router;
