import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '../types';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  loginWithGovBr: (dados: {
    cpf: string;
    nome: string;
    email?: string;
    nivel: 'bronze' | 'prata' | 'ouro';
  }) => Promise<boolean>;
  cadastrarUsuario: (dados: Omit<UserSession, 'id' | 'criadoEm'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (dados: Partial<UserSession>) => void;
  validarCpf: (cpf: string) => boolean;
}

const STORAGE_KEY = 'guialegal_tea_session_v1';

// Algorithmic validation of Brazilian CPF (Receita Federal standard)
export function validarCpfAlgoritmo(cpfLimpo: string): boolean {
  const cpf = cpfLimpo.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10), 10)) return false;

  return true;
}

export function formatarCpf(cpf: string): string {
  const v = cpf.replace(/\D/g, '').slice(0, 11);
  return v
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Automatically masks CPF as digits are typed (user only needs to type numbers!)
export function aplicarMascaraCpf(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

// Automatically masks phone as digits are typed
export function aplicarMascaraTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Erro ao ler sessão local:', e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Erro ao persistir sessão:', e);
    }
  }, [user]);

  const loginWithGovBr = async (dados: {
    cpf: string;
    nome: string;
    email?: string;
    nivel: 'bronze' | 'prata' | 'ouro';
  }): Promise<boolean> => {
    // Artificial small delay to reflect secure gov.br token verification
    await new Promise((resolve) => setTimeout(resolve, 600));

    const novaSessao: UserSession = {
      id: `govbr_${Date.now()}`,
      authProvider: 'govbr',
      govBrLevel: dados.nivel,
      nome: dados.nome,
      cpf: dados.cpf,
      email: dados.email || `${dados.cpf.replace(/\D/g, '')}@cidadao.gov.br`,
      telefone: '(11) 98765-4321',
      tipoUsuario: 'mae_pai_atipico',
      dataNascimento: '1988-06-14',
      cidade: 'São Paulo',
      uf: 'SP',
      laudo: {
        numeroLaudo: 'LAU-2024-8841-TEA',
        cid: 'F84.0',
        medicoNome: 'Dra. Helena Guimarães',
        crm: '142857/SP',
        dataEmissao: '2024-03-10',
        possuiCiptea: true,
        numeroCiptea: 'CIPTEA-SP-2024-9912',
        orgaoEmissorCiptea: 'SEDPcD/SP',
      },
      criadoEm: new Date().toISOString(),
    };

    setUser(novaSessao);
    return true;
  };

  const cadastrarUsuario = async (
    dados: Omit<UserSession, 'id' | 'criadoEm'>
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const novaSessao: UserSession = {
      ...dados,
      id: `usr_${Date.now()}`,
      criadoEm: new Date().toISOString(),
    };

    setUser(novaSessao);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (dados: Partial<UserSession>) => {
    if (!user) return;
    setUser({ ...user, ...dados });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGovBr,
        cadastrarUsuario,
        logout,
        updateUser,
        validarCpf: validarCpfAlgoritmo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
