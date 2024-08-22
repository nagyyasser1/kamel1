interface Account {
  accountCode: number;
  totalBalance: number;
}

interface TargetAccount {
  accountCode: number;
  percentage: number; // Percentage to subtract
}

const sumGroupOfAccountsWithCustomPercentage = (
  base: any[],
  target: TargetAccount[]
): number => {
  // Filter the base array to include only the accounts that exist in the target array
  const filteredAccounts = base.filter((baseAccount) =>
    target.some(
      (targetAccount) => targetAccount.accountCode === baseAccount.accountCode
    )
  );

  // Sum the totalBalance of the filtered accounts after applying the respective percentage reduction
  const totalSum = filteredAccounts.reduce((sum, account) => {
    // Find the corresponding target account
    const targetAccount = target.find(
      (targetAcc) => targetAcc.accountCode === account.accountCode
    );

    if (targetAccount) {
      // Convert the percentage to its multiplier form and apply it
      const multiplier = 1 - targetAccount.percentage / 100;
      const reducedBalance = account.totalBalance * multiplier;
      return sum + reducedBalance;
    }

    return sum;
  }, 0);

  return totalSum;
};

export default sumGroupOfAccountsWithCustomPercentage;
