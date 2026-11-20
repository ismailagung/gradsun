export interface AddonSelection {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface CalculateInvoicePricingInput {
  packagePrice: number;
  packageName: string;
  addons?: AddonSelection[];
  advisoryDepositPercentage?: number;
}

export interface AddonLineItemBreakdown {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface InvoicePricingResult {
  packagePrice: number;
  packageName: string;
  addonsSubtotal: number;
  totalAmount: number;
  advisoryDepositAmount?: number;
  addonsBreakdown: AddonLineItemBreakdown[];
}

export function calculateInvoicePricing(input: CalculateInvoicePricingInput): InvoicePricingResult {
  const { packagePrice, packageName, addons = [], advisoryDepositPercentage } = input;

  if (packagePrice < 0) {
    throw new Error("Package price cannot be negative");
  }

  if (
    advisoryDepositPercentage !== undefined &&
    (advisoryDepositPercentage < 0 || advisoryDepositPercentage > 100)
  ) {
    throw new Error("Advisory deposit percentage must be between 0 and 100");
  }

  const addonsBreakdown: AddonLineItemBreakdown[] = [];
  let addonsSubtotal = 0;

  for (const addon of addons) {
    if (addon.quantity < 0 || !Number.isInteger(addon.quantity)) {
      throw new Error("Add-on quantity must be a non-negative integer");
    }

    if (addon.unitPrice < 0) {
      throw new Error("Add-on unit price cannot be negative");
    }

    const subtotal = addon.unitPrice * addon.quantity;
    addonsSubtotal += subtotal;

    addonsBreakdown.push({
      id: addon.id,
      name: addon.name,
      unitPrice: addon.unitPrice,
      quantity: addon.quantity,
      subtotal,
    });
  }

  const totalAmount = packagePrice + addonsSubtotal;

  const advisoryDepositAmount =
    advisoryDepositPercentage !== undefined
      ? Math.round((totalAmount * advisoryDepositPercentage) / 100)
      : undefined;

  return {
    packagePrice,
    packageName,
    addonsSubtotal,
    totalAmount,
    advisoryDepositAmount,
    addonsBreakdown,
  };
}
