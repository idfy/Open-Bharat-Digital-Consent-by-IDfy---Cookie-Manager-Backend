-- CreateTable
CREATE TABLE "public"."EventAnalytics" (
    "id" UUID NOT NULL,
    "banner_id" UUID NOT NULL,
    "data_principal_id" TEXT NOT NULL,
    "user_event" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "EventAnalytics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EventAnalytics" ADD CONSTRAINT "EventAnalytics_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "public"."Banner"("banner_id") ON DELETE RESTRICT ON UPDATE CASCADE;
