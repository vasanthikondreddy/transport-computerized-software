function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {children}
      </div>
    </div>
  );
}

export default Layout;


