import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/common/components/login-form";

export async function generateMetadata(): Promise<Metadata> {
  const tAuth = await getTranslations("auth");
  const tBrand = await getTranslations("nav");
  return {
    title: `${tAuth("loginTitle")} | ${tBrand("brand")}`,
    description: tAuth("loginSubtitle"),
  };
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-4 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
