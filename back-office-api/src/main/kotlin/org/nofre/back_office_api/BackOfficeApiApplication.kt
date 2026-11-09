package org.nofre.back_office_api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication


@SpringBootApplication
@ConfigurationPropertiesScan
class BackOfficeApiApplication

fun main(args: Array<String>) {
    runApplication<BackOfficeApiApplication>(*args)
}


