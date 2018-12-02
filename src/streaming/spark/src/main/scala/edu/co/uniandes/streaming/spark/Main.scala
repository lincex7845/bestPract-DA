package edu.co.uniandes.streaming.spark

import akka.actor.{ActorSystem, Props}
import akka.stream.ActorMaterializer
import com.cybozu.labs.langdetect.DetectorFactory
import edu.co.uniandes.streaming.websocket._
import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.streaming.twitter.TwitterUtils
import org.elasticsearch.spark._

import scala.util.Try

object Main extends App with Server {

  implicit val system = ActorSystem()
  implicit val materializer = ActorMaterializer()
  implicit val executionContext = system.dispatcher

  import SentimentAnalysisUtils._

  DetectorFactory.loadProfile("src/main/resources/profiles")

  def detectLanguage(text: String) : String = {

    Try {
      val detector = DetectorFactory.create()
      detector.append(text)
      detector.detect()
    }.getOrElse("unknown")

  }

  LogUtils.setStreamingLogLevels()

/*
  System.setProperty("twitter4j.oauth.consumerKey", "evKBkwJjSUKd5JyrvffaCqyYH")
  System.setProperty("twitter4j.oauth.consumerSecret", "INlLyELn1NeZOiCS2CW5IRGq2GjJ6c14mpYEvaAa5oLQ6G93Xf")
  System.setProperty("twitter4j.oauth.accessToken", "787420460237647872-LNSpjnhknRPOi23BKkbWDWdoWh800fb")
  System.setProperty("twitter4j.oauth.accessTokenSecret", "sg9t66LEEtWrkdocOXWQ2P0VytP3WFt0HXN0fYpipoXfv")
 */
  System.setProperty("twitter4j.oauth.consumerKey", "lIZ6N20nzxyzXYlozmXttIzU7")
  System.setProperty("twitter4j.oauth.consumerSecret", "1JFMPTef2kOE6vauzqnHNqW5v15fhMpTnKWlasDmvwX1GIgprR")
  System.setProperty("twitter4j.oauth.accessToken", "438501505-UJ5533OEOqVv4nOtneRO1ipkUmuBEiMeedIJ3jF8")
  System.setProperty("twitter4j.oauth.accessTokenSecret", "pDDbWkEPCCIEPWa1kGizB95uOON3DZkL4KZ1R5ynSHyIX")


  val tweetsActor = system.actorOf(Props[TweetActor], name = "tweetsActor")
  tweetsActor ! StartStream

  val conf = new SparkConf().setAppName("TwitterSentimentAnalysis")
  conf.set("es.index.auto.create", "true")
  val sc = new SparkContext(conf)

  val ssc = new StreamingContext(sc, Seconds(1))

  val tweets = TwitterUtils.createStream(ssc, None)
  tweets.print()
  tweets.foreachRDD{(rdd, time) =>
    rdd.map(t => {

      val user = t.getUser.getScreenName
      val createdAt = t.getCreatedAt.toInstant.toEpochMilli
      val text = t.getText
      val retweeted = t.getRetweetCount
      val hashtags = t.getHashtagEntities.map(_.getText)
      val language = detectLanguage(t.getText)
      val sentiment = detectSentiment(t.getText).toString

      import spray.json._
      import DefaultJsonProtocol._
      implicit val tweetFormat = jsonFormat7(Tweet)
      val tweet = Tweet(user, createdAt, text, hashtags.toList, retweeted, language, sentiment)
      val msg = NewTweet(tweet.toJson.toString, tweetsActor)
      tweetsActor ! msg

      Map(
        "user"-> user,
        "created_at" -> createdAt,
        "text" -> text,
        "hashtags" -> hashtags,
        "retweet" -> retweeted,
        "lang" -> language,
        "sentiment" -> sentiment
      )
    }).saveToEs("twitter/tweet")
  }

  ssc.start()
  ssc.awaitTermination()

}
