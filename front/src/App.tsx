import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import store from "./features/auth/store";
import { SocketProvider } from "./features/socket/SockerProvider";
import Layout from "./Layout";
import PrivateRoutes from "./Layout/PrivateRoute";
import PublicRoutes from "./Layout/PublicRoute";
import Dashboards from "./pages/dashboard";
import Device from "./pages/device";
import DeviceDetails from "./pages/device/details";
import DeviceType from "./pages/device/deviceType";
import EditDeviceType from "./pages/device/deviceType/components/EditDeviceType";
import Dyanmic from "./pages/dynamic";
import Forbidden from "./pages/error/forbidden";
import NotFound from "./pages/error/not-found";
import AccessDenied from "./pages/error/unauthorized";
import Facturation from "./pages/facturation";
import Flows from "./pages/flowdesigner";
import CreateFlowPage from "./pages/flowdesigner/create-flow";
import FlowEditor from "./pages/flowdesigner/editor";
import NewComponentPage from "./pages/flowdesigner/new";
import LandingPageLayout from "./pages/home";
import LandingPage from "./pages/home/landing-page/LandingPage";
import Pricing from "./pages/home/pricing/Pricing";
import Login from "./pages/login";
import ForgotPassword from "./pages/login/components/ForgotPassword";
import SignUp from "./pages/login/components/SignUp";
import Machine from "./pages/machine";
import EditMachine from "./pages/machine/components/EditMachine";
import MachineState from "./pages/machine/components/MachineState";
import Broker from "./pages/settings/brokers";
import BrokerSpecification from "./pages/settings/brokers/components/Broker";
import EditBroker from "./pages/settings/brokers/components/EditBroker";
import Users from "./pages/settings/users";
import UserEditForm from "./pages/settings/users/components/UserEditForm";
import Tenant from "./pages/tenant";
import EditTenantPage from "./pages/tenant/components/EditTenantPage";
import TenantDetails from "./pages/tenant/details";
import Tokens from "./pages/tokens";
import EditToken from "./pages/tokens/components/EditToken";
import { EditDevice } from "./pages/device/components/edit-device";
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
  useEffect(() => {
    const AppName = "DigiSense";
    document.title = AppName;
  }, []);
  return (
    <SocketProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Toaster />

            <Routes>
              <Route element={<PublicRoutes />}>
                <Route element={<LandingPageLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/pricing" element={<Pricing />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/forgot-password"
                  index
                  element={<ForgotPassword />}
                />
                {/* <Route path="/" element={<Home />}></Route> */}
              </Route>
              <Route element={<PrivateRoutes />}>
                <Route element={<Layout />}>
                  <Route path="/flow" element={<Flows />} />
                  <Route path="/editor/:id" element={<FlowEditor />} />
                  <Route path="/create-flow" element={<CreateFlowPage />} />
                  <Route
                    path="/components/new"
                    element={<NewComponentPage />}
                  />

                  <Route path="dashboards" element={<Dashboards />} />
                  <Route path="/dashboard" element={<Dyanmic />} />
                  <Route path="/analytic/:id" element={<Dyanmic />} />
                  <Route path="/entity/:id" element={<Dyanmic />} />

                  <Route path="/device" element={<Device />} />
                  <Route path="/device/:id" element={<DeviceDetails />} />
                  <Route path="/device/edit/:id" element={<EditDevice />} />

                  <Route path="/forbidden" element={<Forbidden />} />
                  <Route path="/unauthorized" element={<AccessDenied />} />
                  <Route path="/not-found" element={<NotFound />} />

                  <Route path="/devicetype" element={<DeviceType />} />
                  <Route
                    path="/devicetype/edit/:id"
                    element={<EditDeviceType />}
                  />
                  <Route path="/machine" element={<Machine />} />
                  <Route path="/machine/edit/:id" element={<EditMachine />} />
                  {/* <Route path="/machinetype" element={<MachineType />} />
                  <Route
                    path="/machineType/edit/:id"
                    element={<EditMachineType />}
                  /> */}
                  <Route path="/machine/:serial" element={<MachineState />} />
                  {/* <Route
                    path="/connection/manage"
                    element={<ConnectionData />}
                  /> */}
                  {/* <Route path="/connection" element={<Connection />} /> */}
                  <Route path="settings/users" element={<Users />} />
                  <Route
                    path="settings/users/edit/:id"
                    element={<UserEditForm />}
                  />
                  <Route path="settings/broker" element={<Broker />} />
                  <Route
                    path="settings/broker/edit/:id"
                    element={<EditBroker />}
                  />
                  <Route path="/tenant" element={<Tenant />} />
                  <Route path="/tenant/:id" element={<TenantDetails />} />
                  <Route path="/tenant/edit/:id" element={<EditTenantPage />} />
                  {/* <Route path="settings" element={<Settings />} /> */}
                  {/* <Route path="/workflow/:id" element={<Workflow />} /> */}
                  <Route path="broker/:id" element={<BrokerSpecification />} />
                  <Route path="tokens" element={<Tokens />} />
                  <Route path="facturation" element={<Facturation />} />
                  <Route path="/token/edit/:id" element={<EditToken />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </SocketProvider>
  );
}

export default App;
