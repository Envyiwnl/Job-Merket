import { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Footer from "../components/Footer";
import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import Companies from "../pages/Companies";
import Internships from "../pages/Internships";
import Categories from "../pages/Categories";
import PageLoader from "../pages/PageLoader";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { AuthProvider } from "./context/AuthProvider";
import { CandidateProvider } from "./context/CandidateProvider";
import ProtectedRoute from "../components/authentication/ProtectedRoute";

const CompanyDetails = lazy(
  () => import("../components/companies/CompanyDetails"),
);
const Resources = lazy(() => import("../pages/Resources"));
const ResourceDetails = lazy(() => import("../pages/ResourcesDetails"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const Profile = lazy(() => import("../pages/Profile"));
const SavedJobs = lazy(() => import("../pages/SavedJobs"));
const Applications = lazy(() => import("../pages/Applications"));
const RecruiterLayout = lazy(
  () => import("../components/recruiter/RecruiterLayout"),
);
const RecruiterDashboard = lazy(
  () => import("../pages/recruiter/RecruiterDashboard"),
);
const PostJob = lazy(() => import("../pages/recruiter/PostJob"));
const ManageJobs = lazy(() => import("../pages/recruiter/ManageJobs"));
const Applicants = lazy(() => import("../pages/recruiter/Applicants"));
const RecruiterProfile = lazy(
  () => import("../pages/recruiter/RecruiterProfile"),
);

const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Privacy = lazy(() => import("../pages/Privacy"));
const Terms = lazy(() => import("../pages/Terms"));

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <CandidateProvider>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:id" element={<CompanyDetails />} />
                <Route path="/internships" element={<Internships />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route
                  path="/resources/:id"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <ResourceDetails />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/recruiter/login"
                  element={<Login isRecruiter />}
                />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/recruiter/register"
                  element={<Register isRecruiter />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved-jobs"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <SavedJobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <Applications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter"
                  element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                      <RecruiterLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<RecruiterDashboard />} />
                  <Route path="dashboard" element={<RecruiterDashboard />} />
                  <Route path="jobs/new" element={<PostJob />} />
                  <Route path="jobs/:id/edit" element={<PostJob isEdit />} />
                  <Route path="jobs" element={<ManageJobs />} />
                  <Route path="applicants" element={<Applicants />} />
                  <Route path="profile" element={<RecruiterProfile />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
          </CandidateProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
