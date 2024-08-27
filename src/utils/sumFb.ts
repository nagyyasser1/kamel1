type Account = {
  totalBalance: number;
};

const sumFpAccounts = (accounts: Account[]) => {
  let total: number = 0;

  accounts.forEach((account) => {
    return (total += account.totalBalance);
  });
  return total;
};

export default sumFpAccounts;
