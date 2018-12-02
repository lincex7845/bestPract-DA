package edu.co.uniandes.streaming.websocket

import akka.actor.{Actor, ActorRef}

import scala.collection.mutable.ListBuffer

trait Event
case class StartStream() extends Event
case class NewTweet(tweet: String, actorRef: ActorRef) extends Event
case class LatestTweet(tweet: String) extends Event
case class StopStream() extends Event

case class TweetWithActor(tweet: String, actor: ActorRef)

class TweetActor extends Actor {

  val tweets: ListBuffer[TweetWithActor] = collection.mutable.ListBuffer[TweetWithActor]()


  override def receive: Receive = {
    case StartStream =>
      tweets.clear()
    case NewTweet(t, a) =>
      println(s"New tweet $t")
      if(tweets.size > 10000)
        tweets.clear()
      tweets += TweetWithActor(t, a)
      a ! LatestTweet(t)
    case StopStream =>
      tweets.clear()
  }
}
