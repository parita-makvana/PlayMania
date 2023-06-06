-- Table: public.game_category

-- DROP TABLE IF EXISTS public.game_category;

CREATE TABLE IF NOT EXISTS public.game_category
(
    category_id integer NOT NULL,
    user_age_limit integer,
    category_name character varying(255) COLLATE pg_catalog."default",
    category_description character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT game_category_pkey PRIMARY KEY (category_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.game_category
    OWNER to postgres;