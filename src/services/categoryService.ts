import prisma from "../prisma";

// Create a category
export const createCategory = async (data: {
  name: string;
  number: number;
  parentId?: string;
}) => {
  return prisma.category.create({
    data,
  });
};

// Get all top-level categories
export const getCategories = async () => {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      subCategories: {
        include: {
          subCategories: {
            include: {
              subCategories: {
                include: {
                  subCategories: {
                    include: {
                      subCategories: {
                        include: {
                          subCategories: {
                            include: {
                              subCategories: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

// Get a category by ID
export const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      subCategories: {
        include: {
          subCategories: true,
        },
      },
      accounts: true,
    },
  });
};

// Get a category by Number
export const getCategoryByNumber = async (number: number) => {
  return prisma.category.findUnique({
    where: { number },
    include: {
      subCategories: {
        include: {
          subCategories: true,
        },
      },
    },
  });
};

// Update a category
export const updateCategory = async (
  id: string,
  data: { name?: string; number?: number }
) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

// Delete a category
export const deleteCategory = async (id: string) => {
  await prisma.category.delete({
    where: { id },
  });
};
