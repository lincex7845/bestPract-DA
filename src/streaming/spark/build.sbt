name := "twitterpoc"

version := "0.1"

scalaVersion := "2.11.12"

resolvers ++= Seq(
  "Typesafe repository releases" at "http://repo.typesafe.com/typesafe/releases/",
  "Maven repository" at "https://repo1.maven.org/maven2/",
  "Sonatype OSS Maven Repository" at "https://oss.sonatype.org/content/repositories/public"
)

val akkaV = "2.4.10"

libraryDependencies ++= Seq(
  "org.apache.spark" %% "spark-core" % "2.3.2" ,
  "org.apache.spark" %% "spark-sql" % "2.3.2" ,
  "org.apache.spark" %% "spark-streaming" % "2.4.0" ,
  "org.apache.bahir" %% "spark-streaming-twitter" % "2.2.2" ,
  "edu.stanford.nlp" % "stanford-corenlp" % "3.5.1",
  "edu.stanford.nlp" % "stanford-corenlp" % "3.5.1" classifier "models",
  "com.cybozu.labs" % "langdetect" % "1.1-20120112",
  "org.elasticsearch" % "elasticsearch-hadoop" % "6.5.1",
  "com.typesafe.akka" %% "akka-stream" % akkaV,
  "com.typesafe.akka" %% "akka-stream-testkit" % akkaV,
  "com.typesafe.akka" %% "akka-http-core" % akkaV,
  "com.typesafe.akka" %% "akka-http-spray-json-experimental" % akkaV,
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
  version := "0.1",
  organization := "edu.co.uniandes.streaming.spark",
  scalaVersion := "2.11.12",
  test in assembly := {}
)

lazy val twitterpoc = project.
  settings(commonSettings: _*).
  settings(
    mainClass in assembly := Some("edu.co.uniandes.streaming.spark")
  )

assemblyMergeStrategy in assembly := {
  case PathList("META-INF", xs @ _*) => MergeStrategy.discard
  case x => MergeStrategy.first
}
