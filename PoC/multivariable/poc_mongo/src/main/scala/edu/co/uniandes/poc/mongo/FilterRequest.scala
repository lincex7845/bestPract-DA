package edu.co.uniandes.poc.mongo

import play.api.libs.json.{JsValue, Json}
import reactivemongo.bson.BSONValue
import reactivemongo.play.json.BSONFormats._

case class FilterRequest(query: String)

object FilterRequest{
  def toQuery(r: FilterRequest): BSONValue ={
   val playJson: JsValue = Json.parse(r.query)
    val bson = reactivemongo.play.json.BSONFormats.readAsBSONValue(playJson).get
    bson
  }
}