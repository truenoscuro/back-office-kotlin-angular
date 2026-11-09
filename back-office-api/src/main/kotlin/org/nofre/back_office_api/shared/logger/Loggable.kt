package org.nofre.back_office_api.shared.logger

import org.slf4j.Logger
import org.slf4j.LoggerFactory


interface Loggable

// Extensió inline / lazy vinculada a Loggable
inline val <reified T : Loggable> T.log: Logger
    get() = LoggerFactory.getLogger(T::class.java)