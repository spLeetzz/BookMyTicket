export interface CreateTokenDto {
  userId: number;
  tokenHash: string;
  expiresAt: string;
}
