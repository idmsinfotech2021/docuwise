import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';
import DashboardCards from './components/DashboardCards';
import UploadCustomerPO from './components/UploadCustomerPO';
import UploadInvoice from './components/UploadInvoice';
import UploadCOA from './components/UploadCOA';
import UploadTDS from './components/UploadTDS';
import ManagePrompt from './components/ManagePrompt';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import TenantManagement from './components/TenantManagement';
import UserManagement from './components/UserManagement';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import UserLogin from './components/UserLogin';
import UserDashboard from './components/UserDashboard';
import SidebarLayout from "./components/SidebarLayout";    // new
import DocumentUploadLanding from "./components/DocumentUploadLanding";    // new
import AIGeneratorLandingPage from "./components/AIGeneratorLandingPage";    // new
import MenuManager from "./components/MenuManager";    // new
import ValidationRuleManager from './components/ValidationRuleManager';
//import ValidationRuleManager from "./components/ValidationRuleManager ";    // new
import ViewExtraction from './components/ViewExtraction'; 
import ValidationDashboard from './components/ValidationDashboard'; 
import TemplateUpload from './components/TemplateUpload';
import SectionConfigurator from './components/SectionConfigurator';
import QuestionConfigurator from './components/QuestionConfigurator';
import ProposalWizard from './components/ProposalWizard';
import ProposalQA from './components/ProposalQA';
import HistoryAndArchive from './components/HistoryAndArchive';
import ERPIntegration from './components/ERPIntegration';
import TenantSettingsLanding from './components/TenantSettingsLanding';
import TenantUserManagement from './components/TenantUserManagement';
import TenantFieldMappingView from './components/TenantFieldMappingView';
import RetentionPolicies from './components/RetentionPolicies';
import BrandingSetup from './components/BrandingSetup';
import { BrandingProvider } from './context/BrandingContext';

function App() {
  
  return (
   <BrandingProvider>
      <Router>
            <Routes>
               {/* LOGIN Route - no sidebar */}
               <Route path="/" element={<UserLogin />} />
               <Route path="/login" element={<UserLogin />} />
               <Route path="/admin-login" element={<AdminLogin />} />

               {/* USER ROUTES inside Sidebar Layout */}
               <Route element={<SidebarLayout />}>
                  <Route path="/user-dashboard" element={<UserDashboard />} />
                  <Route path="/validate/:uploadId" element={<ViewExtraction />} />
                  <Route path="/document-upload" element={<DocumentUploadLanding menu="Smart Upload" />} />
                  <Route path="/upload-customer-po" element={<UploadCustomerPO />} />
                  <Route path="/upload-invoice" element={<UploadInvoice />} />
                  <Route path="/upload-coa" element={<UploadCOA />} />
                  <Route path="/upload-tds-form" element={<UploadTDS />} />
                  <Route path="/validation-dashboard" element={<ValidationDashboard />} />
                  <Route path="/ai-generators" element={<AIGeneratorLandingPage menu="AI Generators" />} />
                  <Route path="/tenant-settings" element={<TenantSettingsLanding menu="Tenant Settings" />} />
                  <Route path="/upload-template" element={<TemplateUpload />} />
                  <Route path="/configure-section" element={<SectionConfigurator />} />
                  <Route path="/configure-question" element={<QuestionConfigurator />} />
                  <Route path="/proposal-wizard" element={<ProposalWizard />} />
                  <Route path="/proposal-wizard/:sessionId" element={<ProposalQA />} />
                  <Route path="/document-history" element={<HistoryAndArchive />} />
                  <Route path="/push-to-erp" element={<ERPIntegration />} />
                  <Route path="/tenant-settings/users" element={<TenantUserManagement />} />
                  <Route path="/tenant-settings/field-mapping" element={<TenantFieldMappingView />} />
                  <Route path="/tenant-settings/retention" element={<RetentionPolicies />} />
                  <Route path="/tenant-settings/branding" element={<BrandingSetup />} />
                  <Route path="/" element={<DashboardCards />} />
               </Route>

               {/* ADMIN ROUTES inside Sidebar Layout */}
               <Route element={<SidebarLayout />}>
                  <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                  <Route path="/admin/tenants" element={<ProtectedAdminRoute><TenantManagement /></ProtectedAdminRoute>} />
                  <Route path="/admin/users" element={<ProtectedAdminRoute><UserManagement /></ProtectedAdminRoute>} />
                  <Route path="/manage-prompts" element={<ManagePrompt />} />
                  <Route path="/admin/menus" element={<MenuManager role="admin" />} />
                  <Route path="/user/menus" element={<MenuManager role="user" />} />
                  <Route path="/admin/validation-rules" element={<ProtectedAdminRoute><ValidationRuleManager /></ProtectedAdminRoute>} />

               </Route>
               

            </Routes>
      </Router>
   </BrandingProvider>
  );
}

export default App;
