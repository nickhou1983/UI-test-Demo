import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:id" element={<DestinationDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
