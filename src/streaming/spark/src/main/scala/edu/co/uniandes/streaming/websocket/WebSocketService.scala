package edu.co.uniandes.streaming.websocket

import akka.NotUsed
import akka.actor.{ActorRef, ActorSystem, Props}
import akka.http.scaladsl.model.ws.TextMessage
import akka.http.scaladsl.model.ws.Message
import akka.http.scaladsl.server.{Directives, Route}
import akka.stream.{ActorMaterializer, FlowShape, OverflowStrategy, UniformFanInShape}
import akka.stream.scaladsl.{Flow, GraphDSL, Merge, Sink, Source}

class WebSocketService(implicit val actorSystem: ActorSystem, implicit val actorMaterializer: ActorMaterializer) extends Directives {

  val route: Route = pathPrefix("tweets") {
    get{
      handleWebSocketMessages(flow)
    }
  }

  val tweetActor: ActorRef = actorSystem.actorOf(Props(new TweetActor()))
  val tweetActorSource: Source[Event, ActorRef] = Source.actorRef[Event](5, OverflowStrategy.dropBuffer)

  def flow: Flow[Message, Message, Any] = Flow.fromGraph(GraphDSL.create(tweetActorSource){ implicit builder => twActor =>
    import GraphDSL.Implicits._

    val materialization: PortOps[StartStream] = builder.materializedValue.map(tweetActorRef => StartStream())
    val merge: UniformFanInShape[Event, Event] = builder.add(Merge[Event](2))

    val messagesToEventsFlow: FlowShape[Message, NewTweet] = builder.add(Flow[Message].collect{
      case TextMessage.Strict(tweet) => NewTweet(tweet, tweetActor)
    })

    val eventsToMessagesFlow: FlowShape[Event, TextMessage.Strict] = builder.add(Flow[Event].map{
      case LatestTweet(t) =>
        import spray.json._
        import DefaultJsonProtocol._
        implicit val tweetFormat = jsonFormat7(Tweet)
        TextMessage(t.toJson.toString)
    })

    val tweetActorSink: Sink[Event, NotUsed] = Sink.actorRef[Event](tweetActor, StopStream)

    materialization ~> merge ~> tweetActorSink
    messagesToEventsFlow ~> merge
    twActor ~> eventsToMessagesFlow
    FlowShape(messagesToEventsFlow.in, eventsToMessagesFlow.out)
  })

}
