-- CreateTable
CREATE TABLE "public"."Config" (
    "id" UUID NOT NULL,
    "domain_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Config_domain_id_idx" ON "public"."Config"("domain_id");

-- CreateIndex
CREATE UNIQUE INDEX "Config_domain_id_type_key" ON "public"."Config"("domain_id", "type");

-- AddForeignKey
ALTER TABLE "public"."Config" ADD CONSTRAINT "Config_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."Domain"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;
