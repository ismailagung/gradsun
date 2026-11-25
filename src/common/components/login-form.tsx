"use client";

import { cn } from "cn";
import { ArrowLeft, Lightbulb, LightbulbOff, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/common/components/ui/field";
import { Input } from "@/common/components/ui/input";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const tAuth = useTranslations("auth");
  const tBrand = useTranslations("nav");
  const [showPassword, setShowPassword] = React.useState(false);

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
                <Image
                  src="/gradsun-no-bg.png"
                  alt={tBrand("logoAlt")}
                  width={44}
                  height={44}
                  priority
                  className="size-11 object-contain"
                />
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={tAuth("passwordPlaceholder")}
                    required
                    className="h-9 pr-9 text-xs font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? tAuth("hidePassword") : tAuth("showPassword")}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <Lightbulb className="size-3.5 text-amber-500 fill-amber-500/20" />
                    ) : (
                      <LightbulbOff className="size-3.5" />
                    )}
                  </Button>
                </div>
              </Field>

              <Field>
                <Button type="submit" size="default" className="w-full h-9 font-medium">
                  <Sparkles className="size-3.5 mr-1.5" />
                  <span>{tAuth("signInButton")}</span>
                </Button>
              </Field>

              <Field>
                <Button variant="outline" size="sm" asChild className="w-full h-8 text-xs">
                  <Link href="/">
                    <ArrowLeft className="size-3 mr-1.5" />
                    <span>{tAuth("backToHome")}</span>
                  </Link>
                </Button>
              </Field>
            </FieldGroup>
          </form>

          {/* Right Visual Panel matching login-04 */}
          <div className="relative hidden flex-col justify-between bg-card border-l border-border p-8 md:flex overflow-hidden">
            {/* Subtle soft-blurred Gradsun logo emblem background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <div className="relative size-72 sm:size-80 opacity-15 dark:opacity-20 blur-[2px]">
                <Image
                  src="/gradsun-no-bg.png"
                  alt={tBrand("logoAlt")}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-serif font-medium text-foreground">{tBrand("brand")}</span>
            </div>

            <div className="relative z-10 space-y-4 my-auto py-12">
              <blockquote className="font-serif text-lg lg:text-xl font-normal italic tracking-tight text-foreground/90 leading-relaxed">
                {`“${tAuth("editorialQuote")}”`}
              </blockquote>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                {tAuth("editorialStudio")}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-end text-[11px] text-muted-foreground border-t border-border/60 pt-4">
              <span className="font-mono">{"v0.4.0"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
