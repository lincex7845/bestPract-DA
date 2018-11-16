package edu.co.uniandes.generator

import kantan.csv._
import kantan.csv.ops._
import kantan.csv.generic._
import com.typesafe.scalalogging.LazyLogging

import scala.collection.mutable.ListBuffer

object Main extends App with LazyLogging {

  import BusinessGenerator._
  val records = 500000
  val out = java.io.File.createTempFile("/tmp/mapd-", ".csv")
  val writer = out.asCsvWriter[BusinessRecord](rfc.withHeader("business_id","name","neighborhood","address","city","state","postal_code","latitude","longitude","stars","review_count","is_open","attributes","categories","hours", "type"))
  val ps = ListBuffer.empty[BusinessRecord]
  for(i <- 0 until records){
    logger.info(s"record $i")
    ps.append(sample)
  }
  logger.info("writing file")
  writer.write(ps).close()

}
