package edu.co.uniandes.poc.mongo

import monix.eval.Task
import reactivemongo.api.collections.bson.BSONCollection
import reactivemongo.api.{DefaultDB, MongoConnection, MongoDriver}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

case class Connector(uri: String = "mongodb://localhost:27017/tesis")(implicit ec: ExecutionContext) {

  private def getConnection(uri: String): Try[MongoConnection]= {
    val driver = MongoDriver()
    val parseUri: Try[MongoConnection.ParsedURI] = MongoConnection.parseURI(uri)
    parseUri.map(driver.connection)
  }

  def getDB(dbName: String): Task[DefaultDB] = {
    Task.deferFuture(
      for{
        conn <- Future.fromTry(getConnection(uri))
        db <- conn.database(dbName)
      } yield db
    )
  }

  def getCollection(dbName: String, collectionName: String): Task[BSONCollection] = {
    for{
      db <- getDB(dbName)
    }yield db.collection(collectionName) : BSONCollection
  }

  val businessCollection: Task[BSONCollection] = getCollection("tesis", "business")
}
