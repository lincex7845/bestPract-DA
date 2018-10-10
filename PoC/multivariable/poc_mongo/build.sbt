organization := "edu.co.uniandes.poc"
 
name := "mongo"
 
scalaVersion := "2.12.4"
 
resolvers ++= Seq(
  //"spring" at "http://repo.spring.io/plugins-release/",
  "Typesafe repository releases" at "http://repo.typesafe.com/typesafe/releases/"
)

val circeVersion = "0.8.0"
val monixVersion = "2.3.3"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core",
  "io.circe" %% "circe-generic",
  "io.circe" %% "circe-parser"
).map(_ % circeVersion)

 
libraryDependencies ++= Seq(
  "com.typesafe.scala-logging"	%%  "scala-logging"	          % "3.9.0",
  "org.reactivemongo"           %%  "reactivemongo"           % "0.16.0",
  "org.reactivemongo"           %%  "reactivemongo-play-json" % "0.16.0-play26",
  "com.typesafe.play"           %%  "play-json"               % "2.6.1",
  "ch.qos.logback"              %   "logback-classic"         % "1.2.3",
  "com.typesafe.akka"           %% "akka-stream"              % "2.5.11",
  "com.typesafe.akka"           %   "akka-slf4j_2.12"         % "2.5.12",
  "com.typesafe.akka"           %%  "akka-http"               % "10.1.0",
  "de.heikoseeberger"           %%  "akka-http-circe"         % "1.18.1",
  "io.monix"                    %%  "monix"                   % monixVersion,
  "io.monix"                    %%  "monix-cats"              % monixVersion,
)
 
scalacOptions ++= Seq(
  "-deprecation",
  "-encoding", "UTF-8",
  "-feature",
  "-language:existentials",
  "-language:higherKinds",
  "-language:implicitConversions",
  "-unchecked",
  "-Xfatal-warnings",
  "-Xlint",
  "-Yno-adapted-args",
  "-Ywarn-dead-code",
  "-Ywarn-numeric-widen",
  "-Ywarn-value-discard",
  "-Xfuture",
  "-Xcheckinit"
)
 
publishMavenStyle := true
 
pomIncludeRepository := { _ => false }
 
publishArtifact in Test := false

lazy val commonSettings = Seq(
  version := "1.1",
  organization := "edu.co.uniandes.poc",
  scalaVersion := "2.12.4",
  test in assembly := {}
)

lazy val mongo = project.
  settings(commonSettings: _*).
  settings(
    mainClass in assembly := Some("edu.co.uniandes.poc.mongo.Main")
  )

assemblyMergeStrategy in assembly := {
  case PathList("javax", "servlet", xs @ _*)         => MergeStrategy.first
  case PathList(ps @ _*) if ps.last endsWith ".html" => MergeStrategy.first
  case "application.conf"                            => MergeStrategy.concat
  case "unwanted.txt"                                => MergeStrategy.discard
  case x =>
    val oldStrategy = (assemblyMergeStrategy in assembly).value
    oldStrategy(x)
}