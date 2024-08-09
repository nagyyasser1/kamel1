import prisma from "../prisma";

export const createAccount = async (data: any) => {
  return await prisma.account.create({
    data,
  });
};

export const deleteAccount = async (id: string) => {
  return await prisma.account.delete({
    where: { id },
  });
};

export const getAllAccounts = async (categoryId?: string, name?: string) => {
  const where: any = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive", // Case-insensitive search
    };
  }

  return await prisma.account.findMany({
    where,
    include: {
      category: true,
    },
  });
};

export const getAccountById = async (id: string) => {
  return await prisma.account.findUnique({
    where: { id },
    include: {
      category: true,
      sentTransactions: true,
      receivedTransactions: true,
    },
  });
};

export const getAccountByName = async (name: string) => {
  return await prisma.account.findUnique({
    where: { name },
  });
};

export const getAccountByNumber = async (number: number) => {
  return await prisma.account.findUnique({
    where: { number },
  });
};

export async function getCategoryTransactionSummary(year: number) {
  const categories = await prisma.category.findMany({
    where: {
      accounts: {
        some: {},
      },
    },
    include: {
      accounts: {
        include: {
          sentTransactions: {
            where: {
              OR: [
                {
                  createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`),
                  },
                },
                {
                  createdAt: {
                    lt: new Date(`${year}-01-01`), // Before the start of the provided year
                  },
                },
              ],
            },
          },
          receivedTransactions: {
            where: {
              OR: [
                {
                  createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`),
                  },
                },
                {
                  createdAt: {
                    lt: new Date(`${year}-01-01`), // Before the start of the provided year
                  },
                },
              ],
            },
          },
        },
      },
    },
  });

  const summary = categories.map((category) => {
    const monthlySummary = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalSentTransactions: 0,
      totalReceivedTransactions: 0,
      totalSentAmount: BigInt(0),
      totalReceivedAmount: BigInt(0),
    }));

    let totalSentTransactions = 0;
    let totalReceivedTransactions = 0;
    let totalSentAmount = BigInt(0);
    let totalReceivedAmount = BigInt(0);

    let allPreviousSentTransactions = 0;
    let allPreviousReceivedTransactions = 0;
    let allPreviousSentAmount = BigInt(0);
    let allPreviousReceivedAmount = BigInt(0);

    category.accounts.forEach((account) => {
      account.sentTransactions.forEach((transaction) => {
        const transactionYear = transaction.createdAt.getFullYear();
        const month = transaction.createdAt.getMonth();

        if (transactionYear === year) {
          monthlySummary[month].totalSentTransactions += 1;
          monthlySummary[month].totalSentAmount += BigInt(transaction.amount);

          totalSentTransactions += 1;
          totalSentAmount += BigInt(transaction.amount);
        } else if (transactionYear < year) {
          allPreviousSentTransactions += 1;
          allPreviousSentAmount += BigInt(transaction.amount);
        }
      });

      account.receivedTransactions.forEach((transaction) => {
        const transactionYear = transaction.createdAt.getFullYear();
        const month = transaction.createdAt.getMonth();

        if (transactionYear === year) {
          monthlySummary[month].totalReceivedTransactions += 1;
          monthlySummary[month].totalReceivedAmount += BigInt(
            transaction.amount
          );

          totalReceivedTransactions += 1;
          totalReceivedAmount += BigInt(transaction.amount);
        } else if (transactionYear < year) {
          allPreviousReceivedTransactions += 1;
          allPreviousReceivedAmount += BigInt(transaction.amount);
        }
      });
    });

    return {
      categoryId: category.id,
      categoryName: category.name,
      totalSentTransactions,
      totalReceivedTransactions,
      totalSentAmount: Number(totalSentAmount),
      totalReceivedAmount: Number(totalReceivedAmount),
      allPreviousSentTransactions,
      allPreviousReceivedTransactions,
      allPreviousSentAmount: Number(allPreviousSentAmount),
      allPreviousReceivedAmount: Number(allPreviousReceivedAmount),
      monthlySummary: monthlySummary.map((monthData) => ({
        ...monthData,
        totalSentAmount: Number(monthData.totalSentAmount),
        totalReceivedAmount: Number(monthData.totalReceivedAmount),
      })),
    };
  });

  return summary;
}

// export async function getCategoryTransactionSummary(year: number) {
//   const previousYear = year - 1;

//   const categories = await prisma.category.findMany({
//     where: {
//       accounts: {
//         some: {},
//       },
//     },
//     include: {
//       accounts: {
//         include: {
//           sentTransactions: {
//             where: {
//               OR: [
//                 {
//                   createdAt: {
//                     gte: new Date(`${year}-01-01`),
//                     lt: new Date(`${year + 1}-01-01`),
//                   },
//                 },
//                 {
//                   createdAt: {
//                     gte: new Date(`${previousYear}-01-01`),
//                     lt: new Date(`${previousYear + 1}-01-01`),
//                   },
//                 },
//               ],
//             },
//           },
//           receivedTransactions: {
//             where: {
//               OR: [
//                 {
//                   createdAt: {
//                     gte: new Date(`${year}-01-01`),
//                     lt: new Date(`${year + 1}-01-01`),
//                   },
//                 },
//                 {
//                   createdAt: {
//                     gte: new Date(`${previousYear}-01-01`),
//                     lt: new Date(`${previousYear + 1}-01-01`),
//                   },
//                 },
//               ],
//             },
//           },
//         },
//       },
//     },
//   });

//   const summary = categories.map((category) => {
//     const monthlySummary = Array.from({ length: 12 }, (_, index) => ({
//       month: index + 1,
//       totalSentTransactions: 0,
//       totalReceivedTransactions: 0,
//       totalSentAmount: BigInt(0),
//       totalReceivedAmount: BigInt(0),
//     }));

//     let totalSentTransactions = 0;
//     let totalReceivedTransactions = 0;
//     let totalSentAmount = BigInt(0);
//     let totalReceivedAmount = BigInt(0);

//     let prevYearSentTransactions = 0;
//     let prevYearReceivedTransactions = 0;
//     let prevYearSentAmount = BigInt(0);
//     let prevYearReceivedAmount = BigInt(0);

//     category.accounts.forEach((account) => {
//       account.sentTransactions.forEach((transaction) => {
//         const transactionYear = transaction.createdAt.getFullYear();
//         const month = transaction.createdAt.getMonth();

//         if (transactionYear === year) {
//           monthlySummary[month].totalSentTransactions += 1;
//           monthlySummary[month].totalSentAmount += BigInt(transaction.amount);

//           totalSentTransactions += 1;
//           totalSentAmount += BigInt(transaction.amount);
//         } else if (transactionYear === previousYear) {
//           prevYearSentTransactions += 1;
//           prevYearSentAmount += BigInt(transaction.amount);
//         }
//       });

//       account.receivedTransactions.forEach((transaction) => {
//         const transactionYear = transaction.createdAt.getFullYear();
//         const month = transaction.createdAt.getMonth();

//         if (transactionYear === year) {
//           monthlySummary[month].totalReceivedTransactions += 1;
//           monthlySummary[month].totalReceivedAmount += BigInt(
//             transaction.amount
//           );

//           totalReceivedTransactions += 1;
//           totalReceivedAmount += BigInt(transaction.amount);
//         } else if (transactionYear === previousYear) {
//           prevYearReceivedTransactions += 1;
//           prevYearReceivedAmount += BigInt(transaction.amount);
//         }
//       });
//     });

//     return {
//       categoryId: category.id,
//       categoryName: category.name,
//       totalSentTransactions,
//       totalReceivedTransactions,
//       totalSentAmount: Number(totalSentAmount),
//       totalReceivedAmount: Number(totalReceivedAmount),
//       prevYearSentTransactions,
//       prevYearReceivedTransactions,
//       prevYearSentAmount: Number(prevYearSentAmount),
//       prevYearReceivedAmount: Number(prevYearReceivedAmount),
//       monthlySummary: monthlySummary.map((monthData) => ({
//         ...monthData,
//         totalSentAmount: Number(monthData.totalSentAmount),
//         totalReceivedAmount: Number(monthData.totalReceivedAmount),
//       })),
//     };
//   });

//   return summary;
// }

// export async function getCategoryTransactionSummary(year: number) {
//   const categories = await prisma.category.findMany({
//     where: {
//       accounts: {
//         some: {},
//       },
//     },
//     include: {
//       accounts: {
//         include: {
//           sentTransactions: {
//             where: {
//               createdAt: {
//                 gte: new Date(`${year}-01-01`),
//                 lt: new Date(`${year + 1}-01-01`),
//               },
//             },
//           },
//           receivedTransactions: {
//             where: {
//               createdAt: {
//                 gte: new Date(`${year}-01-01`),
//                 lt: new Date(`${year + 1}-01-01`),
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   const summary = categories.map((category) => {
//     const monthlySummary = Array.from({ length: 12 }, (_, index) => ({
//       month: index + 1,
//       totalSentTransactions: 0,
//       totalReceivedTransactions: 0,
//       totalSentAmount: BigInt(0),
//       totalReceivedAmount: BigInt(0),
//     }));

//     let totalSentTransactions = 0;
//     let totalReceivedTransactions = 0;
//     let totalSentAmount = BigInt(0);
//     let totalReceivedAmount = BigInt(0);

//     category.accounts.forEach((account) => {
//       account.sentTransactions.forEach((transaction) => {
//         const month = transaction.createdAt.getMonth();
//         monthlySummary[month].totalSentTransactions += 1;
//         monthlySummary[month].totalSentAmount += BigInt(transaction.amount);

//         totalSentTransactions += 1;
//         totalSentAmount += BigInt(transaction.amount);
//       });

//       account.receivedTransactions.forEach((transaction) => {
//         const month = transaction.createdAt.getMonth();
//         monthlySummary[month].totalReceivedTransactions += 1;
//         monthlySummary[month].totalReceivedAmount += BigInt(transaction.amount);

//         totalReceivedTransactions += 1;
//         totalReceivedAmount += BigInt(transaction.amount);
//       });
//     });

//     return {
//       categoryId: category.id,
//       categoryName: category.name,
//       totalSentTransactions,
//       totalReceivedTransactions,
//       totalSentAmount: Number(totalSentAmount),
//       totalReceivedAmount: Number(totalReceivedAmount),
//       monthlySummary: monthlySummary.map((monthData) => ({
//         ...monthData,
//         totalSentAmount: Number(monthData.totalSentAmount),
//         totalReceivedAmount: Number(monthData.totalReceivedAmount),
//       })),
//     };
//   });

//   return summary;
// }
