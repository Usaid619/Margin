import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { StudioProvider } from './contexts/StudioContext';
import { MusicProvider } from './contexts/MusicContext';
import { AppShell } from './components/navigation/AppShell';
import { RequireAuth } from './components/navigation/RequireAuth';
import { PageTransition } from './components/animations/PageTransition';
import { TypeLoader } from './components/ui/TypeLoader';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Modes = lazy(() => import('./pages/Modes').then((m) => ({ default: m.Modes })));
const WriteSession = lazy(() => import('./pages/WriteSession').then((m) => ({ default: m.WriteSession })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Library = lazy(() => import('./pages/Library').then((m) => ({ default: m.Library })));
const PieceDetail = lazy(() => import('./pages/PieceDetail').then((m) => ({ default: m.PieceDetail })));
const Editor = lazy(() => import('./pages/Editor').then((m) => ({ default: m.Editor })));
const Prompts = lazy(() => import('./pages/Prompts').then((m) => ({ default: m.Prompts })));
const Discover = lazy(() => import('./pages/Discover').then((m) => ({ default: m.Discover })));
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Signup').then((m) => ({ default: m.Signup })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then((m) => ({ default: m.ResetPassword })));
const Onboarding = lazy(() => import('./pages/Onboarding').then((m) => ({ default: m.Onboarding })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Journal = lazy(() => import('./pages/Journal').then((m) => ({ default: m.Journal })));
const JournalArticle = lazy(() => import('./pages/JournalArticle').then((m) => ({ default: m.JournalArticle })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

function RouteTree() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<TypeLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/modes" element={<Modes />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/about" element={<About />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:slug" element={<JournalArticle />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<RequireAuth allowIncomplete />}>
              <Route path="/onboarding" element={<Onboarding />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/:id" element={<PieceDetail />} />
              <Route path="/editor/:id" element={<Editor />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/write/:mode" element={<WriteSession />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>);

}

export function App() {
  return (
    <BrowserRouter>
      <StudioProvider>
        <MusicProvider>
          <AppShell>
            <RouteTree />
          </AppShell>
        </MusicProvider>
      </StudioProvider>
    </BrowserRouter>);

}