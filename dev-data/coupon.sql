-- Table: public.coupon

-- DROP TABLE IF EXISTS public.coupon;

CREATE TABLE IF NOT EXISTS public.coupon
(
    coupon_id integer NOT NULL,
    game_id integer NOT NULL,
    coupon_title character varying(50) COLLATE pg_catalog."default" NOT NULL,
    coupon_discount integer NOT NULL,
    coupon_creation_date date NOT NULL,
    CONSTRAINT coupon_pkey PRIMARY KEY (coupon_id),
    CONSTRAINT game_id FOREIGN KEY (game_id)
        REFERENCES public.game (game_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.coupon
    OWNER to postgres;