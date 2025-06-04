import { useApolloClient, useMutation } from '@apollo/client';
import { CSSReset } from '@chakra-ui/react';
import { Redirect, Router } from '@reach/router';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import ChangeLog from './components/ChangeLog/index';
import Companies from './components/Companies';
import CompaniesLayout from './components/Companies/Layout';
import CompanyView from './components/Company';
import CompanyAccountLayout from './components/CompanyAccount';
import AccountCompany from './components/CompanyAccount/Account/Account';
import CompanyActivityLog from './components/CompanyAccount/ActivityLog';
import Badges from './components/CompanyAccount/Badges/Badges';
import DataSources from './components/CompanyAccount/DataSources';
import UserManagement from './components/CompanyAccount/UserManagement/UserManagement';
import CompanyRegistrationLayout from './components/CompanyRegistrationLayout';
import CreateCompany from './components/CreateCompany';
import CreateTenant from './components/CreateTenant';
import CreditCard from './components/CreditCard';
import Dashboard from './components/Dashboard/Dashboard';
import ExternalDocument from './components/ExternalDocument';
import Footer from './components/Footer';
import Layout from './components/Layout';
import MenuBar from './components/MenuBar';
import MyAccountLyout from './components/MyAccount';
import Account from './components/MyAccount/Account';
import ActivityLog from './components/MyAccount/ActivityLog';
import Profile from './components/MyAccount/Profile/Profile';
import NewUserStatus from './components/NewUserStatus';
import NotFound from './components/NotFound';
import PickPlan from './components/PickPlan';
import PowerBiReportLayout from './components/PowerBiReport';
import ProjectDetails from './components/Project';
import ProjectsCreate from './components/ProjectsCreate';
import ProjectsView from './components/ProjectsView';
import LoadingScreen from './components/LoadingScreen';
import Maintenance from './components/Maintenance';
import { ManagerApiKeys } from './components/Tenant/Settings/ManagerApiKeys';
import MyTenantLayout from './components/Tenant/Settings/MyTenantLayout';
import { AlertsPollingProvider } from './context/Alert';
import { AssetProvider } from './context/AssetUri/index';
import { TenantCompanyProvider } from './context/TenantCompany';
import OtherMutations from './graphql/Mutations/OtherMutations';
import { useTenantContext } from './hooks';
import { utcStringToLocalDate } from './utils/date';
import { isAnonymousRoute } from './utils/string';
import datadogRum from '../src/config/datadogConfig';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import PBReportLayout from './components/PBReport';
import { Dashboard3DMapProvider } from './context/DashboardAIMap';
const { CREATE_TENANT_GQL } = OtherMutations;

function TenantApp() {
  const { t } = useTranslation();
  return (
    <Dashboard3DMapProvider>
      <AlertsPollingProvider>
        <AssetProvider>
          <TenantCompanyProvider>
            <CSSReset />
            <div className="App">
              <MenuBar />
              <div className="app__body">
                <Router>
                  <Layout path="/">
                    <Redirect from="/" to="/dashboard" noThrow />
                    <CompaniesLayout path="/companies">
                      {[
                        { path: '/all/:viewMode/:page', title: t('All Companies') },
                        { path: '/favorites/:viewMode/:page', title: t('Favorites') },
                        { path: '/internal/:viewMode/:page', title: t('Internal') },
                        { path: '/lists/:id/:viewMode/:page' },
                      ].map(({ path, title }) => (
                        <Companies path={path} key={path} title={title} view={path.replace('/', '')} />
                      ))}
                    </CompaniesLayout>
                    {/*   //redirect to  notifications view*/}
                    {/* <Notifications path="notifications" /> */}
                    <ProjectsView path="projects/:page" />
                    <LoadingScreen path="loadingScreen" />
                    <Maintenance path="maintenance" />
                    <ProjectsCreate path="projects/create" />
                    <ProjectsCreate path="projects/edit/:projectId" />
                    <ProjectDetails path="project/:projectId" />
                    <MyAccountLyout path="/user/account">
                      <Account path="/" />
                      <Profile path="/profile" />
                      <ActivityLog path="/myactivitylog" />
                    </MyAccountLyout>
                    <MyTenantLayout path="/tenant/settings">
                      <ManagerApiKeys path="/apikeys" />
                    </MyTenantLayout>
                    <CompanyAccountLayout path="/account">
                      <AccountCompany path="/" />
                      <Badges path="/settings/badges" />
                      <UserManagement path="/usermanagement" />
                      <DataSources path="/datasources" />
                      <CompanyActivityLog path="/activitylog" />
                    </CompanyAccountLayout>
                    <CompanyView path="company/:companyId" />
                    <CreateTenant path="create-company-profile" />
                    <ChangeLog path="change-log" />
                    <PowerBiReportLayout path="reports/:report/:page" />
                    <Dashboard path="/dashboard" />
                    <PBReportLayout path="/pbreport" />
                    <RedirectHome path="/" />
                    <NotFound default />
                  </Layout>
                </Router>
              </div>
              <Footer />
            </div>
          </TenantCompanyProvider>
        </AssetProvider>
      </AlertsPollingProvider>
    </Dashboard3DMapProvider>
  );
}

function RedirectHome(props: { path: string }) {
  return <Redirect to="/companies/all/list/1" noThrow />;
}

function CreateTenantApp(props: { waitForProvisioning: boolean | null; provisioningStatus: string }) {
  const [step, setStep] = useState<number>(1);
  const departmentHook = useState<string>('');
  const companyNameHook = useState<string>('');
  const einHook = useState<string>('');
  const dunsHook = useState<number>(0);
  const planHook = useState<string>('');
  const cardNameHook = useState<string>('');
  const cardNumberHook = useState<string>('');
  const cardExpirationDate = useState<any>(utcStringToLocalDate(moment().toString()));
  const cardPostalCode = useState<string>('');
  const [showUserStatus, setShowUserStatus] = useState<boolean>(true);
  const { t } = useTranslation();
  const { waitForProvisioning, provisioningStatus } = props;
  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);
  const [saveData] = useMutation(CREATE_TENANT_GQL, {
    update: () => {
      window.location.reload(); // reload in order to get actual status of provisioning
    },
  });

  let renderStep = null;
  const saveDetails = () => {
    saveData({
      variables: {
        companyName: companyNameHook[0],
        stimulusPlan: planHook[0],
        postalCode: cardPostalCode[0],
        nameOnCard: cardNameHook[0],
        cardNumber: cardNumberHook[0].split(' ').join(''),
        cardExpirationDate: cardExpirationDate[0],
        duns: `${dunsHook[0]}`,
        departmentName: departmentHook[0],
        ein: `${einHook[0]}`,
      },
    });
  };

  switch (step) {
    case 1:
      renderStep = (
        <CompanyRegistrationLayout
          title={t('CREATE/JOIN COMPANY')}
          stepText={t('Sign Up Step 1 of 3')}
          subtitle={t('Welcome! You can either join an existing company or create one.')}
        >
          <CreateCompany
            companyNameHook={companyNameHook}
            departmentHook={departmentHook}
            einHook={einHook}
            dunsHook={dunsHook}
            next={next}
          />
        </CompanyRegistrationLayout>
      );
      break;
    case 2:
      renderStep = (
        <CompanyRegistrationLayout
          title={t('PICK A PLAN')}
          stepText={t('Sign Up Step 2 of 3')}
          subtitle={t('Please review and decide on the plan thats right for you.')}
        >
          <PickPlan next={next} prev={prev} planHook={planHook} />
        </CompanyRegistrationLayout>
      );
      break;
    case 3:
      renderStep = (
        <CompanyRegistrationLayout
          title={t('CREDIT CARD INFO')}
          stepText={t('Sign Up Step 3 of 3')}
          subtitle={t('Please fill out all the required fields below. Then press CREATE COMPANY')}
        >
          <CreditCard
            next={saveDetails}
            prev={prev}
            cardNameHook={cardNameHook}
            cardNumberHook={cardNumberHook}
            cardExpirationDate={cardExpirationDate}
            cardPostalCode={cardPostalCode}
          />
        </CompanyRegistrationLayout>
      );
      break;
    default:
      renderStep = (
        <CompanyRegistrationLayout
          title={t('CREATE/JOIN COMPANY')}
          stepText={t('Sign Up Step 1 of 3')}
          subtitle={t('Welcome! You can either join an existing company or create one.')}
        >
          <CreateCompany
            companyNameHook={companyNameHook}
            departmentHook={departmentHook}
            einHook={einHook}
            dunsHook={dunsHook}
            next={next}
          />
        </CompanyRegistrationLayout>
      );
      break;
  }

  return (
    <React.Fragment>
      {showUserStatus ? (
        <CompanyRegistrationLayout>
          <NewUserStatus
            waitForProvisioning={!!waitForProvisioning}
            provisioningStatus={provisioningStatus}
            createNewTenantRedirect={() => setShowUserStatus(false)}
          />
        </CompanyRegistrationLayout>
      ) : (
        renderStep
      )}
    </React.Fragment>
  );
}

const App = () => {
  const client = useApolloClient();
  const { loading: loadTenant, isNewUser, waitForProvisioning, provisioningStatus, user } = useTenantContext(client);
  let authorizedApp = null;

  if (!isAnonymousRoute(window.location.pathname)) {
    if (!loadTenant) {
      authorizedApp =
        isNewUser || waitForProvisioning ? (
          <CreateTenantApp waitForProvisioning={waitForProvisioning} provisioningStatus={provisioningStatus} />
        ) : (
          <TenantApp />
        );
    }
  } else {
    return <ExternalDocument />;
  }
  if (user) {
    datadogRum.setUserProperty('id', user?.sub);
    datadogRum.setUserProperty('name', user?.given_name + ' ' + user?.family_name);
  }

  return authorizedApp;
};

export default withLDConsumer()(App);
