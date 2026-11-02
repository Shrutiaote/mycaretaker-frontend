import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import ElderlyProfile from "./pages/ElderlyProfile";
import ElderlyDashboard from "./pages/ElderlyDashboard";
import HealthInformation from "./pages/HealthInformation";
import ViewHealthInformation from "./pages/ViewHealthInformation";
import FindCaretaker from "./pages/FindCaretaker";
import CaretakerProfile from "./pages/CaretakerProfile";
import CaretakerDashboard from "./pages/CaretakerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyCareRequests from "./pages/MyCareRequests";
import CaretakerCareRequests from "./pages/CaretakerCareRequests";
import CareSchedule from "./pages/CareSchedule";
import CaretakerSchedule from "./pages/CaretakerSchedule";
import CreateCareSchedule from "./pages/CreateCareSchedule";
import Notifications from "./pages/Notifications";
import FamilyMemberProfile from "./pages/FamilyMemberProfile";
import FamilyMemberDashboard from "./pages/FamilyMemberDashboard";
import MyElderly from "./pages/MyElderly";
import ConnectElderly from "./pages/ConnectElderly";
import FamilyHealthInformation from "./pages/FamilyHealthInformation";
import FamilyFindCaretaker from "./pages/FamilyFindCaretaker";
import FamilyCareRequests from "./pages/FamilyCareRequests";
import FamilyCareSchedule from "./pages/FamilyCareSchedule";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/elderly/dashboard"
                    element={<ElderlyDashboard />}
                />

                <Route
                    path="/elderly/profile"
                    element={<ElderlyProfile />}
                />

                <Route
                    path="/elderly/health-information"
                    element={<HealthInformation />}
                />

                <Route
                  path="/elderly/view-health-information"
                  element={<ViewHealthInformation />}
                />

                <Route
                   path="/elderly/find-caretaker"
                   element={<FindCaretaker />}
                />

                <Route
                   path="/caretaker/profile"
                   element={<CaretakerProfile />}
                />

                <Route
                   path="/caretaker/dashboard"
                   element={<CaretakerDashboard />}
                />

                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboard />}
                />

                <Route
                   path="/elderly/care-requests"
                   element={<MyCareRequests />}
                />

                <Route
                   path="/caretaker/care-requests"
                   element={<CaretakerCareRequests />}
                />

                <Route
                   path="/elderly/care-schedule"
                   element={<CareSchedule />}
                />

                <Route
                   path="/caretaker/care-schedule"
                   element={<CaretakerSchedule />}
                />

                <Route
                  path="/caretaker/create-schedule/:careRequestId"
                  element={<CreateCareSchedule />}
                />

               <Route
                  path="/notifications"
                  element={<Notifications />}
               />

               <Route
                  path="/family/dashboard"
                  element={<FamilyMemberDashboard />}
               />

               <Route
                  path="/family/profile"
                  element={<FamilyMemberProfile />}
               />

               <Route
                  path="/family/elderly"
                  element={<MyElderly />}
               />

               <Route
                   path="/family/connect-elderly"
                   element={<ConnectElderly />}
               />

               <Route
                  path="/family/elderly-health-information"
                  element={<FamilyHealthInformation />}
               />

               <Route
                  path="/family/find-caretaker"
                  element={<FamilyFindCaretaker />}
               />

               <Route
                  path="/family/care-requests"
                  element={<FamilyCareRequests />}
               />

               <Route
                  path="/family/care-schedule"
                  element={<FamilyCareSchedule />}
               />

            </Routes>

        </BrowserRouter>
    );
}

export default App;