import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const tApp = await getTranslations("app");
  const tBooking = await getTranslations("booking");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{tApp("title")}</h1>
        <p className="text-muted-foreground">{tApp("description")}</p>
        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{tBooking("title")}</h2>
          <p className="text-sm text-muted-foreground">{tBooking("subtitle")}</p>
        </div>
      </div>
    </main>
  );
}
