import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthInfo, clearAuthInfo } from '../api/api';

interface AuthContextProps {
  user: User | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  phone: string;
  token: string;
  companyId: string;
  branchId: string;
  tenantId: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Restore user from localStorage on first load.  This ensures that
  // refreshing the page does not log the administrator out.
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const phone = localStorage.getItem('admin_phone');
    const companyId = localStorage.getItem('company_id');
    const branchId = localStorage.getItem('branch_id');
    const tenantId = localStorage.getItem('tenant_id');
    if (token && phone && companyId && branchId && tenantId) {
      setUser({ phone, token, companyId, branchId, tenantId });
    }
  }, []);

  // Perform login by hitting the login endpoint defined in the supplied
  // Postman collection.  The API expects phone number and password as
  // query parameters.  On success the response should include a bearer
  // token and contextual identifiers.  Adjust the property names below
  // according to your backend implementation.
  const login = async (phone: string, password: string) => {
    try {
      const response = await api.post(
        '/Login',
        null,
        {
          params: {
            PhoneNo: phone,
            Password: password,
          },
        },
      );
      const data = response.data;
      // Expect data in the form { token, branchId, companyId, tenantId }
      const token: string = data?.token;
      const branchId: string = data?.branchId ?? data?.BranchId ?? data?.BranchID;
      const companyId: string = data?.companyId ?? data?.CompanyID;
      const tenantId: string = data?.tenantId ?? data?.TenantId;
      if (!token || !branchId || !companyId || !tenantId) {
        throw new Error('Invalid login response');
      }
      setAuthInfo(token, companyId, branchId, tenantId);
      localStorage.setItem('admin_phone', phone);
      setUser({ phone, token, companyId, branchId, tenantId });
      navigate('/');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Clear local storage and user state on logout.  Redirect back to login.
  const logout = () => {
    clearAuthInfo();
    localStorage.removeItem('admin_phone');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};