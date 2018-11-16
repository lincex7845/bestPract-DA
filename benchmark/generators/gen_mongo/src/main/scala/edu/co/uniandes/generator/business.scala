package edu.co.uniandes.generator

import org.mongodb.scala.Document
import org.mongodb.scala.bson.ObjectId

object business {
  case class BusinessRecord(
                             _id: ObjectId,
                             businessId: String,
                             name: String,
                             neighborhood: String,
                             address: String,
                             city: String,
                             state: String,
                             postalCode: String,
                             latitude: Double,
                             longitude: Double,
                             stars: Double,
                             reviewCount: Int,
                             isOpen: Int,
                             attributes: List[String],
                             categories: List[String],
                             hours: List[String]
                           )

  object BusinessRecord {
    def apply(
               businessId: String,
               name: String,
               neighborhood: String,
               address: String,
               city: String,
               state: String,
               postalCode: String,
               latitude: Double,
               longitude: Double,
               stars: Double,
               reviewCount: Int,
               isOpen: Int,
               attributes: List[String],
               categories: List[String],
               hours: List[String]
             ): BusinessRecord =
      new BusinessRecord(new ObjectId, businessId, name, neighborhood, address,
        city, state, postalCode, latitude, longitude, stars, reviewCount, isOpen,
        attributes, categories, hours)


    def toDocument(t: BusinessRecord): Document =
      Document(
        "business_id" -> t.businessId,
        "name" -> t.name,
        "neighborhood" -> t.neighborhood,
        "address" -> t.address,
        "city" -> t.city,
        "state" -> t.state,
        "postal_code" -> t.postalCode,
        "latitude" -> t.latitude,
        "longitude" -> t.longitude,
        "stars" -> t.stars,
        "review_count" -> t.reviewCount,
        "is_open" -> t.isOpen,
        "attributes" -> t.attributes,
        "categories" -> t.categories,
        "hours" -> t.hours
      )
  }
}
