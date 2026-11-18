import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "@/common/components/ui/badge";
import { Button, buttonVariants } from "@/common/components/ui/button";
import { Calendar } from "@/common/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Input } from "@/common/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";

describe("UI Primitives Governance & Ergonomics", () => {
  it("Button: defaults to compact desktop height h-8 (32px)", () => {
    const classes = buttonVariants({ size: "default" });
    expect(classes).toContain("h-8");
  });

  it("Button: provides touch target height h-11 (44px) for mobile size=lg", () => {
    const classes = buttonVariants({ size: "lg" });
    expect(classes).toContain("h-11");
    expect(classes).toContain("min-h-11");
  });

  it("Button: provides accessible destructive styling", () => {
    const classes = buttonVariants({ variant: "destructive" });
    expect(classes).toContain("bg-destructive");
  });

  it("Badge: provides status variants", () => {
    const defaultBadge = badgeVariants({ variant: "default" });
    const secondaryBadge = badgeVariants({ variant: "secondary" });
    const destructiveBadge = badgeVariants({ variant: "destructive" });

    expect(defaultBadge).toContain("bg-primary");
    expect(secondaryBadge).toContain("bg-secondary");
    expect(destructiveBadge).toContain("bg-destructive");
  });

  it("Primitives export functions cleanly for composition", () => {
    expect(typeof Button).toBe("function");
    expect(typeof Badge).toBe("function");
    expect(typeof Input).toBe("function");
    expect(typeof Table).toBe("function");
    expect(typeof TableHeader).toBe("function");
    expect(typeof TableBody).toBe("function");
    expect(typeof TableRow).toBe("function");
    expect(typeof TableHead).toBe("function");
    expect(typeof TableCell).toBe("function");
    expect(typeof Card).toBe("function");
    expect(typeof CardHeader).toBe("function");
    expect(typeof CardTitle).toBe("function");
    expect(typeof CardDescription).toBe("function");
    expect(typeof CardContent).toBe("function");
    expect(typeof CardFooter).toBe("function");
    expect(typeof Dialog).toBe("function");
    expect(typeof DialogTrigger).toBe("function");
    expect(typeof DialogContent).toBe("function");
    expect(typeof DialogHeader).toBe("function");
    expect(typeof DialogTitle).toBe("function");
    expect(typeof Select).toBe("function");
    expect(typeof SelectTrigger).toBe("function");
    expect(typeof SelectValue).toBe("function");
    expect(typeof SelectContent).toBe("function");
    expect(typeof SelectItem).toBe("function");
    expect(typeof Calendar).toBe("function");
    expect(typeof DropdownMenu).toBe("function");
    expect(typeof DropdownMenuTrigger).toBe("function");
    expect(typeof DropdownMenuContent).toBe("function");
    expect(typeof DropdownMenuItem).toBe("function");
  });
});
