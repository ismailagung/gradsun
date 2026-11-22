import { z } from "zod";
import type { ICustomerRepository } from "../repositories/customer.repository";

export const getCustomersDirectorySchema = z.object({
  search: z.string().optional(),
  campus: z.string().optional(),
});

export type GetCustomersDirectoryInput = z.infer<typeof getCustomersDirectorySchema>;

export interface CustomerDirectoryItem {
  id: string;
  name: string;
  phone: string;
  instagram: string;
  campus: string;
  campusBadge: string;
  orders: string;
  spent: string;
  rawSpent: number;
}

export interface CustomersDirectoryResult {
  totalCustomers: number;
  customers: CustomerDirectoryItem[];
}

function extractCampusBadge(campus: string | null): string {
  if (!campus) return "General";
  const upper = campus.toUpperCase();
  if (upper.includes("UI") || upper.includes("INDONESIA")) return "UI";
  if (upper.includes("ITB") || upper.includes("BANDUNG")) return "ITB";
  if (upper.includes("UGM") || upper.includes("MADA")) return "UGM";
  if (upper.includes("UNPAD") || upper.includes("PADJADJARAN")) return "Unpad";
  return "General";
}

export class GetCustomersDirectoryUseCase {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  async execute(input?: GetCustomersDirectoryInput): Promise<CustomersDirectoryResult> {
    const rawCustomers = await this.customerRepo.findAllCustomers(input);

    const customers: CustomerDirectoryItem[] = rawCustomers.map((c) => {
      const orders = `${c.totalOrders} ${c.totalOrders === 1 ? "Session" : "Sessions"}`;
      const spent = `IDR ${c.totalSpent.toLocaleString("en-US")}`;
      const campusBadge = extractCampusBadge(c.campus);

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        instagram: c.instagram ?? "@gradsun",
        campus: c.campus ?? "Universitas Indonesia",
        campusBadge,
        orders,
        spent,
        rawSpent: c.totalSpent,
      };
    });

    return {
      totalCustomers: customers.length,
      customers,
    };
  }
}
