package edu.co.uniandes.poc.mongo

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.{Directives, Route}
import com.typesafe.scalalogging.LazyLogging
import de.heikoseeberger.akkahttpcirce.FailFastCirceSupport._
import edu.co.uniandes.poc.mongo.BusinessDAO._
import io.circe.generic.auto._
import monix.execution.Scheduler

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

trait RestfulAPI extends Directives { this: LazyLogging =>

  implicit def ec: ExecutionContext
  implicit def scheduler: Scheduler
  implicit def connector: Connector

  val route: Route = path("business" / "filter"){
    post{
      entity(as[FilterRequest]){r =>
        logger.info(s"executing query:  ${r.query}")
        val query = FilterRequest.toQuery(r)
        onComplete(find(query, 10).runAsync){
          case Success(bs) =>
            complete(StatusCodes.OK -> bs)
          case Failure(ex) =>
            logger.error("An exception raised executing query", ex)
            complete(StatusCodes.InternalServerError)
        }
      }
    }
  }
}
