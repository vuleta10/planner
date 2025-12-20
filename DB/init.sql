-- Kreiranje šeme planner
CREATE SCHEMA IF NOT EXISTS planner;

-- Kreiranje tabele user unutar šeme planner
CREATE TABLE IF NOT EXISTS planner."user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Kreiranje tabele task unutar šeme planner
CREATE TABLE IF NOT EXISTS planner.task (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    datum DATE NOT NULL,
    task2do TEXT NOT NULL
);

