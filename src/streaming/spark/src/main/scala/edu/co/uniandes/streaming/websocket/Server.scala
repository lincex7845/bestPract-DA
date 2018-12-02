package edu.co.uniandes.streaming.websocket

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import com.typesafe.config.ConfigFactory

import scala.concurrent.ExecutionContext
import scala.io.StdIn

trait Server {

  implicit def system: ActorSystem
  implicit def materializer : ActorMaterializer
  implicit def executionContext: ExecutionContext

  val config = ConfigFactory.defaultApplication()
  val port = config.getInt("server.port")
  val host = config.getString("server.host")
  val wsService = new WebSocketService
  val bindingFuture = Http().bindAndHandle(wsService.route, host, port)
  println(s"Server online at $host:$port\nPress RETURN to stop...")
  StdIn.readLine()
  bindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}
