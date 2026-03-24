-- CreateEnum
CREATE TYPE "AddedBySource" AS ENUM ('SCAN', 'MANUAL');

-- CreateEnum
CREATE TYPE "ScanType" AS ENUM ('manual', 'periodic');

-- CreateEnum
CREATE TYPE "BannerStatus" AS ENUM ('active', 'inactive', 'testing');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('failed', 'completed', 'in_progress', 'categorizing_cookies', 'active', 'testing');

-- CreateEnum
CREATE TYPE "CookieCategory" AS ENUM ('NECESSARY', 'FUNCTIONAL', 'ANALYTICS', 'PERFORMANCE', 'MARKETING', 'OTHER');

-- CreateEnum
CREATE TYPE "TemplateAttribute" AS ENUM ('accept_all_button_text', 'more_settings_button_text', 'save_preferences_button_text', 'allow_necessary_button_text', 'cookie_banner_notice', 'reference_manager_notice', 'initial_notice_header', 'preference_notice_header', 'necessary_category_description', 'functional_category_description', 'analytics_category_description', 'marketing_category_description');

-- CreateTable
CREATE TABLE "Domain" (
    "domain_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "config" JSONB,
    "screenshot_path" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("domain_id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "scan_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "domain_id" UUID NOT NULL,
    "meta_data" JSONB,
    "type" "ScanType" NOT NULL DEFAULT 'manual',
    "status" "Status" NOT NULL DEFAULT 'in_progress',
    "archived_at" TIMESTAMPTZ,
    "archived_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("scan_id")
);

-- CreateTable
CREATE TABLE "Template" (
    "template_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "languages" JSONB NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "archived_at" TIMESTAMPTZ,
    "archived_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "TemplatesLanguages" (
    "language_id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "attribute" "TemplateAttribute" NOT NULL,
    "translation_uuid" UUID,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "TemplatesLanguages_pkey" PRIMARY KEY ("language_id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "banner_id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "BannerStatus" NOT NULL DEFAULT 'inactive',
    "script_path" TEXT NOT NULL,
    "domain_id" UUID NOT NULL,
    "scan_id" UUID NOT NULL,
    "archived_at" TIMESTAMPTZ,
    "archived_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("banner_id")
);

-- CreateTable
CREATE TABLE "Cookie" (
    "cookie_id" UUID NOT NULL,
    "scan_id" UUID NOT NULL,
    "cookie_master_id" UUID NOT NULL,
    "meta_data" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "added_by_source" "AddedBySource" NOT NULL DEFAULT 'SCAN',

    CONSTRAINT "Cookie_pkey" PRIMARY KEY ("cookie_id")
);

-- CreateTable
CREATE TABLE "CookieMasterLanguage" (
    "language_id" UUID NOT NULL,
    "cookie_master_id" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "CookieMasterLanguage_pkey" PRIMARY KEY ("language_id")
);

-- CreateTable
CREATE TABLE "CookieMaster" (
    "cookie_master_id" UUID NOT NULL,
    "domain_id" UUID NOT NULL,
    "cookie_domain" TEXT NOT NULL,
    "category" "CookieCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "CookieMaster_pkey" PRIMARY KEY ("cookie_master_id")
);

-- CreateTable
CREATE TABLE "SubmittedCookieConsent" (
    "id" UUID NOT NULL,
    "banner_id" UUID NOT NULL,
    "data_principal_id" TEXT NOT NULL,
    "submitted_data" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "SubmittedCookieConsent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_url_key" ON "Domain"("url");

-- CreateIndex
CREATE INDEX "Scan_domain_id_idx" ON "Scan"("domain_id");

-- CreateIndex
CREATE INDEX "TemplatesLanguages_template_id_idx" ON "TemplatesLanguages"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "TemplatesLanguages_template_id_language_attribute_key" ON "TemplatesLanguages"("template_id", "language", "attribute");

-- CreateIndex
CREATE INDEX "Cookie_scan_id_idx" ON "Cookie"("scan_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cookie_scan_id_cookie_master_id_key" ON "Cookie"("scan_id", "cookie_master_id");

-- CreateIndex
CREATE INDEX "CookieMaster_name_domain_id_cookie_domain_idx" ON "CookieMaster"("name", "domain_id", "cookie_domain");

-- CreateIndex
CREATE UNIQUE INDEX "CookieMaster_name_domain_id_cookie_domain_key" ON "CookieMaster"("name", "domain_id", "cookie_domain");

-- CreateIndex
CREATE INDEX "SubmittedCookieConsent_banner_id_idx" ON "SubmittedCookieConsent"("banner_id");

-- CreateIndex
CREATE INDEX "SubmittedCookieConsent_created_at_idx" ON "SubmittedCookieConsent"("created_at");

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplatesLanguages" ADD CONSTRAINT "TemplatesLanguages_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_scan_id_fkey" FOREIGN KEY ("scan_id") REFERENCES "Scan"("scan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cookie" ADD CONSTRAINT "Cookie_scan_id_fkey" FOREIGN KEY ("scan_id") REFERENCES "Scan"("scan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cookie" ADD CONSTRAINT "Cookie_cookie_master_id_fkey" FOREIGN KEY ("cookie_master_id") REFERENCES "CookieMaster"("cookie_master_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CookieMasterLanguage" ADD CONSTRAINT "CookieMasterLanguage_cookie_master_id_fkey" FOREIGN KEY ("cookie_master_id") REFERENCES "CookieMaster"("cookie_master_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CookieMaster" ADD CONSTRAINT "CookieMaster_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedCookieConsent" ADD CONSTRAINT "SubmittedCookieConsent_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "Banner"("banner_id") ON DELETE RESTRICT ON UPDATE CASCADE;
