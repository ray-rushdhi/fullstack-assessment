import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import UserListPage from './pages/UserListPage';
import UserDetailPage from './pages/UserDetailPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
      </Route>
    </Routes>
  );
}