package edu.co.uniandes.poc.mongo

import monix.eval.Task
import reactivemongo.api.Cursor
import reactivemongo.bson.{BSONDocument, BSONDocumentReader}

import scala.concurrent.ExecutionContext

case class BusinessRecord(
                         businessId: String,
                         name: String,
                         neighborhood: String,
                         address: String,
                         city: String,
                         state: String,
                         postalCode: String,
                         latitude: Double,
                         longitude: Double,
                         stars: Int,
                         reviewCount: Int,
                         isOpen: Int,
                         attributes: List[Map[String, Boolean]],
                         categories: List[String],
                         hours: List[String]
                         )

object BusinessRecord {
  import reactivemongo.bson.DefaultBSONHandlers._

  implicit object BusinessReader extends BSONDocumentReader[BusinessRecord]{
    override def read(bson: BSONDocument): BusinessRecord = {
      val businessId = bson.getAs[String]("business_id").getOrElse("")
      val name = bson.getAs[String]("name").getOrElse("")
      val neighborhood = bson.getAs[String]("neighborhood").getOrElse("")
      val address = bson.getAs[String]("address").getOrElse("")
      val city = bson.getAs[String]("city").getOrElse("")
      val state = bson.getAs[String]("state").getOrElse("")
      val postalCode = bson.getAs[String]("postal_code").getOrElse("")
      val latitude = bson.getAs[Double]("latitude").getOrElse(0d)
      val longitude = bson.getAs[Double]("longitude").getOrElse(0d)
      val stars = bson.getAs[Int]("stars").getOrElse(0)
      val reviewCount = bson.getAs[Int]("review_count").getOrElse(0)
      val isOpen = bson.getAs[Int]("is_open").getOrElse(0)
      val attributes = bson.getAs[List[Map[String, Boolean]]]("attributes").getOrElse(List.empty)
      val categories = bson.getAs[List[String]]("categories").getOrElse(List.empty)
      val hours = bson.getAs[List[String]]("hours").getOrElse(List.empty)
      BusinessRecord(businessId,name, neighborhood, address, city, state, postalCode, latitude, longitude, stars, reviewCount, isOpen, attributes, categories, hours)
    }
  }
}

trait BusinessDAO {

  import scala.concurrent.duration._

  def find(query: BSONDocument, maxDocs: Int)(implicit ec: ExecutionContext, c: Connector): Task[List[BusinessRecord]] = {
   for{
     collection <- c.businessCollection
     records <- Task.deferFuture(collection.find(query, None)
       .cursor[BusinessRecord]()
       .collect[List](
       maxDocs,
       Cursor.FailOnError[List[BusinessRecord]]())
     ).timeout(30.seconds)
   } yield records
  }
}

object BusinessDAO extends BusinessDAO