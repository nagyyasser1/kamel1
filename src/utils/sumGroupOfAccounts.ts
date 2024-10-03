const sumGroupOfAccounts = (base: any[], target: string[]): number => {
  // Filter the base array to include only the accounts that exist in the target array
  const filteredAccounts = base.filter((baseAccount) =>
    target.some(
      (targetAccountCode) => targetAccountCode === baseAccount.accountCode
    )
  );

  // Sum the totalBalance of the filtered accounts
  const totalSum = filteredAccounts.reduce((sum, account) => {
    return sum + account.totalBalance;
  }, 0);

  return totalSum;
};

export default sumGroupOfAccounts;
