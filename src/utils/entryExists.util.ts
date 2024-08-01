import prisma from "../prisma";
import { EntryType } from "./enums";

export default async function entryExists(
  entryType: EntryType,
  id: string
): Promise<Boolean> {
  let entryExists = false;

  switch (entryType) {
    case EntryType.user:
      entryExists = (await prisma.user.findUnique({ where: { id } })) !== null;
      break;
    case EntryType.account:
      entryExists =
        (await prisma.account.findUnique({ where: { id } })) !== null;
      break;
    case EntryType.category:
      entryExists =
        (await prisma.category.findUnique({
          where: { id },
        })) !== null;
      break;
    case EntryType.transaction:
      entryExists =
        (await prisma.transaction.findUnique({ where: { id } })) !== null;
      break;
    default:
      throw new Error("Invalid entry type");
  }

  return entryExists ? true : false;
}
