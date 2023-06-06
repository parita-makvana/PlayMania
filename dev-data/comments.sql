-- Table: public.comments

-- DROP TABLE IF EXISTS public.comments;

CREATE TABLE IF NOT EXISTS public.comments
(
    comment_id integer NOT NULL,
    user_id integer NOT NULL,
    game_id integer NOT NULL,
    title character varying(80) COLLATE pg_catalog."default" NOT NULL,
    review character varying(255) COLLATE pg_catalog."default" NOT NULL,
    rating_value numeric(2,1) NOT NULL,
    date_posted timestamp without time zone,
    CONSTRAINT comments_pkey PRIMARY KEY (comment_id),
    CONSTRAINT comments_game_id_fkey FOREIGN KEY (game_id)
        REFERENCES public.game (game_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.comments
    OWNER to postgres;