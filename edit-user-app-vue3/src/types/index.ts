// User Entity
export interface User {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  age: number;
}

export interface I18nService {
  t: (key: string) => string;
  locale: string;
}

export interface HostRouterService {
  push: (location: string | object) => Promise<void>;
  replace: (location: string | object) => Promise<void>;
  currentRoute: any
}

export interface StoreAdapterState {
  users: User[];
  isLoading: boolean;
  error: string;
}

export interface StoreAdapter {
  state: StoreAdapterState;
  getters: {
    allUsers: () => User[];
    userCount: () => number;
    isLoading: () => boolean;
    error: () => string;
  };
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<User | undefined>;
  addUser: (userData: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, userData: Partial<Omit<User, 'id'>>) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  eventBus: {
    on: (eventName: string, callback: Function) => void;
    off: (eventName: string, callback: Function) => void;
    emit: (eventName: string, payload?: any) => void;
  };
}