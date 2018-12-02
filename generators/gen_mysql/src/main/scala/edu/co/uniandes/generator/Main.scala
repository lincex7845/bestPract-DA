package edu.co.uniandes.generator

import java.sql.{Connection, DriverManager, PreparedStatement}

import com.typesafe.scalalogging.LazyLogging

object Main extends App with LazyLogging {

  import BusinessGenerator._

  val url: String = "jdbc:mysql://localhost/tesis?useServerPrepStmts=false&rewriteBatchedStatements=true"
  val driver: String = "com.mysql.jdbc.Driver"
  val username: String = sys.env("MYSQL_USER")
  val password: String = sys.env("MYSQL_PASSWD")
  val insertStatement = "insert into business (business_id,name,neighborhood,address,city,state,postal_code,latitude,longitude,stars,review_count,is_open,attributes,categories,hours)" +
    " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  var connection: Connection = _
  try {
    Class.forName(driver).newInstance()
    connection = DriverManager.getConnection(url, username, password)
    connection.setAutoCommit(false)
    for (i <- 0 until 1701) {
      logger.info(s"It $i")
      val sample = manySamples
      executeStatements(sample)(connection)
      logger.info("commit")
      connection.commit()
    }
  } catch {
    case e: Exception =>
      logger.error("Error connecting to MySQL", e)
  }
  connection.commit()
  connection.close

  def getInsert(record: BusinessRecord)(connection: Connection): PreparedStatement = {
    val preparedStmt = connection.prepareStatement(insertStatement)
    preparedStmt.setString(1, record.businessId)
    preparedStmt.setString(2, record.name)
    preparedStmt.setString(3, record.neighborhood)
    preparedStmt.setString(4, record.address)
    preparedStmt.setString(5, record.city)
    preparedStmt.setString(6, record.state)
    preparedStmt.setString(7, record.postalCode)
    preparedStmt.setDouble(8, record.latitude)
    preparedStmt.setDouble(9, record.longitude)
    preparedStmt.setDouble(10, record.stars)
    preparedStmt.setInt(11, record.reviewCount)
    preparedStmt.setInt(12, record.isOpen)
    preparedStmt.setString(13, record.attributes)
    preparedStmt.setString(14, record.categories)
    preparedStmt.setString(15, record.hours)
    preparedStmt
  }

  def executeStatements(records: List[BusinessRecord])(connection: Connection): Unit = {
    var i = 0
    records.foreach { r =>
      val statement = getInsert(r)(connection)
      statement.addBatch()
      i = i + 1
      if (i == records.size)
        logger.info("Executing batch")
      statement.executeBatch()
    }
  }

}
