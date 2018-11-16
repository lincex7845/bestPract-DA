organization := "edu.co.uniandes.generator"

name := "mongo"

scalaVersion := "2.12.4"

resolvers ++= Seq(
  "Typesafe repository releases" at "http://repo.typesafe.com/typesafe/releases/"
)


libraryDependencies ++= Seq(
  "org.mongodb.scala" %% "mongo-scala-driver" % "2.4.2",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.0",
  "ch.qos.logback" % "logback-classic" % "1.2.3",
  "com.typesafe.akka" % "akka-slf4j_2.12" % "2.5.12",
  "org.scalacheck" %% "scalacheck" % "1.14.0"
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
  organization := "edu.co.uniandes.generator",
  scalaVersion := "2.12.4",
  test in assembly := {}
)

lazy val mongo = project.
  settings(commonSettings: _*).
  settings(
    mainClass in assembly := Some("edu.co.uniandes.generator.Main")
  )

assemblyMergeStrategy in assembly := {
  case PathList("javax", "servlet", xs@_*) => MergeStrategy.first
  case PathList(ps@_*) if ps.last endsWith ".html" => MergeStrategy.first
  case "application.conf" => MergeStrategy.concat
  case "unwanted.txt" => MergeStrategy.discard
  case PathList("META-INF", xs@_*) => MergeStrategy.discard
  case x =>
    val oldStrategy = (assemblyMergeStrategy in assembly).value
    oldStrategy(x)
}