import { AuthProvider } from './AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    </AuthProvider>
  );
}