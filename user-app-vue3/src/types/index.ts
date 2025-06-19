// i18n interface
export interface ShellI18n {
  t(key: string, values?: any): string;
  locale: string;
}

// Event Bus interface
export interface ShellEventBus {
  $emit(event: string, payload?: any): void;
  $on(event: string, callback: Function): void;
  $off(event: string, callback: Function): void;
}

// User Entity
export interface User {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  age: number;
}

export interface ShellStore {
  users: User[];
  isLoading: boolean;
  error: string;
  userCount: number;

  fetchUsers(): Promise<void>;
  deleteUser(id: number): Promise<void>;
  addUser(user: Omit<User, 'id'>): Promise<void>;
  updateUser(payload: { id: number; userData: Partial<User> }): Promise<void>;
}