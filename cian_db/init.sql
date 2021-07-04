create table dbstate
(
  firstRun boolean
);

insert into dbstate values(true);

create table offers
(
  link text primary key
);