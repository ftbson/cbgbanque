ALTER TABLE "users" ADD "signup_locale" text DEFAULT 'FR' NOT NULL;
--> statement-breakpoint
UPDATE "users" SET "signup_locale" = CASE
  WHEN lower("residence_country") LIKE '%span%' OR lower("residence_country") LIKE '%espagn%' OR lower("residence_country") = 'es' THEN 'ES'
  WHEN lower("residence_country") LIKE '%german%' OR lower("residence_country") LIKE '%allemagn%' OR lower("residence_country") LIKE '%deutschland%' OR lower("residence_country") = 'de' THEN 'DE'
  ELSE 'FR'
END;
