DO
$do$
BEGIN
CREATE TABLE IF NOT EXISTS public.cocktail
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 99999 CACHE 1 ),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT cocktail_pkey PRIMARY KEY (id),
    CONSTRAINT unique_name UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE public.cocktail
    OWNER to postgres;
END
$do$