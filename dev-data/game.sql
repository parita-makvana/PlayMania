-- Table: public.game

-- DROP TABLE IF EXISTS public.game;

CREATE TABLE IF NOT EXISTS public.game
(
    game_id integer NOT NULL,
    game_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    game_description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    game_size character varying(10) COLLATE pg_catalog."default" NOT NULL,
    price numeric(10,2),
    game_type game_type,
    developer_id integer,
    category_id integer,
    average_rating numeric(2,1),
    published_date timestamp without time zone DEFAULT now(),
    CONSTRAINT game_pkey PRIMARY KEY (game_id),
    CONSTRAINT game_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES public.game_category (category_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT game_developer_id_fkey FOREIGN KEY (developer_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.game
    OWNER to postgres;