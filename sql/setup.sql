DROP Table IF EXISTS birds CASCADE;
DROP Table IF EXISTS nests CASCADE;
DROP Table IF EXISTS birds_nests;

CREATE TABLE birds (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type TEXT NOT NULL
);

CREATE TABLE nests (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    location TEXT NOT NULL
);

CREATE TABLE birds_nests (
    bird_id BIGINT REFERENCES birds(id),
    nest_id BIGINT REFERENCES nests(id),
    PRIMARY KEY(bird_id, nest_id)
 
);
