package edu.co.uniandes.generator

import com.typesafe.scalalogging.LazyLogging
import org.mongodb.scala.{Completed, Document, MongoClient, MongoCollection, SingleObservable}

import scala.collection.immutable.IndexedSeq

object Main extends App with LazyLogging {
  import edu.co.uniandes.generator.BusinessGenerator._
  import edu.co.uniandes.generator.Helpers._

  val mongoClient = MongoClient("mongodb://localhost:27017/tesis")
  val database = mongoClient.getDatabase("tesis")
  val collection: MongoCollection[Document] = database.getCollection("business")
  logger.info("Connected to mongo")
  def insertMany(records: IndexedSeq[Document]): SingleObservable[Completed] = {
    logger.info(s"Inserting ${records.size} records")
    collection.insertMany(records)
  }
  for (i <- 1 until 301) {
    logger.info(s"It $i")
    val samples = manySamples
    /*val insertAndCount = for {
      _ <- insertMany(samples)
      countResult <- collection.countDocuments()
    } yield countResult*/
    val insert  = insertMany(samples)
    logger.info(s"Count after inserting 10K records: ${insert.headResult()}")
  }

  mongoClient.close()
}
