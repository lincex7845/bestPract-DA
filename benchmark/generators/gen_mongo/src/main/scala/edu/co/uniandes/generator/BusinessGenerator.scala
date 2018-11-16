package edu.co.uniandes.generator

import com.typesafe.scalalogging.LazyLogging
import edu.co.uniandes.generator.business.BusinessRecord
import org.mongodb.scala.Document
import org.scalacheck.Gen
import org.scalacheck.Gen.Choose

import scala.collection.immutable.IndexedSeq

object BusinessGenerator extends LazyLogging {
  def sample: BusinessRecord = gen.sample.get

  def gen: Gen[BusinessRecord] = {
    for {
      businessId <- Gen.identifier
      name <- Gen.alphaStr
      neighborhood <- Gen.alphaStr
      address <- Gen.alphaStr
      city <- Gen.alphaStr
      state <- Gen.oneOf(List(
        "AZ",
        "BW",
        "EDH",
        "ELN",
        "ESX",
        "FAL",
        "FIF",
        "FLN",
        "HLD",
        "IL",
        "KHL",
        "MLN",
        "NC",
        "NI",
        "NLK",
        "NTH",
        "NV",
        "NY",
        "OH",
        "ON",
        "PA",
        "PKN",
        "QC",
        "SC",
        "SCB",
        "STG",
        "VT",
        "WI",
        "WLN"))
      postalCode <- Gen.alphaStr
      latitude <- latitudeGen[Double]
      longitude <- longitudeGen[Double]
      stars <- Gen.oneOf(List(1.0,
        1.5,
        2.0,
        2.5,
        3.0,
        3.5,
        4.0,
        4.5,
        5.0))
      reviewCount <- Gen.choose(0, 6400)
      isOpen <- Gen.oneOf(List(0, 1))
      attributes <- Gen.listOfN(10, Gen.alphaStr)
      categories <- Gen.listOfN(15, Gen.alphaStr)
      hours <- Gen.const[List[String]](List("Monday 7:0-23:0",
        "Tuesday 7:0-23:0",
        "Wednesday 7:0-23:0",
        "Thursday 7:0-23:0",
        "Friday 7:0-0:0",
        "Saturday 7:0-0:0",
        "Sunday 7:0-23:0"))
    } yield BusinessRecord(
      businessId,
      name,
      neighborhood,
      address,
      city,
      state,
      postalCode,
      latitude,
      longitude,
      stars,
      reviewCount,
      isOpen,
      attributes,
      categories,
      hours)
  }

  def latitudeGen[T](implicit num: Numeric[T], c: Choose[T]): Gen[T] = {
    import num._
    val min = fromInt(-90)
    val max = fromInt(90)
    Gen.sized(n => c.choose(min, max))
  }

  def longitudeGen[T](implicit num: Numeric[T], c: Choose[T]): Gen[T] = {
    import num._
    val min = fromInt(-180)
    val max = fromInt(180)
    Gen.sized(n => c.choose(min, max))
  }

  def manySamples:  IndexedSeq[Document] = {
    logger.info("Generating 10K records")
    val records: IndexedSeq[Document] = Gen.listOfN(10000, gen).sample.get.par.map(BusinessRecord.toDocument).toIndexedSeq
    logger.info("Generated 10K records")
    records
  }
}
