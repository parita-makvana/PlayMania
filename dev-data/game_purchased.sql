-- Table: public.game_purchased

-- DROP TABLE IF EXISTS public.game_purchased;

CREATE TABLE IF NOT EXISTS public.game_purchased
(
    buyer_id integer NOT NULL,
    user_id integer NOT NULL,
    game_id integer NOT NULL,
    coupon_used integer NOT NULL DEFAULT 0,
    CONSTRAINT game_purchased_pkey PRIMARY KEY (buyer_id),
    CONSTRAINT game_purchased_coupon_used_fkey FOREIGN KEY (coupon_used)
        REFERENCES public.coupon (coupon_id) MATCH SIMPLE
        ON UPDATE SET DEFAULT
        ON DELETE SET DEFAULT,
    CONSTRAINT game_purchased_game_id_fkey FOREIGN KEY (game_id)
        REFERENCES public.game (game_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT game_purchased_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.game_purchased
    OWNER to postgres;