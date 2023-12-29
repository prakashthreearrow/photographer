import { lazy } from "react";

//LRF
const Login = lazy(() => import("../container/Login"));
const Register = lazy(() => import("../container/Register"));
const ForgotPassword = lazy(() => import("../container/ForgetPassword"));
const ResetPassword = lazy(() => import("../container/ResetPassword"));

const Dashboard = lazy(() => import("../container/Dashboard"));

// Job
const JobDetail = lazy(() => import("../container/JobModule/JobDetail"));
const EditProfile = lazy(() => import("../container/JobModule/EditProfile"));
const JobCalender = lazy(() => import("../container/JobModule/Calender"));
const JobFullCalender = lazy(() => import("../container/JobModule/FullCalender"));

// Client
const ClientJobDetail = lazy(() => import("../container/ClientModule/ClientJobDetail"));
const ClientEditProfile = lazy(() => import("../container/ClientModule/ClientEditProfile"));
const ClientDashboard = lazy(() => import("../container/ClientModule/ClientJobDashboard"));
const PlaceAnOrder = lazy(() => import("../container/ClientModule/PlaceAnOrder"));
const Cart = lazy(() => import("../container/ClientModule/Cart"));
const CheckOut = lazy(() => import("../container/ClientModule/CheckOut"));

// Editor
const EditorDashBoard = lazy(() => import("../container/EditorModule/EditorDashboard"));
const EditorEditorProfile = lazy(() => import("../container/EditorModule/EditEditorProfile"));
const EditorJobDetail = lazy(() => import("../container/EditorModule/JobDetailEditor"));
const DownloadLink = lazy(() => import("../container/EditorModule/DownloadLink"));

// Photographer
const SignUp = lazy(() => import("../component/SignUpFlowPhotographer/SignUp"));
const SignUpNext = lazy(() => import("../component/SignUpFlowPhotographer/SignUpNext"));
const SignUpNext2 = lazy(() =>
  import("../component/SignUpFlowPhotographer/SignUpNext2")
);

// Photographer Sign-up flow
const SignUpNext3 = lazy(() => import("../component/SignUpFlowPhotographer/SignUpNext3"));
const SignUpNext4 = lazy(() => import("../component/SignUpFlowPhotographer/SignUpNext4"));
const SignUpNext5 = lazy(() => import("../component/SignUpFlowPhotographer/SignUpNext5"));
const SignUpNext6 = lazy(() => import("../component/SignUpFlowPhotographer/SignUpNext6"));

// Client Sign-up flow
const SignUpClient = lazy(() => import("../component/SignUpFlowCLient/SignUpClient"));
const SignUpClient1 = lazy(() => import("../component/SignUpFlowCLient/SignUpClient1"));
const SignUpClient2 = lazy(() => import("../component/SignUpFlowCLient/SignUpClient2"));
const SignUpClient3 = lazy(() => import("../component/SignUpFlowCLient/SignUpClient3"));

// Editor Sign-up flow
const SignUpEditor = lazy(() => import("../component/SignUpFlowEditor/SignUpEditor"));

//Impersonate
const Impersonate = lazy(() => import("../container/Impersonate"));

const routes = [
  {
    path: "/",
    exact: true,
    name: "Login",
    component: Login,
    private: false
  },
  {
    path: "/register",
    exact: true,
    name: "Register",
    component: Register,
    private: false
  },
  {
    path: "/forgot-password",
    exact: true,
    name: "ForgotPassword",
    component: ForgotPassword,
    private: false
  },
  {
    path: "/reset/password",
    exact: true,
    name: "ResetPassword",
    component: ResetPassword,
    private: false
  },
  {
    path: "/impersonate",
    exact: true,
    name: "Impersonate",
    component: Impersonate,
    private: false
  },
  {
    path: "/editor-dashboard",
    exact: true,
    name: "EditorDashboard",
    component: EditorDashBoard,
    private: false
  },
  {
    path: "/edit-editor-profile",
    exact: true,
    name: "EditorEditorProfile",
    component: EditorEditorProfile,
    private: false
  },
  {
    path: "/job-detail-editor/:job_detail_id",
    exact: true,
    name: "EditorJobDetail",
    component: EditorJobDetail,
    private: false
  },
  {
    path: "/download-link/:id",
    exact: true,
    name: "DownloadLink",
    component: DownloadLink,
    private: false
  },
  {
    path: "/client-job-detail/:job_detail_id",
    exact: true,
    name: "ClientJobDetail",
    component: ClientJobDetail,
    private: false
  },
  {
    path: "/client-edit-profile",
    exact: true,
    name: "ClientEditProfile",
    component: ClientEditProfile,
    private: false
  },
  {
    path: "/client-dashboard",
    exact: true,
    name: "ClientDashboard",
    component: ClientDashboard,
    private: false
  },
  {
    path: "/place-an-order",
    exact: true,
    name: "PlaceAnOrder",
    component: PlaceAnOrder,
    private: false
  },
  {

    path: "/cart",
    exact: true,
    name: "Cart",
    component: Cart,
    private: false
  },
  {
    path: "/check-out",
    exact: true,
    name: "CheckOut",
    component: CheckOut,
    private: false
  },
  {
    path: "/calender",
    exact: true,
    name: "JobCalender",
    component: JobCalender,
    private: false
  },
  {
    path: "/job-detail/:job_detail_id",
    exact: true,
    name: "JobDetail",
    component: JobDetail,
    private: false
  },
  {
    path: "/edit-profile",
    exact: true,
    name: "EditProfile",
    component: EditProfile,
    private: false
  },
  {
    path: "(/dashboard|/)",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
    private: false
  },
  {
    path: "/sign-up",
    exact: true,
    name: "Sign Up",
    component: SignUp,
    private: true
  },
  {
    path: "/sign-up-next",
    exact: true,
    name: "Sign Up Next",
    component: SignUpNext,
    private: true
  },
  {
    path: "/sign-up-next2",
    exact: true,
    name: "sign up next2",
    component: SignUpNext2,
    private: true
  },
  {
    path: "/sign-up-next3",
    exact: true,
    name: "sign up next3",
    component: SignUpNext3,
    private: true
  },
  {
    path: "/sign-up-next4",
    exact: true,
    name: "sign up next4",
    component: SignUpNext4,
    private: true
  },
  {
    path: "/sign-up-next5",
    exact: true,
    name: "sign up next5",
    component: SignUpNext5,
    private: true
  },
  {
    path: "/sign-up-next6",
    exact: true,
    name: "sign up next6",
    component: SignUpNext6,
    private: true
  },
  {
    path: "/sign-up-client",
    exact: true,
    name: "Sign Up Client",
    component: SignUpClient,
    private: false
  },
  {
    path: "/sign-up-client1",
    exact: true,
    name: "Sign Up Client1",
    component: SignUpClient1,
    private: false
  },
  {
    path: "/sign-up-client2",
    exact: true,
    name: "Sign Up Client2",
    component: SignUpClient2,
    private: false
  },
  {
    path: "/sign-up-client3",
    exact: true,
    name: "Sign Up Client3",
    component: SignUpClient3,
    private: false
  },
  {
    path: "/sign-up-editor",
    exact: true,
    name: "Sign Up Editor",
    component: SignUpEditor,
    private: false
  }
];

export default routes;