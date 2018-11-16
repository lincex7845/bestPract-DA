package edu.co.uniandes.generator

case class BusinessRecord(
                           businessId: String,
                           name: String,
                           neighborhood: String,
                           address: String,
                           city: String,
                           state: String,
                           postalCode: String,
                           latitude: Double,
                           longitude: Double,
                           stars: Double,
                           reviewCount: Int,
                           isOpen: Int,
                           attributes: String,
                           categories: String,
                           hours: String
                         )
