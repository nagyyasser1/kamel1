type JWT_PAYLOAD = {
  id: string;
  email: string;
  role: string;
};

type Account = {
  accountName: string;
  accountCode: number;
  totalBalance: number;
  thisYear: {
    totalSentTransactions: number;
    totalSentAmount: number;
    totalReceivedTransactions: number;
    totalReceivedAmount: number;
    balance: number;
  };
  previousYears: {
    totalSentTransactions: number;
    totalSentAmount: number;
    totalReceivedTransactions: number;
    totalReceivedAmount: number;
    balance: number;
  };
};

export { JWT_PAYLOAD, Account };
