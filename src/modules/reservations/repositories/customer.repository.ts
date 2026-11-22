import { prisma } from "@/infrastructure/prisma/client";

export interface CustomerAggregation {
  id: string;
  name: string;
  phone: string;
  instagram: string | null;
  campus: string | null;
  totalOrders: number;
  totalSpent: number;
  lastSessionDate?: Date | null;
}

export interface ICustomerRepository {
  findAllCustomers(filter?: { search?: string; campus?: string }): Promise<CustomerAggregation[]>;
}

export class CustomerRepository implements ICustomerRepository {
  async findAllCustomers(filter?: {
    search?: string;
    campus?: string;
  }): Promise<CustomerAggregation[]> {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        clientName: true,
        clientPhone: true,
        instagramHandle: true,
        campusName: true,
        grandTotal: true,
        status: true,
        paymentStatus: true,
        sessionDate: true,
      },
    });

    const customerMap = new Map<string, CustomerAggregation>();

    for (const r of reservations) {
      const normalizedPhone = r.clientPhone.replace(/\D/g, "") || r.clientName.toLowerCase();
      const existing = customerMap.get(normalizedPhone);

      const isPaid =
        r.paymentStatus === "DP_PAID" ||
        r.paymentStatus === "FULL_PAID" ||
        r.status === "CONFIRMED" ||
        r.status === "COMPLETED";

      const orderSpent = isPaid ? r.grandTotal : 0;

      if (!existing) {
        customerMap.set(normalizedPhone, {
          id: `cust-${normalizedPhone}`,
          name: r.clientName,
          phone: r.clientPhone,
          instagram: r.instagramHandle ?? null,
          campus: r.campusName ?? null,
          totalOrders: 1,
          totalSpent: orderSpent,
          lastSessionDate: r.sessionDate,
        });
      } else {
        existing.totalOrders += 1;
        existing.totalSpent += orderSpent;
        if (!existing.instagram && r.instagramHandle) {
          existing.instagram = r.instagramHandle;
        }
        if (!existing.campus && r.campusName) {
          existing.campus = r.campusName;
        }
        if (
          r.sessionDate &&
          (!existing.lastSessionDate || r.sessionDate > existing.lastSessionDate)
        ) {
          existing.lastSessionDate = r.sessionDate;
        }
      }
    }

    let customers = Array.from(customerMap.values());

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          Boolean(c.instagram?.toLowerCase().includes(q)) ||
          Boolean(c.campus?.toLowerCase().includes(q)),
      );
    }

    if (filter?.campus) {
      const campusQ = filter.campus.toLowerCase();
      customers = customers.filter((c) => Boolean(c.campus?.toLowerCase().includes(campusQ)));
    }

    customers.sort((a, b) => b.totalSpent - a.totalSpent);

    return customers;
  }
}
