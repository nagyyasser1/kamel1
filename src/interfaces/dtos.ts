export interface CreateCodeDto {
  number: number;
  description: string;
}

export interface UpdateCodeDto {
  number?: number;
  description?: string;
}

export interface CreateAccountDto {
  name: string;
  description: string;
  codeId: string;
  type: string;
}

export interface UpdateAccountDto {
  name?: string;
  description?: string;
  codeId?: string;
  type?: string;
}

export interface CreateTransactionDto {
  senderId: string;
  receiverId: string;
  date: Date;
  amount: number;
  description: string;
}

export interface UpdateTransactionDto {
  senderId?: string;
  receiverId?: string;
  date?: Date;
  amount?: number;
  description?: string;
}

export interface CreateAccountData {}

export interface UpdateAccountData {
  type?: string;
  ownerId?: string;
}
