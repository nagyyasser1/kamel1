export interface TransactionStats {
  accountId: string;
  accountType: string;
  sentTransactionsCount: number;
  receivedTransactionsCount: number;
  sentTransactionsSum: number;
  receivedTransactionsSum: number;
}
