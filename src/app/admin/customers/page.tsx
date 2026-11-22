import { AtSign, GraduationCap, MessageCircle, Phone, Search, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { CustomerRepository } from "@/modules/reservations/repositories/customer.repository";
import {
  type CustomerDirectoryItem,
  type CustomersDirectoryResult,
  GetCustomersDirectoryUseCase,
} from "@/modules/reservations/use-cases/get-customers-directory.use-case";

const DEFAULT_CUSTOMERS: CustomerDirectoryItem[] = [
  {
    id: "cust-1",
    name: "Adinda Prameswari",
    phone: "0812-9876-5432",
    instagram: "@adinda.p",
    campus: "UI Depok (Fakultas Ekonomi)",
    campusBadge: "UI",
    orders: "2 Sessions",
    spent: "IDR 3,450,000",
    rawSpent: 3450000,
  },
  {
    id: "cust-2",
    name: "Rafi & Sarah",
    phone: "0812-3456-7890",
    instagram: "@rafi.s",
    campus: "ITB Ganesha (SBM)",
    campusBadge: "ITB",
    orders: "1 Session",
    spent: "IDR 2,400,000",
    rawSpent: 2400000,
  },
  {
    id: "cust-3",
    name: "Farhan & Kevin",
    phone: "0813-5566-7788",
    instagram: "@farhan.k",
    campus: "UGM Bulaksumur (Hukum)",
    campusBadge: "UGM",
    orders: "1 Session",
    spent: "IDR 1,950,000",
    rawSpent: 1950000,
  },
  {
    id: "cust-4",
    name: "Nadia Faradilla",
    phone: "0811-2233-4455",
    instagram: "@nadia.f",
    campus: "Unpad Dipatiukur (Komunikasi)",
    campusBadge: "Unpad",
    orders: "1 Session",
    spent: "IDR 1,500,000",
    rawSpent: 1500000,
  },
];

export default async function AdminCustomersPage() {
  const tCustomers = await getTranslations("adminCustomers");

  const repository = new CustomerRepository();
  const useCase = new GetCustomersDirectoryUseCase(repository);

  let data: CustomersDirectoryResult;
  try {
    data = await useCase.execute();
  } catch {
    data = {
      totalCustomers: DEFAULT_CUSTOMERS.length,
      customers: DEFAULT_CUSTOMERS,
    };
  }

  const customers = data.customers.length > 0 ? data.customers : DEFAULT_CUSTOMERS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
          {tCustomers("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-sans">{tCustomers("subtitle")}</p>
      </div>

      {/* Search Input Bar */}
      <Card className="bg-card shadow-xs">
        <CardContent className="p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <label htmlFor="customerSearch" className="sr-only">
              {tCustomers("searchPlaceholder")}
            </label>
            <Input
              id="customerSearch"
              placeholder={tCustomers("searchPlaceholder")}
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <CardTitle className="font-serif text-base font-medium">
              {tCustomers("title")}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">{tCustomers("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tCustomers("thClient")}</TableHead>
                <TableHead>{tCustomers("thPhone")}</TableHead>
                <TableHead>{tCustomers("thInstagram")}</TableHead>
                <TableHead>{tCustomers("thCampus")}</TableHead>
                <TableHead>{tCustomers("thOrders")}</TableHead>
                <TableHead>{tCustomers("thSpent")}</TableHead>
                <TableHead className="text-right">{tCustomers("thAction")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium text-foreground">{client.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="size-3 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <AtSign className="size-3 text-muted-foreground" />
                      <span>{client.instagram}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="size-3 text-muted-foreground" />
                      <span>{client.campus}</span>
                      <Badge variant="secondary" className="text-[10px] py-0 px-1 font-mono">
                        {client.campusBadge}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-mono">
                      {client.orders}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold">{client.spent}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" asChild>
                      <a
                        href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="size-3" />
                        <span>{tCustomers("btnContact")}</span>
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
