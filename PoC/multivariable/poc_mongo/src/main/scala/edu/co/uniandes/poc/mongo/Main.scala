package edu.co.uniandes.poc.mongo

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import com.typesafe.scalalogging.LazyLogging
import monix.execution.Scheduler
import scala.concurrent.{ExecutionContext, Future}
import scala.io.StdIn

object Main extends App with RestfulAPI with LazyLogging {

    private val systemName                       = "poc_mongo"
    implicit val system: ActorSystem             = ActorSystem(systemName)
    implicit val materializer                    = ActorMaterializer()
    implicit val scheduler: Scheduler            = Scheduler.Implicits.global
    implicit val ec: ExecutionContext            = ExecutionContext.Implicits.global
    implicit val connector                       = Connector()
    val binding: Future[Http.ServerBinding] = Http().bindAndHandle(
        handler = route,
        interface = "0.0.0.0",
        port = 2020
    )

    logger.info(s"Starting at port 2020")
    StdIn.readLine
    binding.flatMap(_.unbind()).onComplete{_ =>
        logger.info("shutdown")
         system.terminate()
    }
}