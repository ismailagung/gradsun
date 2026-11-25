import { getTranslations } from "next-intl/server";
import {
  PackagesBookingFlow,
  type PackagesBookingFlowLabels,
  type PackageTierItem,
} from "@/modules/reservations/components/packages-booking-flow";

export default async function PackagesBookingPage() {
  const tPkg = await getTranslations("packagesPage");
  const tPkgSummary = await getTranslations("packagesSummary");

  const packageTiers: PackageTierItem[] = [
    {
      id: "pkg-single-1",
      title: tPkgSummary("pkg1Title"),
      price: tPkgSummary("pkg1Price"),
      dpPrice: "IDR 225,000",
      duration: tPkgSummary("pkg1Duration"),
      scope: tPkgSummary("pkg1Scope"),
      feats: [tPkgSummary("pkg1Feat1"), tPkgSummary("pkg1Feat2"), tPkgSummary("pkg1Feat3")],
      iconType: "single",
    },
    {
      id: "pkg-single-2",
      title: tPkgSummary("pkg2Title"),
      price: tPkgSummary("pkg2Price"),
      dpPrice: "IDR 325,000",
      duration: tPkgSummary("pkg2Duration"),
      scope: tPkgSummary("pkg2Scope"),
      feats: [tPkgSummary("pkg2Feat1"), tPkgSummary("pkg2Feat2"), tPkgSummary("pkg2Feat3")],
      iconType: "sparkles",
    },
    {
      id: "pkg-group-1",
      title: tPkgSummary("pkg3Title"),
      price: tPkgSummary("pkg3Price"),
      dpPrice: "IDR 425,000",
      duration: tPkgSummary("pkg3Duration"),
      scope: tPkgSummary("pkg3Scope"),
      feats: [tPkgSummary("pkg3Feat1"), tPkgSummary("pkg3Feat2"), tPkgSummary("pkg3Feat3")],
      iconType: "group",
    },
    {
      id: "pkg-group-2",
      title: tPkgSummary("pkg4Title"),
      price: tPkgSummary("pkg4Price"),
      dpPrice: "IDR 625,000",
      duration: tPkgSummary("pkg4Duration"),
      scope: tPkgSummary("pkg4Scope"),
      feats: [tPkgSummary("pkg4Feat1"), tPkgSummary("pkg4Feat2"), tPkgSummary("pkg4Feat3")],
      iconType: "group",
    },
  ];

  const flowLabels: PackagesBookingFlowLabels = {
    step1Title: tPkg("step1Title"),
    step2Title: tPkg("step2Title"),
    step3Title: tPkg("step3Title"),
    viewDetails: tPkgSummary("viewDetails"),
    monthYearSelector: tPkg("monthYearSelector"),
    dayMo: tPkg("dayMo"),
    dayTu: tPkg("dayTu"),
    dayWe: tPkg("dayWe"),
    dayTh: tPkg("dayTh"),
    dayFr: tPkg("dayFr"),
    daySa: tPkg("daySa"),
    daySu: tPkg("daySu"),
    selectedDateTitle: tPkg("selectedDateTitle"),
    selectedDateSubtitle: tPkg("selectedDateSubtitle"),
    operatingHoursBadge: tPkg("operatingHoursBadge"),
    timePickerTitle: tPkg("timePickerTitle"),
    timePickerSubtitle: tPkg("timePickerSubtitle"),
    bookedSlotsTitle: tPkg("bookedSlotsTitle"),
    bookedSlotsCount: tPkg("bookedSlotsCount"),
    bookedClient1Name: tPkg("bookedClient1Name"),
    bookedClient1Time: tPkg("bookedClient1Time"),
    bookedClient2Name: tPkg("bookedClient2Name"),
    bookedClient2Time: tPkg("bookedClient2Time"),
    bookedBadge: tPkg("bookedBadge"),
    fullNameLabel: tPkg("fullNameLabel"),
    fullNamePlaceholder: tPkg("fullNamePlaceholder"),
    phoneLabel: tPkg("phoneLabel"),
    phonePlaceholder: tPkg("phonePlaceholder"),
    instagramLabel: tPkg("instagramLabel"),
    instagramPlaceholder: tPkg("instagramPlaceholder"),
    emailLabel: tPkg("emailLabel"),
    emailPlaceholder: tPkg("emailPlaceholder"),
    locationLabel: tPkg("locationLabel"),
    locationPlaceholder: tPkg("locationPlaceholder"),
    notesLabel: tPkg("notesLabel"),
    notesPlaceholder: tPkg("notesPlaceholder"),
    trackingNotice: tPkg("trackingNotice"),
    orderSummaryTitle: tPkg("orderSummaryTitle"),
    summarySlotBadge: tPkg("summarySlotBadge"),
    basePriceLabel: tPkg("basePriceLabel"),
    totalLabel: tPkg("totalLabel"),
    dpAmountLabel: tPkg("dpAmountLabel"),
    dpNotice: tPkg("dpNotice"),
    summaryClientTitle: tPkg("summaryClientTitle"),
    summaryClientEmpty: tPkg("summaryClientEmpty"),
    summaryNameLabel: tPkg("summaryNameLabel"),
    summaryContactLabel: tPkg("summaryContactLabel"),
    summaryIgLabel: tPkg("summaryIgLabel"),
    summaryLocationLabel: tPkg("summaryLocationLabel"),
    summaryNotesLabel: tPkg("summaryNotesLabel"),
    timePickerLabels: {
      sessionStartTimeLabel: tPkg("sessionStartTimeLabel"),
      hour: tPkg("timePickerHour"),
      minute: tPkg("timePickerMinute"),
      bufferTitle: tPkg("bufferNoticeTitle"),
      bufferDesc: tPkg("bufferNoticeDesc"),
      statusAvailable: tPkg("timeStatusAvailable"),
      statusConflict: tPkg("timeStatusConflict"),
      statusDetail: tPkg("timeStatusDetail"),
      conflictDetail: tPkg("timeConflictDetail"),
      durationEst: tPkg("sessionDurationEst"),
      bookedBadge: tPkg("bookedBadge"),
      availableBadge: tPkg("availableBadge"),
      placeholder: tPkg("timePlaceholder"),
    },
    dialogLabels: {
      bookNowCta: tPkg("bookNowCta"),
      orderSentTitle: tPkg("orderSentTitle"),
      orderSentSubtitle: tPkg("orderSentSubtitle"),
      orderSentDesc: tPkg("orderSentDesc"),
      orderRecapPackage: tPkg("orderRecapPackage"),
      orderRecapSchedule: tPkg("orderRecapSchedule"),
      orderRecapClient: tPkg("orderRecapClient"),
      orderRecapLocation: tPkg("orderRecapLocation"),
      orderRecapNotes: tPkg("notesLabel"),
      preliminaryInvoiceTitle: tPkg("preliminaryInvoiceTitle"),
      preliminaryInvoiceDesc: tPkg("preliminaryInvoiceDesc"),
      downloadInvoiceCta: tPkg("downloadInvoiceCta"),
      finishCta: tPkg("finishCta"),
    },
  };

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* Main Reservation Flow */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="pb-10 border-b border-border">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
              {tPkg("headerTitle")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {tPkg("headerSubtitle")}
            </p>
          </div>
        </div>

        {/* Interactive Step-by-Step Flow and Sidebar */}
        <PackagesBookingFlow packages={packageTiers} labels={flowLabels} />
      </main>
    </div>
  );
}
