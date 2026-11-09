package org.nofre.back_office_api

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.modulith.core.ApplicationModules
import org.springframework.modulith.docs.Documenter

@SpringBootTest
class BackendApiApplicationTests {

    @Test
    fun contextLoads() {
    }

    @Test
    fun `verify modules and document them`() {
        val modules = ApplicationModules.of(BackOfficeApiApplication::class.java)
        modules.verify()

        Documenter(modules).writeDocumentation()
            .writeModulesAsPlantUml()
            .writeIndividualModulesAsPlantUml()
    }


}
