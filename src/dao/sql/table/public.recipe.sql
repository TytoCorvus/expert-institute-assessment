DO
$do$
BEGIN
CREATE TABLE IF NOT EXISTS public.recipe
(
    cocktail_id integer NOT NULL,
    ingredient character varying COLLATE pg_catalog."default" NOT NULL,
    unit character varying COLLATE pg_catalog."default" NOT NULL,
    amount double precision NOT NULL,
    CONSTRAINT recipe_pkey PRIMARY KEY (cocktail_id, ingredient),
    CONSTRAINT recipe_cocktail_exists FOREIGN KEY (cocktail_id)
        REFERENCES public.cocktail (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.recipe
    OWNER to postgres;
END
$do$