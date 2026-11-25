"use client";

import { cn } from "cn";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type * as React from "react";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/common/components/ui/field";
import { Input } from "@/common/components/ui/input";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const tAuth = useTranslations("auth");
  const tBrand = useTranslations("nav");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-lg border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 flex flex-col justify-between space-y-6"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-serif text-base font-semibold">
                  {"G"}
                </div>
                <h1 className="text-2xl font-serif font-bold tracking-tight">
                  {tAuth("welcomeBack")}
                </h1>
                <p className="text-xs text-muted-foreground text-balance font-sans">
                  {tAuth("loginSubtitle")}
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">{tAuth("emailLabel")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={tAuth("emailPlaceholder")}
                  required
                  className="h-9 text-xs"
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">{tAuth("passwordLabel")}</FieldLabel>
                  <Link
                    href="#"
                    className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                  >
                    {tAuth("forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={tAuth("passwordPlaceholder")}
                  required
                  className="h-9 text-xs font-mono"
                />
              </Field>

              <Field>
                <Button type="submit" size="default" className="w-full h-9 font-medium">
                  <Sparkles className="size-3.5 mr-1.5" />
                  <span>{tAuth("signInButton")}</span>
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-xs">
                {tAuth("orDivider")}
              </FieldSeparator>

              <Field>
                <Button variant="outline" size="sm" asChild className="w-full h-8 text-xs">
                  <Link href="/">
                    <ArrowLeft className="size-3 mr-1.5" />
                    <span>{tAuth("backToStorefront")}</span>
                  </Link>
                </Button>
              </Field>
            </FieldGroup>

            <FieldDescription className="text-center text-[11px] text-muted-foreground leading-normal">
              <span>{tAuth("termsNoticePre")} </span>
              <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
                {tAuth("termsOfService")}
              </Link>
              <span> {tAuth("and")} </span>
              <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
                {tAuth("privacyPolicy")}
              </Link>
              <span>{"."}</span>
            </FieldDescription>
          </form>

          {/* Right Visual Panel matching login-04 */}
          <div className="relative hidden flex-col justify-between bg-card border-l border-border p-8 md:flex">
            <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-serif font-medium text-foreground">{tBrand("brand")}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider">{"EST. 2025"}</span>
            </div>

            <div className="relative z-10 space-y-4 my-auto py-12">
              <blockquote className="font-serif text-lg lg:text-xl font-normal italic tracking-tight text-foreground/90 leading-relaxed">
                {`“${tAuth("editorialQuote")}”`}
              </blockquote>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                {tAuth("editorialStudio")}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-4">
              <span>{"Depok • Bandung • Yogyakarta"}</span>
              <span className="font-mono">{"v0.4.0"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
