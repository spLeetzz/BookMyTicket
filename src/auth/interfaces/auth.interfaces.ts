export interface AuthServiceDto {
  getGoogleRedirectUrl(state: string): string;
  handleGoogleCallback({ code }: { code: string }): Promise<any>;
  renewAccessToken: (refreshToken: string) => Promise<any>;
  login: (data: LoginUserDto) => Promise<any>;
  logout: (refreshToken: string) => Promise<any>;
  register: (data: RegisterUserDto) => Promise<any>;
}

export interface RegisterUserDto {
  firstName: string;
  lastName?: string | null | undefined;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName?: string | undefined;
  email: string;
  passwordHash?: string | undefined;
}
