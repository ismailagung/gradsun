import { describe, expect, it, vi } from "vitest";
import type {
  CustomerAggregation,
  ICustomerRepository,
} from "@/modules/reservations/repositories/customer.repository";
import {
  GetCustomersDirectoryUseCase,
  getCustomersDirectorySchema,
} from "@/modules/reservations/use-cases/get-customers-directory.use-case";

describe("GetCustomersDirectoryUseCase (TDD)", () => {
  const mockCustomerAggregations: CustomerAggregation[] = [
    {
      id: "cust-081298765432",
      name: "Adinda Prameswari",
      phone: "+6281298765432",
      instagram: "@adindaprm",
      campus: "UI Depok (Fakultas Ekonomi)",
      totalOrders: 2,
      totalSpent: 3500000,
      lastSessionDate: new Date("2025-05-17"),
    },
    {
      id: "cust-081234567890",
      name: "Rafi & Sarah",
      phone: "+6281234567890",
      instagram: "@adindaprm",
      campus: "ITB Ganesha (SBM)",
      totalOrders: 1,
      totalSpent: 2500000,
      lastSessionDate: new Date("2025-05-17"),
    },
    {
      id: "cust-081987654321",
      name: "Cohort FTUI",
      phone: "+6281987654321",
      instagram: null,
      campus: "UI Depok (Engineering)",
      totalOrders: 3,
      totalSpent: 6000000,
      lastSessionDate: new Date("2025-05-18"),
    },
  ];

  it("validates input schema with getCustomersDirectorySchema", () => {
    const valid = getCustomersDirectorySchema.safeParse({
      search: "Adinda",
      campus: "UI Depok",
    });
    expect(valid.success).toBe(true);

    const empty = getCustomersDirectorySchema.safeParse({});
    expect(empty.success).toBe(true);
  });

  it("retrieves aggregated customer metrics and formats order and spent labels", async () => {
    const mockRepo: ICustomerRepository = {
      findAllCustomers: vi.fn().mockResolvedValue(mockCustomerAggregations),
    };

    const useCase = new GetCustomersDirectoryUseCase(mockRepo);
    const result = await useCase.execute({});

    expect(result.customers).toHaveLength(3);
    expect(result.totalCustomers).toBe(3);

    const cust1 = result.customers[0];
    expect(cust1?.name).toBe("Adinda Prameswari");
    expect(cust1?.orders).toBe("2 Sessions");
    expect(cust1?.spent).toContain("3,500,000");
    expect(cust1?.campusBadge).toBe("UI");
  });

  it("filters customer directory by search query and campus", async () => {
    const mockRepo: ICustomerRepository = {
      findAllCustomers: vi
        .fn()
        .mockImplementation(async (filter?: { search?: string; campus?: string }) => {
          return mockCustomerAggregations.filter((c) => {
            if (
              filter?.search &&
              !c.name.toLowerCase().includes(filter.search.toLowerCase()) &&
              !c.phone.includes(filter.search)
            ) {
              return false;
            }
            if (filter?.campus && !c.campus?.includes(filter.campus)) {
              return false;
            }
            return true;
          });
        }),
    };

    const useCase = new GetCustomersDirectoryUseCase(mockRepo);
    const searchResult = await useCase.execute({ search: "Rafi" });
    expect(searchResult.customers).toHaveLength(1);
    expect(searchResult.customers[0]?.name).toBe("Rafi & Sarah");

    const campusResult = await useCase.execute({ campus: "UI Depok" });
    expect(campusResult.customers).toHaveLength(2);
  });
});
