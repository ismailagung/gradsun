import { describe, expect, it } from "vitest";
import {
  type AddonSelection,
  calculateInvoicePricing,
} from "@/modules/reservations/services/pricing-calculator.service";

describe("PricingCalculatorService", () => {
  describe("calculateInvoicePricing - Calculation Logic", () => {
    it("calculates clean invoice total with zero add-ons", () => {
      const result = calculateInvoicePricing({
        packagePrice: 1500000,
        packageName: "Solo Commencement",
      });

      expect(result).toEqual({
        packagePrice: 1500000,
        packageName: "Solo Commencement",
        addonsSubtotal: 0,
        totalAmount: 1500000,
        advisoryDepositAmount: undefined,
        addonsBreakdown: [],
      });
    });

    it("calculates invoice total with multiple add-ons correctly", () => {
      const addons: AddonSelection[] = [
        {
          id: "addon-1",
          name: "Fine-Art Hardcover Photobook",
          unitPrice: 450000,
          quantity: 2,
        },
        {
          id: "addon-2",
          name: "24-Hour Express Turnaround",
          unitPrice: 300000,
          quantity: 1,
        },
      ];

      const result = calculateInvoicePricing({
        packagePrice: 1950000,
        packageName: "Besties & Duo",
        addons,
      });

      // Photobook: 450k * 2 = 900k
      // Express: 300k * 1 = 300k
      // Addons subtotal: 1.2M
      // Total: 1.95M + 1.2M = 3.15M
      expect(result.addonsSubtotal).toBe(1200000);
      expect(result.totalAmount).toBe(3150000);
      expect(result.addonsBreakdown).toHaveLength(2);
      expect(result.addonsBreakdown[0]).toEqual({
        id: "addon-1",
        name: "Fine-Art Hardcover Photobook",
        unitPrice: 450000,
        quantity: 2,
        subtotal: 900000,
      });
      expect(result.addonsBreakdown[1]).toEqual({
        id: "addon-2",
        name: "24-Hour Express Turnaround",
        unitPrice: 300000,
        quantity: 1,
        subtotal: 300000,
      });
    });

    it("calculates optional advisory deposit amount when percentage is provided", () => {
      const result = calculateInvoicePricing({
        packagePrice: 2000000,
        packageName: "Sunset Special",
        advisoryDepositPercentage: 50,
      });

      expect(result.totalAmount).toBe(2000000);
      expect(result.advisoryDepositAmount).toBe(1000000);
    });

    it("handles zero quantity add-ons cleanly without altering total", () => {
      const addons: AddonSelection[] = [
        {
          id: "addon-1",
          name: "Archival Prints",
          unitPrice: 250000,
          quantity: 0,
        },
      ];

      const result = calculateInvoicePricing({
        packagePrice: 1500000,
        packageName: "Solo Commencement",
        addons,
      });

      expect(result.addonsSubtotal).toBe(0);
      expect(result.totalAmount).toBe(1500000);
      expect(result.addonsBreakdown[0]?.subtotal).toBe(0);
    });
  });

  describe("calculateInvoicePricing - Validation & Defensive Invariants", () => {
    it("throws error when package price is negative", () => {
      expect(() =>
        calculateInvoicePricing({
          packagePrice: -500000,
          packageName: "Invalid Package",
        }),
      ).toThrow("Package price cannot be negative");
    });

    it("throws error when add-on quantity is negative", () => {
      expect(() =>
        calculateInvoicePricing({
          packagePrice: 1500000,
          packageName: "Solo Commencement",
          addons: [
            {
              id: "add-1",
              name: "Prints",
              unitPrice: 200000,
              quantity: -2,
            },
          ],
        }),
      ).toThrow("Add-on quantity must be a non-negative integer");
    });

    it("throws error when add-on quantity is not an integer", () => {
      expect(() =>
        calculateInvoicePricing({
          packagePrice: 1500000,
          packageName: "Solo Commencement",
          addons: [
            {
              id: "add-1",
              name: "Prints",
              unitPrice: 200000,
              quantity: 1.5,
            },
          ],
        }),
      ).toThrow("Add-on quantity must be a non-negative integer");
    });

    it("throws error when add-on unit price is negative", () => {
      expect(() =>
        calculateInvoicePricing({
          packagePrice: 1500000,
          packageName: "Solo Commencement",
          addons: [
            {
              id: "add-1",
              name: "Prints",
              unitPrice: -50000,
              quantity: 1,
            },
          ],
        }),
      ).toThrow("Add-on unit price cannot be negative");
    });

    it("throws error when advisory deposit percentage is out of range (< 0 or > 100)", () => {
      expect(() =>
        calculateInvoicePricing({
          packagePrice: 1000000,
          packageName: "Solo",
          advisoryDepositPercentage: -10,
        }),
      ).toThrow("Advisory deposit percentage must be between 0 and 100");

      expect(() =>
        calculateInvoicePricing({
          packagePrice: 1000000,
          packageName: "Solo",
          advisoryDepositPercentage: 150,
        }),
      ).toThrow("Advisory deposit percentage must be between 0 and 100");
    });
  });
});
