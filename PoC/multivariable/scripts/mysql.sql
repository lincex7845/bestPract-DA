select * from tesis.business where stars between 4 and 5 limit 0,10;
select count(*) from business;

select stars, count(*) as total from tesis.business group by stars order by total desc;

SELECT @@global.secure_file_priv;
select * from tesis.business into OUTFILE '/var/lib/mysql-files/tesis_business_memory';

SET GLOBAL tmp_table_size = 1024 * 1024 * 1024 * 10;
SET GLOBAL max_heap_table_size = 1024 * 1024 * 1024 * 10;

insert into business_memory select * from business;
alter table business_memory ENGINE = MEMORY;

/*truncate business_memory;*/
select count(*) from business_memory;
select stars, count(*) as total from tesis.business_memory group by stars order by total desc;