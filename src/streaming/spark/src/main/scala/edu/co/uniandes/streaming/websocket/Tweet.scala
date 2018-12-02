package edu.co.uniandes.streaming.websocket

case class Tweet(
        user: String,
        created_at: Long,
        text: String,
        hashtags: List[String],
        retweet: Int,
        lang: String,
        sentiment: String
                )
