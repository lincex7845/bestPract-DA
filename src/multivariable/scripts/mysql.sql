select * from tesis.business where stars between 4 and 5 limit 0,10;
select count(*) from business;

/*histogram*/
select stars, count(*) as records from tesis.business group by stars order by records desc;

SELECT @@global.secure_file_priv;
select * from tesis.business into OUTFILE '/var/lib/mysql-files/tesis_business_memory';

SET GLOBAL tmp_table_size = 1024 * 1024 * 1024 * 10;
SET GLOBAL max_heap_table_size = 1024 * 1024 * 1024 * 10;

insert into business_memory select * from business;
alter table business_memory ENGINE = MEMORY;

/*truncate business_memory;*/
select count(*) from business_memory;

select * from tesis.business 
where stars between 4 and 5 
/*and (review_count is NULL or review_count = '')*/
limit 0,10;

select distinct stars from business;

/*histogram*/
select stars, count(*) as total from business_memory group by stars order by total desc;

select state, stars, avg(review_count) as avg_review_count from business
 group by state, stars order by state, stars;

/*HEATMAP*/ 
select t.state, t.stars, avg(t.review_count) as avg_review_count from 
(select state, stars, review_count from business_memory) t
group by state, stars
order by state, stars;

/*
CREATE INDEX RATINGS ON tesis.business (stars);
CREATE INDEX REVIEWS ON tesis.business (review_count);
CREATE INDEX STATES ON tesis.business (state);

CREATE INDEX RATINGS ON tesis.business_memory (stars);
CREATE INDEX REVIEWS ON tesis.business_memory (review_count);
CREATE INDEX STATES ON tesis.business_memory (state);

CREATE INDEX RATINGS ON tesis.business_memory_2 (stars);
CREATE INDEX REVIEWS ON tesis.business_memory_2 (review_count);
CREATE INDEX STATES ON tesis.business_memory_2 (state);

CREATE INDEX RATINGS ON tesis.heatmap_business_view (stars);
CREATE INDEX REVIEWS ON tesis.business_memory_2 (review_count);
CREATE INDEX STATES ON tesis.business_memory_2 (state);

*/

create table business_memory_2 select * from business;
select count(*) from business_memory_2;
alter table business_memory_2 ENGINE = MEMORY;

/*HISTOGRAM*/
select stars, count(*) as records from tesis.business_memory_2
group by stars order by records desc;
select stars, count(*) as records from tesis.business
group by stars order by records desc;
/*HEATMAP*/ 
select state, stars, avg(review_count) as avg_review_count
from business_memory_2
group by state, stars order by state, stars;

create view heatmap_business_view as
select state, stars, avg(review_count) as avg_review_count
from business
group by state, stars order by state, stars;

create table heatmap_business_view_mat as
select state, stars, avg(review_count) as avg_review_count
from business
group by state, stars order by state, stars;

select t.state, t.stars, avg(t.review_count) as avg_review_count from 
(select state, stars, review_count from business) t
group by state, stars
order by state, stars;

SELECT * FROM tesis.heatmap_business_view_mat;

CREATE INDEX RATINGS ON tesis.heatmap_business_view_mat (stars);
CREATE INDEX REVIEWS_avg ON tesis.heatmap_business_view_mat (avg_review_count);
CREATE INDEX STATES ON tesis.heatmap_business_view_mat (state);